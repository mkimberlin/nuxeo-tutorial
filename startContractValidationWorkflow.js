#!/usr/bin/env node
const nuxeo = require('./nuxeoConnection').nuxeoSales;
const contractToFetch = require('./tutorialConstants').contractToFetch;

nuxeo.repository().fetch(contractToFetch)
    .then(contract => {
        if (contract.state !== 'draft') {
            console.log(`Sorry, the contract needs to be in the draft state to launch a validation workflow on it.\nCurrent state is ${contract.state}`);
            return;
        }

        contract.startWorkflow('BCContractValidationWf')
            .then(wf => {
                console.log('Workflow is now started!');
                console.log(`id: ${wf.id}`);
                console.log(`workflow state: ${wf.state}`);
                console.log(`initiated by: ${wf.initiator}`);
            }).catch(error => {
               console.log('Apologies, an error occurred while starting the workflow.');
               console.log(error);
            });
    }).catch(error => {
       console.log('Apologies, an error occurred while fetching the contract.');
       console.log(error);
    });
