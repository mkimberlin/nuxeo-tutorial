#!/usr/bin/env node
const nuxeo = require('./nuxeoConnection').nuxeoAdmin;
const whichDoc = require('./tutorialConstants').northAmericaDomain;

nuxeo.repository()
    .enricher('document', 'acls')
    .fetch(whichDoc)
    .then(doc => {
        console.log(`Permissions defined on ${doc.title}:`);
        doc.contextParameters.acls.forEach(acl => console.log(acl));
    })
    .catch(error => {
        console.log('Apologies, an error occurred while retrieving the permissions.');
        console.log(error);
    });
