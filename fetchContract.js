#!/usr/bin/env node
const nuxeo = require('./nuxeoConnection').nuxeoAdmin;

nuxeo.schemas('*');
nuxeo.repository().header('depth', 'max')
    .header('fetch.document', 'properties')
    .enricher('document', 'breadcrumb')
    .fetch('/default-domain/workspaces/North America/awesome-tech/skynet-ai-maintenance')
    .then(contract => {
        console.log('Contract has been retrieved');
        console.log(contract);
        console.log('\nAnd here is the document\'s hierarchy to build a breadcrumb navigation:');
        console.log(contract.contextParameters.breadcrumb);
    }).catch(error => {
        console.log(error);
    });
