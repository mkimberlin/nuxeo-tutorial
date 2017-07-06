#!/usr/bin/env node
const nuxeo = require('./nuxeoConnection');
const contractToDelete = require('./tutorialConstants').contractToDelete;

nuxeo.repository()
    .delete(contractToDelete)
    .then(res => {
        console.log('Contract has been deleted permanently. Bye bye contract!')
    })
    .catch(error => {
        console.log('Apologies, an error occurred while deleting the contract.');
        console.log(error);
    });
