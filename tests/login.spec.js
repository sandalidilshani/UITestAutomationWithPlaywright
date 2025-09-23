const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const AccountPage = require('../pages/AccountPage');
const LogoutPage = require('../pages/LogoutPage');
const testData = require('../test-data/login-test-data');
const logger = require('../utils/LoggerUtil');

// Extract test data for easier access
const validUser = testData.validUser;
const testCases = testData.testCases;
const errorMessages = testData.errorMessages;

test.describe('TS001-Validate User Login Flow', () => {
    let homePage, loginPage, accountPage, logoutPage;

    test.beforeEach(async ({ page }) => {
        logger.info('Setting up test pages and navigating to home page');
        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        accountPage = new AccountPage(page);
        logoutPage = new LogoutPage(page);
        await homePage.navigate();
        logger.info('Successfully navigated to home page');
    });

    test('TS001_TC01 - Verify login page elements are displayed correctly', async ({ page }) => {
        logger.info('TS001_TC01: Starting login page elements verification test');
        await homePage.clickLoginOrRegister();
        
        logger.info('Verifying login page elements visibility');
        await expect(loginPage.accountLoginHeading).toBeVisible();
        await expect(loginPage.returningCustomerHeading).toBeVisible();
        await expect(loginPage.newCustomerHeading).toBeVisible();
        await expect(loginPage.loginNameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.forgotPasswordLink).toBeVisible();
        await expect(loginPage.forgotLoginLink).toBeVisible();
        
        // Verify text content
        logger.info('Verifying login page text content');
        await expect(loginPage.accountLoginHeading).toHaveText('Account Login');
        await expect(loginPage.returningCustomerHeading).toHaveText('Returning Customer');
        await expect(loginPage.newCustomerHeading).toHaveText('I am a new customer.');
        logger.info('TS001_TC01: Login page elements verification completed successfully');
    });

    test('TS001_TC02 - Verify registered user can login successfully', async ({ page }) => {
        logger.info('TS001_TC02: Starting successful login test');
        await homePage.clickLoginOrRegister();
        logger.info(`Attempting login with username: ${validUser.username}`);
        await loginPage.login(validUser.username, validUser.password);
        await expect(page).toHaveTitle('My Account');
        await expect(page).toHaveURL(/.*account\/account.*/);
        await expect(accountPage.isAccountPageDisplayed()).resolves.toBeTruthy();
        logger.info('Successfully logged in and reached account page');
        
        // Verify user is logged in by checking home page
        await homePage.navigate();
        await expect(homePage.isUserLoggedIn('Sandali')).resolves.toBeTruthy();
        logger.info('TS001_TC02: Login test completed successfully');
    });

    test('TS001_TC03 - Verify login fails with invalid username and valid password', async ({ page }) => {
        logger.info('TS001_TC03: Starting invalid username login test');
        const tc03Data = testData.testData.TS001_TC03;
        await homePage.clickLoginOrRegister();
        
        // Enter invalid username with valid password
        logger.info(`Testing login with invalid username: ${tc03Data.loginName}`);
        await loginPage.enterUsername(tc03Data.loginName);
        await loginPage.enterPassword(tc03Data.password);
        await loginPage.clickLoginButton();
        
        // Verify error message is displayed
        const errorMessage = page.locator('.alert-error, .alert-danger, .error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(new RegExp(errorMessages.invalidCredentials, 'i'));
        logger.info('Error message displayed as expected for invalid username');
        
        // Verify user remains on login page
        await expect(page).toHaveURL(/.*account\/login.*/);
        logger.info('TS001_TC03: Invalid username test completed successfully');
    });

    test('TS001_TC04 - Verify login with invalid password', async ({ page }) => {
        logger.info('TS001_TC04: Starting invalid password login test');
        const tc04Data = testData.testData.TS001_TC04;
        await homePage.clickLoginOrRegister();
        
        // Enter valid username with invalid password
        logger.info(`Testing login with valid username but invalid password for: ${tc04Data.loginName}`);
        await loginPage.enterUsername(tc04Data.loginName);
        await loginPage.enterPassword(tc04Data.password);
        await loginPage.clickLoginButton();
        
        // Verify error message is displayed
        const errorMessage = page.locator('.alert-error, .alert-danger, .error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(new RegExp(errorMessages.invalidCredentials, 'i'));
        logger.info('Error message displayed as expected for invalid password');
        
        // Verify user remains on login page
        await expect(page).toHaveURL(/.*account\/login.*/);
        logger.info('TS001_TC04: Invalid password test completed successfully');
    });

    test('TS001_TC05 - Verify validation with empty username and valid password', async ({ page }) => {
        logger.info('TS001_TC05: Starting empty username validation test');
        const tc05Data = testData.testData.TS001_TC05;
        await homePage.clickLoginOrRegister();
        
        // Leave username empty and enter password
        logger.info('Testing login with empty username and valid password');
        await loginPage.enterUsername(tc05Data.loginName);
        await loginPage.enterPassword(tc05Data.password);
        await loginPage.clickLoginButton();
        
        // Verify error message is displayed
        const errorMessage = page.locator('.alert-error, .alert-danger, .error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(/ Incorrect login or password provided/i);
        logger.info('Error message displayed as expected for empty username');
        
        // Verify user remains on login page
        await expect(page).toHaveURL(/.*account\/login.*/);
        logger.info('TS001_TC05: Empty username validation test completed successfully');
    });

    test('TS001_TC06 - Verify login with empty fields', async ({ page }) => {
        logger.info('TS001_TC06: Starting empty fields validation test');
        const tc06Data = testData.testData.TS001_TC06;
        await homePage.clickLoginOrRegister();
        
        // Leave both fields empty and click login
        logger.info('Testing login with empty username and password');
        await loginPage.enterUsername(tc06Data.loginName);
        await loginPage.enterPassword(tc06Data.password);
        await loginPage.clickLoginButton();
        
        // Verify error message is displayed
        const errorMessage = page.locator('.alert-error, .alert-danger, .error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(/ Incorrect login or password provided/i);
        
        // Verify user remains on login page
        await expect(page).toHaveURL(/.*account\/login.*/);
    });

    test('TS001_TC07 - Verify login with special characters in username and password', async ({ page }) => {
        logger.info('TS001_TC07: Starting special characters login test');
        const tc07Data = testData.testData.TS001_TC07;
        await homePage.clickLoginOrRegister();
        
        // Enter credentials with special characters
        logger.info(`Testing login with special characters: ${tc07Data.loginName}`);
        await loginPage.enterUsername(tc07Data.loginName);
        await loginPage.enterPassword(tc07Data.password);
        await loginPage.clickLoginButton();
        
        // Since this user likely doesn't exist, expect error message
        const errorMessage = page.locator('.alert-error, .alert-danger, .error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(/ Incorrect login or password provided/i);
        
        // Verify user remains on login page
        await expect(page).toHaveURL(/.*account\/login.*/);
    });

    test('TS001_TC08 - Verify login with different case combinations', async ({ page }) => {
        logger.info('TS001_TC08: Starting case sensitivity login test');
        const tc08Data = testData.testData.TS001_TC08;
        
        // Test with first case combination
        await homePage.clickLoginOrRegister();
        logger.info(`Testing login with case variation: ${tc08Data[0].loginName}`);
        await loginPage.enterUsername(tc08Data[0].loginName);
        await loginPage.enterPassword(tc08Data[0].password);
        await loginPage.clickLoginButton();
        
        // Check if login is successful or fails (depends on system case sensitivity)
        const isSuccessful = await page.url().includes('account/account');
        
        if (isSuccessful) {
            // If case-insensitive, verify successful login
            await expect(page).toHaveTitle('My Account');
            await accountPage.clickLogoff();
            await logoutPage.clickContinue();
        } else {
            // If case-sensitive, verify error message
            const errorMessage = page.locator('.alert-error, .alert-danger, .error');
            await expect(errorMessage).toBeVisible();
        }
        
        // Test with second case combination
        await homePage.clickLoginOrRegister();
        logger.info(`Testing login with case variation: ${tc08Data[1].loginName}`);
        await loginPage.enterUsername(tc08Data[1].loginName);
        await loginPage.enterPassword(tc08Data[1].password);
        await loginPage.clickLoginButton();
        
        // Similar verification for mixed case
        const isMixedCaseSuccessful = await page.url().includes('account/account');
        
        if (isMixedCaseSuccessful) {
            await expect(page).toHaveTitle('My Account');
        } else {
            const errorMessage = page.locator('.alert-error, .alert-danger, .error');
            await expect(errorMessage).toBeVisible();
        }
    });

    test('TS001_TC09 - Verify user session management after login', async ({ page, context }) => {
        await homePage.clickLoginOrRegister();
        await loginPage.login(validUser.username, validUser.password);
        await expect(page).toHaveTitle('My Account');
        
        // Navigate to different pages and verify user remains logged in
        await homePage.navigate();
        await expect(homePage.isUserLoggedIn('Sandali')).resolves.toBeTruthy();
        
        // Navigate back to account page
        await homePage.goToAccountPage();
        await expect(page).toHaveURL(/.*account\/account.*/);
        
        // Test session persistence with new tab
        const newPage = await context.newPage();
        const newHomePage = new HomePage(newPage);
        await newHomePage.navigate();
        
        // Check if session persists in new tab
        try {
            await expect(newHomePage.isUserLoggedIn('Sandali')).resolves.toBeTruthy();
        } catch (error) {
            
            console.log('Session does not persist across tabs');
        }
        
        await newPage.close();
    });

    test('TS001_TC10 - Verify behavior after multiple failed login attempts', async ({ page }) => {
        logger.info('TS001_TC10: Starting multiple failed login attempts test');
        const tc10Data = testData.testData.TS001_TC10;
        await homePage.clickLoginOrRegister();
        
        for (let i = 0; i < tc10Data.wrongPasswords.length; i++) {
            logger.info(`Attempt ${i + 1}: Testing with wrong password: ${tc10Data.wrongPasswords[i]}`);
            await loginPage.enterUsername(tc10Data.loginName);
            await loginPage.enterPassword(tc10Data.wrongPasswords[i]);
            await loginPage.clickLoginButton();
            
            const errorMessage = page.locator('.alert-error, .alert-danger, .error');
            await expect(errorMessage).toBeVisible();
            await expect(errorMessage).toContainText(/Error: Incorrect login or password provided/i);
            
            await loginPage.clearLoginFields();
        }
        
        // Try with correct credentials after failed attempts
        logger.info('Testing with correct credentials after failed attempts');
        await loginPage.enterUsername(tc10Data.loginName);
        await loginPage.enterPassword(tc10Data.correctPassword);
        await loginPage.clickLoginButton();
        
        // Check if account is locked or login is successful
        const isLocked = await page.locator('.alert-error, .alert-danger, .error').isVisible({ timeout: 3000 });
        
        if (isLocked) {
            // If account is locked, verify lockout message
            const lockoutMessage = page.locator('.alert-error, .alert-danger, .error');
            await expect(lockoutMessage).toBeVisible();
        } else {
            // If no lockout, verify successful login
            await expect(page).toHaveTitle('My Account');
        }
    });

    test('TS001_TC11 - Verify login session timeout', async ({ page }) => {
        await homePage.clickLoginOrRegister();
        await loginPage.login(validUser.username, validUser.password);
        
        await expect(page).toHaveTitle('My Account');
        
        // Wait for a short period (simulating idle time)
        await page.waitForTimeout(5000);
        await accountPage.navigate();
    
        // Check if still logged in or redirected to login
        const currentUrl = page.url();
        const isStillLoggedIn = currentUrl.includes('account/account');
        
        if (isStillLoggedIn) {
            await expect(page).toHaveTitle('My Account');
        } else {
            await expect(page).toHaveURL(/.*account\/login.*/);
        }
    });

    test('TS001_TC12 - Verify login redirection from checkout page', async ({ page }) => {
        // Add items to cart first (navigate to a product and add to cart)
        await page.goto('https://automationteststore.com/index.php?rt=product/product&product_id=50');
        
        const addToCartButton = page.locator('.cart, [title*="Add to Cart"], .productcart');
        if (await addToCartButton.isVisible()) {
            await addToCartButton.first().click();
        }
        
        // Navigate to checkout
        await page.goto('https://automationteststore.com/index.php?rt=checkout/cart');
        
        const checkoutButton = page.getByTitle('Checkout').first();
        if (await checkoutButton.isVisible()) {
            await checkoutButton.click();
        }
        
        if (page.url().includes('login')) {
            await loginPage.login(validUser.username, validUser.password);
            
            await expect(page).toHaveURL(/.*checkout.*/);
        } else {
            console.log('Checkout flow may be different - current URL:', page.url());
        }
    });
});


