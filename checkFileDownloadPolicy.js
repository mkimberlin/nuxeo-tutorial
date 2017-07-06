#!/usr/bin/env node
const nuxeoFail = require('./nuxeoConnection').nuxeoSales;
const nuxeoSuccess = require('./nuxeoConnection').nuxeoSalesManager;
const northAmericaDomain = require('./tutorialConstants').northAmericaDomain;
const contractToDownload = `${northAmericaDomain}/Beyond Space Travel Agen/To the Moon and back`;

const tryDownload = nuxeo => nuxeo.repository()
    .fetch(contractToDownload)
    .then(contract => contract.fetchBlob())
    .then(blob => console.log('Contract\'s file can be downloaded!'))
    .catch(error => {
        console.log('The contract\'s file can\'t be downloaded, response is:');
        console.log(`${error.response.status} ${error.response.statusText}`);
    });

console.log('Attempting to download as sales user...');
tryDownload(nuxeoFail).then(() => {
    console.log('Attempting to download as sales manager...');
    tryDownload(nuxeoSuccess);
});
