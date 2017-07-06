#!/usr/bin/env node
const nuxeo = require('./nuxeoConnection').nuxeoAdmin;
const whichDoc = require('./tutorialConstants').northAmericaDomain;
const whichPermission = {
    permission: 'ReadWrite',
    username: 'sales' // seems odd to me that this is a 'username' and not a group
};

nuxeo.repository()
    .fetch(whichDoc)
    .then(doc => doc.addPermission(whichPermission))
    .then(doc => console.log('Permission has been added on the document.'))
    .catch(error => {
        console.log('Apologies, an error occurred while adding the permission.');
        console.log(error);
    });
