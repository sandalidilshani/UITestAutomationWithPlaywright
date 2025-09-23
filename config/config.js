
// Load environment variables
require('dotenv').config({ 
    path: process.env.NODE_ENV 
        ? `${__dirname}/.env.${process.env.NODE_ENV}` 
        : `${__dirname}/.env`
});

const config = {
    // Application Configuration
    app: {
        baseUrl: process.env.BASE_URL || 'https://automationteststore.com',
        port: process.env.PORT || 3000,
        environment: process.env.NODE_ENV || 'development'
    },

    // User Credentials
    credentials: {
        username: process.env.LOGIN_USERNAME || 'Sandali99',
        password: process.env.LOGIN_PASSWORD || 'Sandali@12'
    },

    // Security Configuration
    security: {
        salt: process.env.SALT || 'omg'
    },

    // Test Configuration
    test: {
        timeout: parseInt(process.env.TEST_TIMEOUT) || 30000,
        retries: parseInt(process.env.TEST_RETRIES) || 2,
        workers: parseInt(process.env.TEST_WORKERS) || 1
    },

    // Browser Configuration
    browser: {
        headless: process.env.HEADLESS === 'true',
        slowMo: parseInt(process.env.SLOW_MO) || 0,
        viewport: {
            width: parseInt(process.env.VIEWPORT_WIDTH) || 1280,
            height: parseInt(process.env.VIEWPORT_HEIGHT) || 720
        }
    },

    // Reporting Configuration
    reporting: {
        screenshots: process.env.SCREENSHOTS || 'only-on-failure',
        video: process.env.VIDEO || 'retain-on-failure', 
        trace: process.env.TRACE || 'on-first-retry'
    }
};

module.exports = config;