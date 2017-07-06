#!/usr/bin/env node
const nuxeo = require('./nuxeoConnection').nuxeoAdmin;
const contractToFetch = require('./tutorialConstants').contractToFetch;

nuxeo.repository()
    .fetch(contractToFetch)
    .then(contract => contract.followTransition('delete'))
    .then(contract => {
        console.log('Contract state has been changed. Contract is now as follows:');
        console.log(contract);
    })
    .catch(error => {
        console.log('Apologies, an error occurred while changing the contract state.');
        console.log(error);
    });
