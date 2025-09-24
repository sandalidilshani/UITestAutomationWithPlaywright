const { test: base, expect, chromium } = require('@playwright/test');
const path = require('path');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const AccountPage = require('../pages/AccountPage');
const testData = require('../test-data/login-test-data');
const logger = require('../utils/LoggerUtil');
const authFile = path.join(__dirname, 'storeLoginContext', 'storageState.json');

const test = base.extend({
    loginFixture: async ({ page }, use) => {
        logger.info('Setting up login fixture - authenticating user');

        const homePage = new HomePage(page);
        const loginPage = new LoginPage(page);
        const accountPage = new AccountPage(page);

        try {
            // Navigate to login page and perform login
            await homePage.navigate();
            await homePage.clickLoginOrRegister();
            await loginPage.login(testData.validUser.username, testData.validUser.password);
            
            // Verify login was successful
            await page.waitForURL(/.*account\/account.*/, { timeout: 10000 });
            const isAccountPageVisible = await accountPage.isAccountPageDisplayed();
            
            if (!isAccountPageVisible) {
                throw new Error('Login fixture setup failed - Account page is not displayed');
            }

            logger.info('Login fixture setup completed successfully');
            await use(page);
        } catch (error) {
            logger.error(`Login fixture setup failed: ${error.message}`);
            throw error;
        }
    },

    guestFixture: async ({ page }, use) => {
        logger.info('Setting up guest fixture - no authentication required');
        const homePage = new HomePage(page);
        await homePage.navigate();
        logger.info('Guest fixture setup completed successfully');
        await use(page);
    }
});

module.exports = { test, expect };
