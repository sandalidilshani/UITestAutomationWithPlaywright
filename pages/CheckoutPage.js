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
}

module.exports = CheckoutPage;
