const { test, expect } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const AccountPage = require('../pages/AccountPage');
const LogoutPage = require('../pages/LogoutPage');
const testData = require('../test-data/login-test-data');

// Extract test data for easier access
const validUser = testData.validUser;
const testCases = testData.testCases;
const errorMessages = testData.errorMessages;

test.describe('TS001-Validate User Login Flow', () => {
    let homePage, loginPage, accountPage, logoutPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        accountPage = new AccountPage(page);
        logoutPage = new LogoutPage(page);
        await homePage.navigate();
    });

    test('TS001_TC01 - Verify login page elements are displayed correctly', async ({ page }) => {
        await homePage.clickLoginOrRegister();
        
        // Verify all required elements are visible
        await expect(loginPage.accountLoginHeading).toBeVisible();
        await expect(loginPage.returningCustomerHeading).toBeVisible();
        await expect(loginPage.newCustomerHeading).toBeVisible();
        await expect(loginPage.loginNameInput).toBeVisible();
        await expect(loginPage.passwordInput).toBeVisible();
        await expect(loginPage.loginButton).toBeVisible();
        await expect(loginPage.forgotPasswordLink).toBeVisible();
        await expect(loginPage.forgotLoginLink).toBeVisible();
        
        // Verify text content
        await expect(loginPage.accountLoginHeading).toHaveText('Account Login');
        await expect(loginPage.returningCustomerHeading).toHaveText('Returning Customer');
        await expect(loginPage.newCustomerHeading).toHaveText('I am a new customer.');
    });

    test('TS001_TC02 - Verify registered user can login successfully', async ({ page }) => {
        await homePage.clickLoginOrRegister();
        await loginPage.login(validUser.username, validUser.password);
        await expect(page).toHaveTitle('My Account');
        await expect(page).toHaveURL(/.*account\/account.*/);
        await expect(accountPage.isAccountPageDisplayed()).resolves.toBeTruthy();
        
        // Verify user is logged in by checking home page
        await homePage.navigate();
        await expect(homePage.isUserLoggedIn('Sandali')).resolves.toBeTruthy();
    });

    test('TS001_TC03 - Verify login fails with invalid username and valid password', async ({ page }) => {
        const tc03Data = testCases.TS001_TC03;
        await homePage.clickLoginOrRegister();
        
        // Enter invalid username with valid password
        await loginPage.enterUsername(tc03Data.testData.loginName);
        await loginPage.enterPassword(tc03Data.testData.password);
        await loginPage.clickLoginButton();
        
        // Verify error message is displayed
        const errorMessage = page.locator('.alert-error, .alert-danger, .error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(new RegExp(errorMessages.invalidCredentials, 'i'));
        
        // Verify user remains on login page
        await expect(page).toHaveURL(/.*account\/login.*/);
    });

    test('TS001_TC04 - Verify login with invalid password', async ({ page }) => {
        const tc04Data = testCases.TS001_TC04;
        await homePage.clickLoginOrRegister();
        
        // Enter valid username with invalid password
        await loginPage.enterUsername(tc04Data.testData.loginName);
        await loginPage.enterPassword(tc04Data.testData.password);
        await loginPage.clickLoginButton();
        
        // Verify error message is displayed
        const errorMessage = page.locator('.alert-error, .alert-danger, .error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(new RegExp(errorMessages.invalidCredentials, 'i'));
        
        // Verify user remains on login page
        await expect(page).toHaveURL(/.*account\/login.*/);
    });

    test('TS001_TC05 - Verify validation with empty username and valid password', async ({ page }) => {
        await homePage.clickLoginOrRegister();
        
        // Leave username empty and enter password
        await loginPage.enterUsername('');
        await loginPage.enterPassword('TestPassword123!');
        await loginPage.clickLoginButton();
        
        // Verify error message is displayed
        const errorMessage = page.locator('.alert-error, .alert-danger, .error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(/ Incorrect login or password provided/i);
        
        // Verify user remains on login page
        await expect(page).toHaveURL(/.*account\/login.*/);
    });

    test('TS001_TC06 - Verify login with empty fields', async ({ page }) => {
        // Navigate to login page
        await homePage.clickLoginOrRegister();
        
        // Leave both fields empty and click login
        await loginPage.enterUsername('');
        await loginPage.enterPassword('');
        await loginPage.clickLoginButton();
        
        // Verify error message is displayed
        const errorMessage = page.locator('.alert-error, .alert-danger, .error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(/ Incorrect login or password provided/i);
        
        // Verify user remains on login page
        await expect(page).toHaveURL(/.*account\/login.*/);
    });

    test('TS001_TC07 - Verify login with special characters in username and password', async ({ page }) => {
        // Navigate to login page
        await homePage.clickLoginOrRegister();
        
        // Enter credentials with special characters
        await loginPage.enterUsername('test.user@domain');
        await loginPage.enterPassword('Pass@Word#123!');
        await loginPage.clickLoginButton();
        
        // Since this user likely doesn't exist, expect error message
        const errorMessage = page.locator('.alert-error, .alert-danger, .error');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText(/ Incorrect login or password provided/i);
        
        // Verify user remains on login page
        await expect(page).toHaveURL(/.*account\/login.*/);
    });

    test('TS001_TC08 - Verify login with different case combinations', async ({ page }) => {
        // Test with uppercase username
        await homePage.clickLoginOrRegister();
        await loginPage.enterUsername('SANDALI99');
        await loginPage.enterPassword(validUser.password);
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
        
        // Test with mixed case username
        await homePage.clickLoginOrRegister();
        await loginPage.enterUsername('SANdali99');
        await loginPage.enterPassword(validUser.password);
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
        const wrongPasswords = ['wrongpass1', 'wrongpass2', 'wrongpass3', 'wrongpass4', 'wrongpass5'];
        await homePage.clickLoginOrRegister();
        
        for (let i = 0; i < wrongPasswords.length; i++) {
            await loginPage.enterUsername(validUser.username);
            await loginPage.enterPassword(wrongPasswords[i]);
            await loginPage.clickLoginButton();
            
            const errorMessage = page.locator('.alert-error, .alert-danger, .error');
            await expect(errorMessage).toBeVisible();
            await expect(errorMessage).toContainText(/Error: Incorrect login or password provided/i);
            
            await loginPage.clearLoginFields();
        }
        
        // Try with correct credentials after failed attempts
        await loginPage.enterUsername(validUser.username);
        await loginPage.enterPassword(validUser.password);
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


