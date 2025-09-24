const { test: setup, expect } = require('@playwright/test');
const path = require('path');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const AccountPage = require('../pages/AccountPage');
const testData = require('../test-data/login-test-data');
const logger = require('../utils/LoggerUtil');

const authFile = path.join(__dirname, 'storeLoginContext', 'storageState.json');

setup('authenticate', async ({ page }) => {
  logger.info('Setting up authentication for search tests');

  const homePage = new HomePage(page);
  const loginPage = new LoginPage(page);
  const accountPage = new AccountPage(page);

  // Navigate to login page
  await homePage.navigate();
  await homePage.clickLoginOrRegister();

  // Perform login
  await loginPage.login(testData.validUser.username, testData.validUser.password);

  // Verify login was successful
  await expect(page).toHaveTitle('My Account');
  await expect(page).toHaveURL(/.*account\/account.*/);
  await expect(accountPage.isAccountPageDisplayed()).resolves.toBeTruthy();

  // Save authentication state
  await page.context().storageState({ path: authFile });

  logger.info(`Authentication state saved successfully at: ${authFile}`);
});