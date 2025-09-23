
const config = require('../config/config.js');

const validUser = {
    username: config.credentials.username,
    password: config.credentials.password
};

const errorMessages = {
    invalidCredentials: 'Incorrect login or password provided'
};

const testCases = {};

const testData = {
    TS001_TC03: {
        loginName: 'InvalidUser123',
        password: config.credentials.password
    },
    TS001_TC04: {
        loginName: config.credentials.username,
        password: 'InvalidPassword123!'
    },
    TS001_TC05: {
        loginName: '',
        password: 'TestPassword123!'
    },
    TS001_TC06: {
        loginName: '',
        password: ''
    },
    TS001_TC07: {
        loginName: 'test.user@domain',
        password: 'Pass@Word#123!'
    },
    TS001_TC08: [
        {
            loginName: 'SANDALI99',
            password: config.credentials.password
        },
        {
            loginName: 'SANdali99',
            password: config.credentials.password
        }
    ],
    TS001_TC10: {
        loginName: config.credentials.username,
        wrongPasswords: ['wrongpass1', 'wrongpass2', 'wrongpass3', 'wrongpass4', 'wrongpass5'],
        correctPassword: config.credentials.password
    }
};

module.exports = {
    validUser,
    testData,
    testCases,
    errorMessages
};
