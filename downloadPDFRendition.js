#!/usr/bin/env node
const nuxeo = require('./nuxeoConnection').nuxeoSalesManager;
const northAmericaDomain = require('./tutorialConstants').northAmericaDomain;
const fs = require('fs');
const path = require('path');

const filePath = './tmp/';
const contractToFetch = `${northAmericaDomain}/awesome-tech/awesome-contract`;

nuxeo.schemas('*');

nuxeo.repository().fetch(contractToFetch)
    .then(contract => contract.fetchRenditions())
    .then(renditions => {
        console.log('The following renditions can be called on the contract:');
        console.log(renditions);
        console.log('We will ask for a PDF rendition.');
    }).catch(error => {
        console.log('Apologies, an error occurred while fetching the renditions list.');
        console.log(error);
    });

nuxeo.repository().fetch(contractToFetch)
    .then(contract => contract.fetchRendition('pdf'))
    .then(response => {
        try {
            const stats = fs.statSync(filePath);
            if (!stats.isDirectory()) {
                console.log(`${filePath} is not a folder.\nPlease check the filePath variable and make sure you have the proper rights on that folder.`);
                return;
            }
            const renditionPath = path.join(filePath, 'contract.pdf');
            const writable = fs.createWriteStream(renditionPath);
            response.body.pipe(writable);
            console.log('The PDF rendition has been downloaded.');
            console.log(`You can take a look at it here: ${renditionPath}`);
        } catch (error) {
            console.log(`The folder where the rendition should be downloaded cannot be accessed.\nPlease check the filePath variable (currently set to: ${filePath})\nand make sure you have write access to that folder.`);
            console.log(error);
            return Promise.reject(error);
        }
        return nuxeo.repository().fetch(contractToFetch);
    }).then(contract => {
        console.log('Notice that the contract\'s file remains in its initial format:');
        console.log(contract.properties['file:content']);
    }).catch(error => {
        console.log('Apologies, an error occurred while retrieving the contract.');
        console.log(error);
    });
