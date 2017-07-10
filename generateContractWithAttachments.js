#!/usr/bin/env node
const fs = require('fs');
const nuxeo = require('./nuxeoConnection').nuxeoSalesManager;

const filePath = './tmp/';
const northAmericaDomain = require('./tutorialConstants').northAmericaDomain;
const contractToFetch = `${northAmericaDomain}/awesome-tech/awesome-contract`;

console.log('We\'ll launch an automation chain');
console.log('This chain will:');
console.log('- Gather the contract and all of its attachments');
console.log('- Convert them to PDF');
console.log('- Concatenate them all in a single file.');

nuxeo.operation('BCGenerateCompletePDFContract_ac')
    .input(contractToFetch)
    .execute()
    .then(response => {
        console.log('The file has been generated, we\'ll download it now.');
        try {
            const stats = fs.statSync(filePath);
            if (!stats.isDirectory()) {
                console.log(`${filePath} is not a folder.\nPlease check the filePath variable and make sure you  have the proper rights to that folder.`);
                return;
            }

            const writable = fs.createWriteStream(`${filePath}contract-with-attachments.pdf`);
            response.body.pipe(writable);

            console.log('The complete PDF contract has been downloaded!');
            console.log(`You can take a look at it here: ${filePath}contract-with-attachments.pdf`);
        } catch(error) {
            console.log(`The folder where the rendition should be downloaded cannot be accessed.\nPlease check the filePath variable (currently set to: ${filePath})\nand make sure you have write access on that folder.`);
            console.log(error);
        }
    });
