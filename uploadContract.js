#!/usr/bin/env node
const Nuxeo = require('nuxeo');
const nuxeo = require('./nuxeoConnection').nuxeoSalesManager;
const path = require('path');
const fs = require('fs');

const northAmericaDomain = require('./tutorialConstants').northAmericaDomain;
const filePath = './AwesomeTech-Contract.docx';
const whereToCreate = `${northAmericaDomain}/awesome-tech`;

fs.stat(filePath, (error, stats) => {
    if (error) {
        console.log(`File cannot be found.\nPlease check the filePath variable (currently set to ${filePath}).`);
        return;
    }

    if (!stats.isFile()) {
        console.log(`${filePath} is not a file.\n Please check the filePath variable.`);
        return;
    }

    const name = path.basename(filePath);
    const blob = new Nuxeo.Blob({
        content: fs.createReadStream(filePath),
        name,
        size: stats.size
    });

    nuxeo.batchUpload()
        .upload(blob)
        .then(uploadedFile => {
            console.log('File is uploaded, we will now create a document to attach it.');
            const contractToCreate = {
                'entity-type': 'document',
                type: 'BCContract',
                name: 'awesome-contract',
                properties: {
                    'dc:title': name,
                    'file:content': uploadedFile.blob
                }
            };
            return nuxeo.repository().create(whereToCreate, contractToCreate, {
                schemas: ['*']
            }).then(contract => {
                console.log('Contract has been created as follows:');
                console.log(contract);
                console.log(`Blob can be downloaded here: ${contract.get('file:content').data}.\nNote that a file security policy restricts downloads to Administrators and members of the managers group.`);
            });
        }).catch(error => {
            console.log(error);
        });
});
