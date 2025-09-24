const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class CheckoutPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this.initializeLocators();
    }

    initializeLocators() {
        // Checkout options
        this.guestCheckoutRadio = this.page.locator('input[value="guest"]');
        this.continueButton = this.page.getByRole('button', { name: 'Continue' });
        this.confirmationTitle = this.page.getByRole('heading', { name: 'Checkout Confirmation' });
        this.guestCheckoutTitle = this.page.getByText('Guest Checkout - Step').first();
        this.confirmOrderButton = this.page.locator('#checkout_btn');

        // Guest checkout form fields
        this.firstNameField = this.page.locator('#guestFrm_firstname');
        this.lastNameField = this.page.locator('#guestFrm_lastname');
        this.emailField = this.page.locator('#guestFrm_email');
        this.telephoneField = this.page.locator('#guestFrm_telephone');
        this.address1Field = this.page.locator('#guestFrm_address_1');
        this.cityField = this.page.locator('#guestFrm_city');
        this.zipPostCodeField = this.page.locator('#guestFrm_postcode');
        this.countryDropdown = this.page.locator('#guestFrm_country_id');
        this.regionDropdown = this.page.locator('#guestFrm_zone_id');
    }

    async navigateToCheckout() {
        await this.page.goto('/index.php?rt=checkout/cart');
        await this.page.waitForLoadState();
        
        // Wait for checkout button and click it
        await this.page.waitForSelector('#cart_checkout1, #cart_checkout2', { timeout: 10000 });
        await this.page.locator('#cart_checkout1, #cart_checkout2').first().click();
        
        // Check if redirected to login (auth failure)
        const currentUrl = this.page.url();
        if (currentUrl.includes('account/login')) {
            throw new Error('Authentication failed - redirected to login page');
        }
    }

    async selectGuestCheckout() {
        await expect(this.guestCheckoutRadio).toBeVisible();
        await this.guestCheckoutRadio.check();
        await this.continueButton.click();
    }

    async fillPersonalDetails(details) {
        if (details.firstName) await this.firstNameField.fill(details.firstName);
        if (details.lastName) await this.lastNameField.fill(details.lastName);
        if (details.email) await this.emailField.fill(details.email);
        if (details.telephone) await this.telephoneField.fill(details.telephone);
    }

    async fillShippingAddress(address) {
        if (address.address1) await this.address1Field.fill(address.address1);
        if (address.city) await this.cityField.fill(address.city);
        if (address.zipCode) await this.zipPostCodeField.fill(address.zipCode);
        if (address.country) await this.countryDropdown.selectOption({ label: address.country });
        if (address.region) await this.regionDropdown.selectOption({ label: address.region });
    }

    async proceedToNextStep() {
        await this.continueButton.click();
    }

    async getOrderSummary() {
        const subTotal = await this.page.locator('tr:has-text("Sub-Total") span.bold').last().textContent();
        const shipping = await this.page.locator('tr:has-text("Flat Shipping Rate") span.bold').last().textContent().catch(() => '$0.00');
        const total = await this.page.locator('tr:has-text("Total") span.bold').last().textContent();
        return { 
            subTotal: subTotal?.trim(), 
            shipping: shipping?.trim(), 
            total: total?.trim() 
        };
    }

    // Methods for logged-in user checkout
    async verifyShippingAddressAutoFilled() {
        const shippingTable = this.page.locator('table.confirm_shippment_options');
        await expect(shippingTable).toBeVisible();
        return true;
    }

    async getPrefilledShippingAddress() {
        const shippingTable = this.page.locator('table.confirm_shippment_options tbody tr');
        
        const customerInfo = await shippingTable.locator('td').nth(0).textContent();
        const address = await shippingTable.locator('td').nth(1).textContent();
        const shippingMethod = await shippingTable.locator('td').nth(2).textContent();
        
        return {
            customerInfo: customerInfo?.trim(),
            address: address?.trim(),
            shippingMethod: shippingMethod?.trim()
        };
    }

    async verifyShippingAddressContains(expectedData) {
        const shippingAddress = await this.getPrefilledShippingAddress();
        
        if (expectedData.name) {
            expect(shippingAddress.customerInfo).toContain(expectedData.name);
        }
        if (expectedData.phone) {
            expect(shippingAddress.customerInfo).toContain(expectedData.phone);
        }
        if (expectedData.address) {
            expect(shippingAddress.address).toContain(expectedData.address);
        }
        if (expectedData.city) {
            expect(shippingAddress.address).toContain(expectedData.city);
        }
        if (expectedData.zipCode) {
            expect(shippingAddress.address).toContain(expectedData.zipCode);
        }
        if (expectedData.country) {
            expect(shippingAddress.address).toContain(expectedData.country);
        }
        
        return shippingAddress;
    }

    async isEditShippingButtonPresent() {
        const editButton = this.page.getByRole('link', { name: 'Edit Shipping' });
        return await editButton.isVisible();
    }

    async confirmOrder() {
        await this.confirmOrderButton.click();
        await this.page.getByText('Your Order Has Been Processed!');
    }

    // Additional methods for comprehensive test coverage
    
    async modifyQuantity(quantity) {
        const quantityField = this.page.locator('#product_quantity');
        await quantityField.clear();
        await quantityField.fill(quantity.toString());
        await this.page.waitForTimeout(500);
    }

    async getQuantity() {
        const quantityField = this.page.locator('#product_quantity');
        return await quantityField.inputValue();
    }

    async removeProduct(productName) {
        const removeButton = this.page.locator(`tr:has-text("${productName}") .remove-item`);
        await removeButton.click();
        await this.page.waitForTimeout(500);
    }

    async isCartEmpty() {
        const emptyMessage = this.page.locator('text=Your cart is empty');
        return await emptyMessage.isVisible();
    }

    async getEmptyCartMessage() {
        const emptyMessage = this.page.locator('text=Your cart is empty');
        return await emptyMessage.textContent();
    }

    async getShippingOptions() {
        const shippingOptions = this.page.locator('input[name="shipping_method"]');
        return await shippingOptions.all();
    }

    async selectShippingMethod(methodName) {
        const shippingOption = this.page.locator(`input[value*="${methodName.toLowerCase()}"]`);
        await shippingOption.check();
        await this.page.waitForTimeout(500);
    }

    async goBackToCart() {
        await this.page.goBack();
        await this.page.waitForLoadState();
    }

    async getOrderLineItems() {
        const lineItems = this.page.locator('table.order-summary tr');
        return await lineItems.all();
    }

    async getDiscountInfo() {
        const discountElement = this.page.locator('text=discount, text=Discount');
        if (await discountElement.isVisible()) {
            return await discountElement.textContent();
        }
        return null;
    }

    async enterCouponCode(couponCode) {
        const couponField = this.page.locator('input[name="coupon"]');
        await couponField.fill(couponCode);
    }

    async applyCoupon() {
        const applyButton = this.page.locator('button:has-text("Apply")');
        await applyButton.click();
        await this.page.waitForTimeout(500);
    }

    async getCouponErrorMessage() {
        const errorMessage = this.page.locator('.alert-error, .alert-danger');
        if (await errorMessage.isVisible()) {
            return await errorMessage.textContent();
        }
        return null;
    }

    async getValidationErrors() {
        const errorElements = this.page.locator('.error, .alert-danger, .validation-error');
        const errors = [];
        const count = await errorElements.count();
        for (let i = 0; i < count; i++) {
            const error = await errorElements.nth(i).textContent();
            errors.push(error);
        }
        return errors;
    }

    async canProceedToNextStep() {
        const continueButton = this.page.locator('button:has-text("Continue")');
        return await continueButton.isEnabled();
    }

    async fillRequiredField(fieldName, value) {
        const fieldMap = {
            firstName: this.firstNameField,
            lastName: this.lastNameField,
            email: this.emailField,
            telephone: this.telephoneField,
            address1: this.address1Field,
            city: this.cityField,
            region: this.regionDropdown,
            zipCode: this.zipPostCodeField,
            country: this.countryDropdown
        };
        
        if (fieldMap[fieldName]) {
            if (fieldName === 'region' || fieldName === 'country') {
                await fieldMap[fieldName].selectOption({ label: value });
            } else {
                await fieldMap[fieldName].fill(value);
            }
        }
    }

    async fillEmailField(email) {
        await this.emailField.fill(email);
    }

    async getEmailValidationError() {
        const emailError = this.page.locator('#guestFrm_email + .error');
        if (await emailError.isVisible()) {
            return await emailError.textContent();
        }
        return null;
    }

    async fillPhoneField(phone) {
        await this.telephoneField.fill(phone);
    }

    async getPhoneValidationError() {
        const phoneError = this.page.locator('#guestFrm_telephone + .error');
        if (await phoneError.isVisible()) {
            return await phoneError.textContent();
        }
        return null;
    }

    async isGuestCheckoutAvailable() {
        return await this.guestCheckoutRadio.isVisible();
    }

    async isCreateAccountAvailable() {
        return await this.registerAccountRadio.isVisible();
    }

    async selectCreateAccountOption() {
        await this.registerAccountRadio.check();
        await this.continueButton.click();
    }

    async fillAccountDetails(accountDetails) {
        const passwordField = this.page.locator('#guestFrm_password');
        const confirmPasswordField = this.page.locator('#guestFrm_confirm_password');
        
        if (accountDetails.password) {
            await passwordField.fill(accountDetails.password);
        }
        if (accountDetails.confirmPassword) {
            await confirmPasswordField.fill(accountDetails.confirmPassword);
        }
    }

    async isUserLoggedIn() {
        const loginLink = this.page.locator('text=Login or register');
        return !(await loginLink.isVisible());
    }

    async getSavedAddresses() {
        const savedAddresses = this.page.locator('.saved-address');
        return await savedAddresses.all();
    }

    async selectSavedAddress(addressElement) {
        await addressElement.click();
        await this.page.waitForTimeout(500);
    }

    async getSelectedAddressDetails() {
        const addressDetails = this.page.locator('.selected-address');
        return await addressDetails.textContent();
    }

    async simulateStockDepletion(productName) {
        // This would need to be implemented based on your system's stock management
        // For now, we'll just wait and check for stock-related errors
        await this.page.waitForTimeout(1000);
    }

    async getStockDepletionError() {
        const stockError = this.page.locator('text=out of stock, text=Out of Stock');
        if (await stockError.isVisible()) {
            return await stockError.textContent();
        }
        return null;
    }

    async canCompleteCheckout() {
        const confirmButton = this.page.locator('#checkout_btn');
        return await confirmButton.isEnabled();
    }

    async goBack() {
        await this.page.goBack();
        await this.page.waitForLoadState();
    }

    async getPreservedData() {
        // Check if form data is preserved after going back
        const firstNameValue = await this.firstNameField.inputValue();
        return firstNameValue !== '';
    }

    async modifyShippingAddress(address) {
        await this.fillShippingAddress(address);
    }

    async simulateSessionTimeout(timeout) {
        // Simulate session timeout by waiting
        await this.page.waitForTimeout(timeout);
    }

    async getSessionHandlingMessage() {
        const sessionMessage = this.page.locator('text=session, text=timeout, text=expired');
        if (await sessionMessage.isVisible()) {
            return await sessionMessage.textContent();
        }
        return null;
    }

    async needsReauthentication() {
        const loginPage = this.page.url().includes('account/login');
        return loginPage;
    }
}

module.exports = CheckoutPage;
