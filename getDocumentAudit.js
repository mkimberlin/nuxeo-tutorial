#!/usr/bin/env node
const nuxeo = require('./nuxeoConnection').nuxeoAdmin;
const northAmericaDomain = require('./tutorialConstants').northAmericaDomain;

const docToFetch =  `${northAmericaDomain}/awesome-tech/skynet-ai-maintenance`;

nuxeo.repository()
    .fetch(docToFetch)
    .then(doc => doc.fetchAudit())
    .then(audit => {
        console.log('Document\'s audit log is as follows:');
        console.log(audit);
    }).catch(error => {
        console.log('Apologies, an error occurred while retrieving the document\'s audit log.');
        console.log(error);
    });
