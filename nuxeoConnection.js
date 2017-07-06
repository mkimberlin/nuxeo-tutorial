const Nuxeo = require('nuxeo');

const nuxeo = new Nuxeo({
    auth: {
        method: 'basic',
        username: 'Administrator',
        password: 'Administrator'
    }
});

module.exports = nuxeo;
