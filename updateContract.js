#!/usr/bin/env node
const nuxeo = require('./nuxeoConnection');
let contractToFetch = require('./tutorialConstants').contractToFetch;

nuxeo.schemas('*');

let propertiesToUpdate = {
    'bccontract:customClauses': [{
        label: 'Automatic Subscription Renewal',
        content: 'In case the user has not cancelled its subscription one month before the contract\'s expiration date, the contract will automatically be renewed for one more year.'
    }, {
        label: 'Payment Conditions',
        content: 'When an automatic subscription renewal is triggered, the user will need to pay the annual amount due. This amount will not be refunded if the contract is stopped before its new expiration date.'
    }]
};

nuxeo.repository()
    .fetch(contractToFetch)
    .then(contract => {
        contract.set(propertiesToUpdate);
        return contract.save();
    })
    .then(contract => {
        console.log('Contract has been updated. Custom clauses are now as follows:');
        console.log(contract.properties['bccontract:customClauses']);
    })
    .catch(error => {
        console.log('Apologies, an error occurred while updating the contract.');
        console.log(error);
    });
