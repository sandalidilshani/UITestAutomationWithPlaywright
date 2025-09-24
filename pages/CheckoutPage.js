const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class CheckoutPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Login/Account Selection Page Elements
        this.accountLoginTitle = page.locator('h1:has-text("Account Login")');
        this.guestCheckoutRadio = page.locator('input[value="guest"]');
        this.registerAccountRadio = page.locator('input[value="register"]');
        this.continueButton = page.locator('button:has-text("Continue")');
        this.loginButton = page.locator('button:has-text("Login")');
        this.loginNameField = page.locator('input[name="loginname"]');
        this.passwordField = page.locator('input[name="password"]');
        
        // Guest Checkout Step 1 - Personal Details & Address
        this.guestStep1Title = page.locator('h1:has-text("Guest Checkout - Step 1")');
        this.firstNameField = page.locator('#guestFrm_firstname');
        this.lastNameField = page.locator('#guestFrm_lastname');
        this.emailField = page.locator('#guestFrm_email');
        this.telephoneField = page.locator('#guestFrm_telephone');
        this.faxField = page.locator('#guestFrm_fax');
        this.companyField = page.locator('#guestFrm_company');
        this.address1Field = page.locator('#guestFrm_address_1');
        this.address2Field = page.locator('#guestFrm_address_2');
        this.cityField = page.locator('#guestFrm_city');
        this.regionDropdown = page.locator('#guestFrm_zone_id');
        this.zipPostCodeField = page.locator('#guestFrm_postcode');
        this.countryDropdown = page.locator('#guestFrm_country_id');
        this.separateShippingAddressCheckbox = page.locator('input[name="shipping_indicator"]');
        
        // Guest Checkout Step 2 - Shipping & Payment
        this.guestStep2Title = page.locator('h1:has-text("Guest Checkout - Step 2")');
        this.shippingMethodRadio = page.locator('input[name="shipping_method"]');
        this.paymentMethodRadio = page.locator('input[name="payment_method"]');
        
        // Guest Checkout Step 3 - Confirmation
        this.confirmationTitle = page.locator('h1:has-text("Checkout Confirmation")');
        this.confirmOrderButton = page.locator('button:has-text("Confirm Order")');
        this.editShippingLink = page.locator('a:has-text("Edit Shipping")');
        this.editPaymentLink = page.locator('a:has-text("Edit Payment")');
        this.editCartLink = page.locator('a:has-text("Edit Cart")');
        this.editCouponLink = page.locator('a:has-text("Edit Coupon")');
        
        // Order Summary Section
        this.orderSummarySection = page.locator('.sidebar .order-summary');
        this.orderProductList = page.locator('.order-summary table tbody tr');
        this.orderSubTotal = page.locator('td:has-text("Sub-Total:") + td');
        this.orderShippingCost = page.locator('td:has-text("Flat Shipping Rate:") + td, td:has-text("Free Shipping:") + td');
        this.orderTotal = page.locator('td:has-text("Total:") + td');
        
        // Coupon Section
        this.couponCodeField = page.locator('input[name="coupon"]');
        this.applyCouponButton = page.locator('button:has-text("Apply Coupon")');
        
        // Cart Items in Checkout
        this.cartItemsTable = page.locator('.cart-info table');
        this.cartQuantityFields = page.locator('input[name*="quantity"]');
        this.removeItemLinks = page.locator('a[href*="remove"]');
        
        // Validation Messages
        this.validationErrorMessages = page.locator('.has-error .help-block, .alert-danger');
        this.successMessages = page.locator('.alert-success');
        this.errorMessages = page.locator('.alert-error, .alert-danger');
        
        // Navigation
        this.backButton = page.locator('a:has-text("Back")');
        this.breadcrumbLinks = page.locator('.breadcrumb a');
        
        // Logged-in User Checkout Elements
        this.savedAddressDropdown = page.locator('select[name="address_id"]');
        this.useExistingAddressRadio = page.locator('input[value="existing"]');
        this.useNewAddressRadio = page.locator('input[value="new"]');
    }

    // Navigation Methods
    async navigateToCheckout() {
        await this.page.goto('/index.php?rt=checkout/cart');
        await this.page.locator('#cart_checkout2').click();
    }

    async selectGuestCheckout() {
        await expect(this.guestCheckoutRadio).toBeVisible();
        await this.guestCheckoutRadio.check();
        await this.continueButton.click();
    }

    async selectRegisteredUserCheckout() {
        await expect(this.registerAccountRadio).toBeVisible();
        await this.registerAccountRadio.check();
        await this.continueButton.click();
    }

    async loginExistingUser(username, password) {
        await this.loginNameField.fill(username);
        await this.passwordField.fill(password);
        await this.loginButton.click();
    }

    // Guest Checkout Step 1 Methods
    async fillPersonalDetails(personalDetails) {
        if (personalDetails.firstName) await this.firstNameField.fill(personalDetails.firstName);
        if (personalDetails.lastName) await this.lastNameField.fill(personalDetails.lastName);
        if (personalDetails.email) await this.emailField.fill(personalDetails.email);
        if (personalDetails.telephone) await this.telephoneField.fill(personalDetails.telephone);
        if (personalDetails.fax) await this.faxField.fill(personalDetails.fax);
    }

    async fillShippingAddress(addressDetails) {
        if (addressDetails.company) await this.companyField.fill(addressDetails.company);
        if (addressDetails.address1) await this.address1Field.fill(addressDetails.address1);
        if (addressDetails.address2) await this.address2Field.fill(addressDetails.address2);
        if (addressDetails.city) await this.cityField.fill(addressDetails.city);
        if (addressDetails.zipCode) await this.zipPostCodeField.fill(addressDetails.zipCode);
        if (addressDetails.country) await this.countryDropdown.selectOption(addressDetails.country);
        if (addressDetails.region) await this.regionDropdown.selectOption(addressDetails.region);
    }

    async proceedToNextStep() {
        await this.continueButton.click();
    }

    async goBack() {
        await this.backButton.click();
    }

    // Order Management Methods
    async updateProductQuantity(productIndex, quantity) {
        await this.cartQuantityFields.nth(productIndex).fill(quantity.toString());
    }

    async removeProductFromCheckout(productIndex) {
        await this.removeItemLinks.nth(productIndex).click();
    }

    async applyCouponCode(couponCode) {
        await this.couponCodeField.fill(couponCode);
        await this.applyCouponButton.click();
    }

    // Shipping Methods
    async selectShippingMethod(methodValue) {
        await this.page.locator(`input[name="shipping_method"][value="${methodValue}"]`).check();
    }

    async selectPaymentMethod(methodValue) {
        await this.page.locator(`input[name="payment_method"][value="${methodValue}"]`).check();
    }

    // Final Confirmation
    async confirmOrder() {
        await this.confirmOrderButton.click();
    }

    // Validation Methods
    async getValidationErrors() {
        const errors = await this.validationErrorMessages.allTextContents();
        return errors.filter(error => error.trim().length > 0);
    }

    async getSuccessMessage() {
        await expect(this.successMessages).toBeVisible();
        return await this.successMessages.textContent();
    }

    async getErrorMessage() {
        await expect(this.errorMessages).toBeVisible();
        return await this.errorMessages.textContent();
    }

    // Order Summary Verification Methods
    async getOrderSummary() {
        const subTotal = await this.orderSubTotal.textContent();
        const shipping = await this.orderShippingCost.textContent().catch(() => '$0.00');
        const total = await this.orderTotal.textContent();
        
        return {
            subTotal: subTotal?.trim(),
            shipping: shipping?.trim(),
            total: total?.trim()
        };
    }

    async getCartItems() {
        const items = [];
        const rows = await this.orderProductList.all();
        
        for (const row of rows) {
            const name = await row.locator('td').nth(0).textContent();
            const price = await row.locator('td').nth(1).textContent();
            items.push({ name: name?.trim(), price: price?.trim() });
        }
        
        return items;
    }

    // Address Verification Methods
    async getShippingAddressDetails() {
        const shippingSection = this.page.locator('h4:has-text("Shipping") + table');
        const addressText = await shippingSection.locator('td').nth(1).textContent();
        return addressText?.trim();
    }

    async getPaymentAddressDetails() {
        const paymentSection = this.page.locator('h4:has-text("Payment") + table');
        const addressText = await paymentSection.locator('td').nth(1).textContent();
        return addressText?.trim();
    }

    // Saved Address Methods (for logged-in users)
    async selectSavedAddress(addressId) {
        await this.savedAddressDropdown.selectOption(addressId);
    }

    async useSavedAddress() {
        await this.useExistingAddressRadio.check();
    }

    async useNewAddress() {
        await this.useNewAddressRadio.check();
    }

    // Browser Navigation Methods
    async navigateBackWithBrowser() {
        await this.page.goBack();
    }

    async refreshPage() {
        await this.page.reload();
    }

    // Session and State Methods
    async waitForSessionTimeout(timeoutMs = 30000) {
        await this.page.waitForTimeout(timeoutMs);
    }

    async checkIfSessionExpired() {
        const currentUrl = this.page.url();
        return currentUrl.includes('login') || currentUrl.includes('session');
    }

    // Stock Verification Methods
    async checkProductAvailability() {
        const outOfStockMessage = this.page.locator('text=Out of Stock');
        return !(await outOfStockMessage.isVisible());
    }

    // Advanced Validation Methods
    async validateRequiredFields() {
        const requiredFields = [
            this.firstNameField,
            this.lastNameField,
            this.emailField,
            this.address1Field,
            this.cityField,
            this.regionDropdown,
            this.zipPostCodeField,
            this.countryDropdown
        ];

        const invalidFields = [];
        for (const field of requiredFields) {
            const isEmpty = (await field.inputValue()).length === 0;
            if (isEmpty) {
                invalidFields.push(field);
            }
        }
        return invalidFields;
    }

    async validateEmailFormat(email) {
        await this.emailField.fill(email);
        await this.continueButton.click();
        return await this.getValidationErrors();
    }

    async validatePhoneFormat(phone) {
        await this.telephoneField.fill(phone);
        await this.continueButton.click();
        return await this.getValidationErrors();
    }
}

module.exports = CheckoutPage;
