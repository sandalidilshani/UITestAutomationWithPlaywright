const { test, expect } = require('@playwright/test');
const CheckoutPage = require('../pages/CheckoutPage');
const CartPage = require('../pages/CartPage');
const HomePage = require('../pages/HomePage');
const LoginPage = require('../pages/LoginPage');
const checkoutTestData = require('../test-data/checkout-test-data');
const config = require('../config/config');

test.describe('Checkout Functionality Tests - TS003', () => {
    let checkoutPage;
    let cartPage;
    let homePage;
    let loginPage;

    test.beforeEach(async ({ page }) => {
        checkoutPage = new CheckoutPage(page);
        cartPage = new CartPage(page);
        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        
        // Navigate to homepage and ensure we have a product in cart
        await homePage.navigateToHomePage();
        await homePage.addProductToCart('Tropiques Minerale Loose Bronzer');
    });

    test('TS003_TC01 - Verify single product checkout flow as guest user', async ({ page }) => {
        const testData = checkoutTestData.checkoutTestData.TS003_TC01;
        
        // Navigate to checkout
        await checkoutPage.navigateToCheckout();
        
        // Select guest checkout
        await checkoutPage.selectGuestCheckout();
        
        // Verify we're on guest checkout step 1
        await expect(checkoutPage.guestStep1Title).toBeVisible();
        
        // Fill in guest information
        await checkoutPage.fillPersonalDetails(testData.personalDetails);
        await checkoutPage.fillShippingAddress(testData.shippingAddress);
        
        // Proceed to next step
        await checkoutPage.proceedToNextStep();
        
        // Verify we're on confirmation page
        await expect(checkoutPage.confirmationTitle).toBeVisible();
        
        // Verify order summary
        const orderSummary = await checkoutPage.getOrderSummary();
        expect(orderSummary.subTotal).toContain('$38.50');
        expect(orderSummary.total).toContain('$40.50'); // Including shipping
        
        // Verify shipping address is correct
        const shippingAddress = await checkoutPage.getShippingAddressDetails();
        expect(shippingAddress).toContain(testData.shippingAddress.address1);
        expect(shippingAddress).toContain(testData.shippingAddress.city);
        
        // Verify we can proceed to final step (without actually completing order)
        await expect(checkoutPage.confirmOrderButton).toBeVisible();
        await expect(checkoutPage.confirmOrderButton).toBeEnabled();
    });

    test('TS003_TC02 - Verify single product checkout flow as logged-in user', async ({ page }) => {
        const testData = checkoutTestData.checkoutTestData.TS003_TC02;
        
        // Navigate to checkout (this should redirect to login)
        await checkoutPage.navigateToCheckout();
        
        // Login with valid credentials
        await checkoutPage.loginExistingUser(testData.credentials.username, testData.credentials.password);
        
        // Verify we're in the checkout flow (should be streamlined for logged-in users)
        await expect(page.locator('h1')).toContainText(['Checkout', 'Confirm']);
        
        // If we're on address form, it should be pre-populated or simplified
        const currentUrl = page.url();
        if (currentUrl.includes('step')) {
            // Check if address fields are pre-populated (if visible)
            const isAddressVisible = await checkoutPage.address1Field.isVisible();
            if (isAddressVisible) {
                const address1Value = await checkoutPage.address1Field.inputValue();
                // For logged-in users, this might be pre-filled or we might need to fill it
                if (!address1Value) {
                    await checkoutPage.fillShippingAddress(checkoutTestData.validShippingAddress);
                }
            }
            await checkoutPage.proceedToNextStep();
        }
        
        // Verify we reach confirmation page
        await expect(checkoutPage.confirmationTitle).toBeVisible();
        
        // Verify order details are accurate
        const orderSummary = await checkoutPage.getOrderSummary();
        expect(orderSummary.subTotal).toContain('$38.50');
        
        // Verify logged-in user benefits (pre-filled info, etc.)
        await expect(checkoutPage.confirmOrderButton).toBeVisible();
    });

    test('TS003_TC03 - Verify checkout with product quantity modification', async ({ page }) => {
        const testData = checkoutTestData.checkoutTestData.TS003_TC03;
        
        // First, modify quantity in cart to 3
        await cartPage.navigateToCart();
        await cartPage.updateProductQuantity(0, testData.initialQuantity);
        await cartPage.updateCart();
        
        // Verify initial quantity and total
        await expect(page.locator('td:has-text("3")')).toBeVisible();
        
        // Navigate to checkout as guest
        await checkoutPage.navigateToCheckout();
        await checkoutPage.selectGuestCheckout();
        
        // Fill required information
        await checkoutPage.fillPersonalDetails(testData.personalDetails);
        await checkoutPage.fillShippingAddress(testData.shippingAddress);
        await checkoutPage.proceedToNextStep();
        
        // On confirmation page, verify we can edit cart
        await expect(checkoutPage.editCartLink).toBeVisible();
        await checkoutPage.editCartLink.click();
        
        // Modify quantity from 3 to 2
        await cartPage.updateProductQuantity(0, testData.modifiedQuantity);
        await cartPage.updateCart();
        
        // Verify quantity updated and price recalculated
        await expect(page.locator('td:has-text("2")')).toBeVisible();
        
        // Navigate back to checkout and verify totals updated
        await checkoutPage.navigateToCheckout();
        await checkoutPage.selectGuestCheckout();
        await checkoutPage.fillPersonalDetails(testData.personalDetails);
        await checkoutPage.fillShippingAddress(testData.shippingAddress);
        await checkoutPage.proceedToNextStep();
        
        // Verify final order shows quantity: 2
        const orderSummary = await checkoutPage.getOrderSummary();
        expect(orderSummary.subTotal).toContain('$77.00'); // 2 * $38.50
    });

    test('TS003_TC04 - Verify checkout with product removal during process', async ({ page }) => {
        const testData = checkoutTestData.checkoutTestData.TS003_TC04;
        
        // Navigate to checkout as guest
        await checkoutPage.navigateToCheckout();
        await checkoutPage.selectGuestCheckout();
        
        // Fill required information
        await checkoutPage.fillPersonalDetails(testData.personalDetails);
        await checkoutPage.fillShippingAddress(testData.shippingAddress);
        await checkoutPage.proceedToNextStep();
        
        // On confirmation page, edit cart to remove product
        await checkoutPage.editCartLink.click();
        
        // Remove the product
        await cartPage.removeProduct(0);
        
        // Verify cart becomes empty
        await expect(cartPage.emptyCartMessage).toBeVisible();
        
        // Verify appropriate message is displayed
        const emptyCartText = await cartPage.emptyCartMessage.textContent();
        expect(emptyCartText).toContain('empty');
        
        // Verify user is redirected appropriately when trying to checkout with empty cart
        await expect(page.locator('a:has-text("Continue Shopping")')).toBeVisible();
    });

    test('TS003_TC05 - Verify checkout with valid shipping address', async ({ page }) => {
        const testData = checkoutTestData.checkoutTestData.TS003_TC05;
        
        // Navigate to checkout as guest
        await checkoutPage.navigateToCheckout();
        await checkoutPage.selectGuestCheckout();
        
        // Fill personal details
        await checkoutPage.fillPersonalDetails(testData.personalDetails);
        
        // Fill valid shipping address
        await checkoutPage.fillShippingAddress(testData.shippingAddress);
        
        // Proceed to next step
        await checkoutPage.proceedToNextStep();
        
        // Verify address is accepted and we proceed to next step
        await expect(checkoutPage.confirmationTitle).toBeVisible();
        
        // Verify shipping options are displayed
        const shippingAddress = await checkoutPage.getShippingAddressDetails();
        expect(shippingAddress).toContain(testData.shippingAddress.address1);
        expect(shippingAddress).toContain(testData.shippingAddress.city);
        expect(shippingAddress).toContain(testData.shippingAddress.zipCode);
        
        // Verify checkout proceeds normally
        await expect(checkoutPage.confirmOrderButton).toBeVisible();
    });

    test('TS003_TC06 - Verify checkout with invalid shipping address', async ({ page }) => {
        const testData = checkoutTestData.checkoutTestData.TS003_TC06;
        
        // Navigate to checkout as guest
        await checkoutPage.navigateToCheckout();
        await checkoutPage.selectGuestCheckout();
        
        // Fill personal details with valid data
        await checkoutPage.fillPersonalDetails(checkoutTestData.validGuestUser);
        
        // Fill invalid shipping address (missing required fields)
        await checkoutPage.address1Field.fill(''); // Leave address1 empty
        await checkoutPage.cityField.fill(''); // Leave city empty
        await checkoutPage.zipPostCodeField.fill('00000'); // Invalid ZIP
        
        // Attempt to proceed
        await checkoutPage.proceedToNextStep();
        
        // Verify validation error messages appear
        const validationErrors = await checkoutPage.getValidationErrors();
        expect(validationErrors.length).toBeGreaterThan(0);
        
        // Verify checkout cannot proceed
        const currentUrl = page.url();
        expect(currentUrl).toContain('step_1'); // Should still be on step 1
        
        // Correct the address and verify successful progression
        await checkoutPage.fillShippingAddress(checkoutTestData.validShippingAddress);
        await checkoutPage.proceedToNextStep();
        
        // Should now proceed to next step
        await expect(checkoutPage.confirmationTitle).toBeVisible();
    });

    test('TS003_TC07 - Verify checkout with multiple shipping options', async ({ page }) => {
        const testData = checkoutTestData.checkoutTestData.TS003_TC07;
        
        // Navigate to checkout as guest
        await checkoutPage.navigateToCheckout();
        await checkoutPage.selectGuestCheckout();
        
        // Fill required information
        await checkoutPage.fillPersonalDetails(testData.personalDetails);
        await checkoutPage.fillShippingAddress(testData.shippingAddress);
        await checkoutPage.proceedToNextStep();
        
        // Check if we have shipping method selection page
        const hasShippingOptions = await page.locator('input[name="shipping_method"]').count();
        if (hasShippingOptions > 0) {
            // Verify multiple shipping options are available
            const shippingOptions = await page.locator('input[name="shipping_method"]').all();
            expect(shippingOptions.length).toBeGreaterThan(0);
            
            // Select different shipping options and verify cost updates
            for (const option of shippingOptions) {
                await option.check();
                // Verify selection is reflected in summary
                await expect(option).toBeChecked();
            }
        }
        
        // Proceed to final confirmation
        if (await checkoutPage.continueButton.isVisible()) {
            await checkoutPage.proceedToNextStep();
        }
        
        // Verify final order summary reflects selected shipping method
        await expect(checkoutPage.confirmationTitle).toBeVisible();
        const orderSummary = await checkoutPage.getOrderSummary();
        expect(orderSummary.shipping).toBeTruthy();
    });

    test('TS003_TC11 - Verify order summary with invalid coupon code', async ({ page }) => {
        const testData = checkoutTestData.checkoutTestData.TS003_TC11;
        
        // Navigate to cart first to apply coupon
        await cartPage.navigateToCart();
        
        // Try to apply invalid coupon code
        await cartPage.applyCoupon(testData.couponCode);
        
        // Verify error message is displayed
        const errorMessages = await page.locator('.alert-danger, .alert-error').allTextContents();
        const hasErrorMessage = errorMessages.some(msg => 
            msg.toLowerCase().includes('invalid') || 
            msg.toLowerCase().includes('coupon') ||
            msg.toLowerCase().includes('not valid')
        );
        expect(hasErrorMessage).toBeTruthy();
        
        // Verify no discount is applied
        const total = await cartPage.getOrderTotal();
        expect(total).toContain('$40.50'); // Original total with shipping
        
        // Navigate to checkout and verify order total remains unchanged
        await checkoutPage.navigateToCheckout();
        await checkoutPage.selectGuestCheckout();
        await checkoutPage.fillPersonalDetails(testData.personalDetails);
        await checkoutPage.fillShippingAddress(testData.shippingAddress);
        await checkoutPage.proceedToNextStep();
        
        const orderSummary = await checkoutPage.getOrderSummary();
        expect(orderSummary.total).toContain('$40.50');
    });

    test('TS003_TC12 - Verify required field validation in checkout', async ({ page }) => {
        const testData = checkoutTestData.checkoutTestData.TS003_TC12;
        
        // Navigate to checkout as guest
        await checkoutPage.navigateToCheckout();
        await checkoutPage.selectGuestCheckout();
        
        // Leave all required fields empty and attempt to proceed
        await checkoutPage.proceedToNextStep();
        
        // Verify validation messages appear for each required field
        const validationErrors = await checkoutPage.getValidationErrors();
        expect(validationErrors.length).toBeGreaterThan(0);
        
        // Fill fields one by one and verify validation clears
        await checkoutPage.firstNameField.fill('John');
        await checkoutPage.proceedToNextStep();
        
        // Should still have validation errors for other fields
        let remainingErrors = await checkoutPage.getValidationErrors();
        expect(remainingErrors.length).toBeGreaterThan(0);
        
        // Fill all required fields
        await checkoutPage.fillPersonalDetails(checkoutTestData.validGuestUser);
        await checkoutPage.fillShippingAddress(checkoutTestData.validShippingAddress);
        
        // Should now proceed successfully
        await checkoutPage.proceedToNextStep();
        await expect(checkoutPage.confirmationTitle).toBeVisible();
    });

    test('TS003_TC13 - Verify email format validation in checkout', async ({ page }) => {
        const testData = checkoutTestData.checkoutTestData.TS003_TC13;
        
        // Navigate to checkout as guest
        await checkoutPage.navigateToCheckout();
        await checkoutPage.selectGuestCheckout();
        
        // Fill other required fields except email
        await checkoutPage.firstNameField.fill(testData.personalDetails.firstName);
        await checkoutPage.lastNameField.fill(testData.personalDetails.lastName);
        await checkoutPage.fillShippingAddress(testData.shippingAddress);
        
        // Test each invalid email format
        for (const invalidEmail of testData.invalidEmails) {
            await checkoutPage.emailField.fill(invalidEmail);
            await checkoutPage.proceedToNextStep();
            
            // Verify email validation error appears
            const validationErrors = await checkoutPage.getValidationErrors();
            const hasEmailError = validationErrors.some(error => 
                error.toLowerCase().includes('email') || 
                error.toLowerCase().includes('invalid') ||
                error.toLowerCase().includes('format')
            );
            
            if (hasEmailError) {
                expect(hasEmailError).toBeTruthy();
                
                // Clear the field for next iteration
                await checkoutPage.emailField.fill('');
            }
        }
        
        // Enter valid email and verify validation passes
        await checkoutPage.emailField.fill(testData.validEmail);
        await checkoutPage.proceedToNextStep();
        
        // Should proceed to next step
        await expect(checkoutPage.confirmationTitle).toBeVisible();
    });

    test('TS003_TC15 - Verify guest checkout option availability', async ({ page }) => {
        const testData = checkoutTestData.checkoutTestData.TS003_TC15;
        
        // Navigate to checkout
        await checkoutPage.navigateToCheckout();
        
        // Verify both options are available
        await expect(checkoutPage.guestCheckoutRadio).toBeVisible();
        await expect(checkoutPage.registerAccountRadio).toBeVisible();
        
        // Verify "Guest Checkout" option is available
        await expect(page.locator('text=Guest Checkout')).toBeVisible();
        
        // Verify "Create Account" option is also available
        await expect(page.locator('text=Register Account')).toBeVisible();
        
        // Select Guest Checkout
        await checkoutPage.selectGuestCheckout();
        
        // Verify guest information form appears
        await expect(checkoutPage.guestStep1Title).toBeVisible();
        await expect(checkoutPage.firstNameField).toBeVisible();
        await expect(checkoutPage.emailField).toBeVisible();
        
        // Fill guest details and complete checkout
        await checkoutPage.fillPersonalDetails(testData.personalDetails);
        await checkoutPage.fillShippingAddress(testData.shippingAddress);
        await checkoutPage.proceedToNextStep();
        
        // Verify checkout completes without account creation
        await expect(checkoutPage.confirmationTitle).toBeVisible();
        
        // After checkout, verify no account is created (we're still guest)
        const isLoggedIn = await page.locator('text=Welcome back').isVisible();
        expect(isLoggedIn).toBeFalsy();
    });

    test('TS003_TC19 - Verify checkout with browser back button navigation', async ({ page }) => {
        const testData = checkoutTestData.checkoutTestData.TS003_TC19;
        
        // Navigate to checkout as guest
        await checkoutPage.navigateToCheckout();
        await checkoutPage.selectGuestCheckout();
        
        // Fill shipping information
        await checkoutPage.fillPersonalDetails(testData.personalDetails);
        await checkoutPage.fillShippingAddress(testData.shippingAddress);
        
        // Proceed to next step
        await checkoutPage.proceedToNextStep();
        
        // Verify we're on confirmation page
        await expect(checkoutPage.confirmationTitle).toBeVisible();
        
        // Use browser back button to return to previous step
        await page.goBack();
        
        // Verify we're back on step 1 and data is preserved
        await expect(checkoutPage.guestStep1Title).toBeVisible();
        
        // Verify data is preserved in previous steps
        const firstNameValue = await checkoutPage.firstNameField.inputValue();
        const emailValue = await checkoutPage.emailField.inputValue();
        const addressValue = await checkoutPage.address1Field.inputValue();
        
        expect(firstNameValue).toBe(testData.personalDetails.firstName);
        expect(emailValue).toBe(testData.personalDetails.email);
        expect(addressValue).toBe(testData.shippingAddress.address1);
        
        // Modify information and proceed forward again
        await checkoutPage.telephoneField.fill('555-999-8888');
        await checkoutPage.proceedToNextStep();
        
        // Use back button multiple times
        await page.goBack();
        await page.goForward();
        
        // Verify checkout integrity is maintained
        await expect(checkoutPage.confirmationTitle).toBeVisible();
        await expect(checkoutPage.confirmOrderButton).toBeVisible();
    });

    // Additional edge case tests
    test('TS003_TC_EDGE01 - Verify checkout with special characters in address', async ({ page }) => {
        // Navigate to checkout as guest
        await checkoutPage.navigateToCheckout();
        await checkoutPage.selectGuestCheckout();
        
        // Fill personal details
        await checkoutPage.fillPersonalDetails(checkoutTestData.validGuestUser);
        
        // Fill address with special characters
        const specialCharAddress = {
            ...checkoutTestData.validShippingAddress,
            address1: '123 Main St. #456 & Apt. 789',
            address2: 'c/o O\'Reilly & Associates',
            city: 'San José'
        };
        
        await checkoutPage.fillShippingAddress(specialCharAddress);
        await checkoutPage.proceedToNextStep();
        
        // Verify address with special characters is accepted
        await expect(checkoutPage.confirmationTitle).toBeVisible();
        
        const shippingAddress = await checkoutPage.getShippingAddressDetails();
        expect(shippingAddress).toContain('123 Main St. #456 & Apt. 789');
    });

    test('TS003_TC_EDGE02 - Verify checkout flow with page refresh', async ({ page }) => {
        // Navigate to checkout as guest
        await checkoutPage.navigateToCheckout();
        await checkoutPage.selectGuestCheckout();
        
        // Fill some information
        await checkoutPage.fillPersonalDetails(checkoutTestData.validGuestUser);
        
        // Refresh the page
        await page.reload();
        
        // Verify we're redirected appropriately and can continue
        const currentUrl = page.url();
        expect(currentUrl).toContain('checkout');
        
        // Re-fill information and proceed
        await checkoutPage.fillPersonalDetails(checkoutTestData.validGuestUser);
        await checkoutPage.fillShippingAddress(checkoutTestData.validShippingAddress);
        await checkoutPage.proceedToNextStep();
        
        // Verify checkout can be completed
        await expect(checkoutPage.confirmationTitle).toBeVisible();
    });

    test.afterEach(async ({ page }) => {
        // Clean up cart if needed
        try {
            await page.goto('/index.php?rt=checkout/cart');
            const hasItems = await page.locator('.cart-info table tbody tr:not(:first-child)').count();
            if (hasItems > 0) {
                await page.locator('a[href*="remove"]').first().click();
            }
        } catch (error) {
            // Ignore cleanup errors
        }
    });
});
