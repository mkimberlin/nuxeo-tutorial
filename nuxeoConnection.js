const Nuxeo = require('nuxeo');

const nuxeoAdmin = new Nuxeo({
    auth: {
        method: 'basic',
        username: 'Administrator',
        password: 'Administrator'
    }
});

const nuxeoSales = new Nuxeo({
    auth: {
        method: 'basic',
        username: 'afraser',
        password: 'afraser'
    }
});

const nuxeoSalesManager = new Nuxeo({
    auth: {
        method: 'basic',
        username: 'sconnor',
        password: 'sconnor'
    }
});

module.exports = {
    nuxeoAdmin,
    nuxeoSales,
    nuxeoSalesManager
};
