#!/usr/bin/env node
const nuxeo = require('./nuxeoConnection');
const getContractsQuery =
    `SELECT * from BCContract
       WHERE ecm:isVersion = 0
       AND ecm:currentLifeCycleState != 'deleted'
       AND ecm:fulltext = 'limit%'
       AND bccontract:expirationDate < DATE '2016-01-01'`;

nuxeo.repository()
    .query({
        query: getContractsQuery
    })
    .then(contracts => {
        console.log('The following contracts have been retrieved:');
        console.log(contracts);
    })
    .catch(error => {
        console.log('Apologies, an error occurred while launching the query.');
        console.log(error);
    });
