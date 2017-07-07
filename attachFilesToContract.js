#!/usr/bin/env node
const Nuxeo = require('nuxeo');
const path = require('path');
const fs = require('fs');
const nuxeo = require('./nuxeoConnection').nuxeoSalesManager;
const northAmericaDomain = require('./tutorialConstants').northAmericaDomain;

nuxeo.schemas('*');

const filesPath = '.';
const contractToUpdatePath = `${northAmericaDomain}/awesome-tech/awesome-contract`;
const propertiesToUpdate = {
    'files:files': []
};

fs.readdir(filesPath, (error, files) => {
    if (error) {
        console.log(`Attachments folder cannot be found.\nPlease check the filesPath variable (currently set to ${filesPath}).`);
        return;
    }

    const attachmentsBatch = nuxeo.batchUpload();

    files.forEach(file => {
        if(file.endsWith('.pdf')) {
            try {
                const stats = fs.statSync(`${filesPath}/${file}`);
                if (!stats.isFile()) {
                    console.log(`${file} is not a file. Aborting.`);
                    attachmentsBatch.cancel();
                    return;
                }

                const blob = new Nuxeo.Blob({
                    content: fs.createReadStream(`${filesPath}/${file}`),
                    name: path.basename(`${filesPath}/${file}`),
                    size: stats.size
                });

                attachmentsBatch.upload(blob)
                    .then(uploadedFile => {
                        console.log(`File ${file} has been uploaded.`);
                    })
                    .catch(error => {
                        console.log(`File ${file} could not be uploaded. Aborting.`);
                        console.log(error);
                        attachmentsBatch.cancel();
                    });
            } catch (error) {
                console.log('Apologies, an error occurred while looking for attachments to upload. Aborting.');
                console.log(error);
                attachmentsBatch.cancel();
            }
        } else {
            console.log(`Ignoring ${file}`);
        }
    });

    attachmentsBatch.done()
        .then(uploadedFiles => {
            uploadedFiles.blobs.forEach(currentFile => {
                propertiesToUpdate['files:files'].push({
                    file: {
                        'upload-batch': currentFile['upload-batch'],
                        'upload-fileId': currentFile['fileIdx']
                    }
                })
            });

            return nuxeo.repository().fetch(contractToUpdatePath);
        }).then(contract => {
            contract.set(propertiesToUpdate);
            return contract.save();
        }).then(contract => {
            console.log('Contract has been updated. It contains the following attachments:');
            console.log(contract.properties['files:files']);
        }).catch(error => {
            console.log('Apologies, an error occurred while updating the contract. Aborting.');
            attachmentsBatch.cancel();
            console.log(error);
        });
});
