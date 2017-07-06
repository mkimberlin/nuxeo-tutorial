#!/usr/bin/env node
const nuxeo = require('./nuxeoConnection').nuxeoAdmin;

// Define the portfolio properties first
const portfolioToCreate = {
    'entity-type': 'document',
    'type': 'BCPortfolio',
    'name': 'awesome-tech',
    'properties': {
        'dc:title': 'Awesome Tech Ltd.',
        'bccstm:companyIndustry': 'it',
        'bccstm:companySize': 'medium',
        // Complex properties are sent as objects
        'bccstm:juridicalContact': {
            'firstName': 'John',
            'lastName': 'McLane',
            'tel': '555 123 456',
            'email': 'john.mclane@awesometech.noreply'
        }
    }
};

// Then define the contract properties
const contractToCreate = {
    'entity-type': 'document',
    'type': 'BCContract',
    'name': 'skynet-ai-maintenance',
    'properties': {
        'dc:title': 'Skynet AI Maintenance Contract',
        'bccontract:contractOwner': 'afraser',
        'bccontract:signatureDate': '2050-12-24',
        'bccontract:startDate': '2050-12-25',
        'bccontract:expirationDate': '2055-12-31',
        'bccontract:type': 'maintenance'
    }
};

const whereToCreatePortfolio = '/default-domain/workspaces/North America';

const repository = nuxeo.repository();

// Then create the portfolio and contract
repository
    .create(whereToCreatePortfolio, portfolioToCreate)
    .then(portfolio => {
        console.log('Portfolio has been created as follows:');
        console.log(portfolio);
        return repository.create(portfolio.path, contractToCreate);
    })
    .then(contract => {
        console.log('Contract has been created as follows:');
        console.log(contract);
    })
    .catch(error => {
        console.log('Apologies, an error occurred.');
        console.log(error);
    });
