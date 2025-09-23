const BasePage = require('./BasePage');

/**
 * LogoutPage class representing the logout confirmation page
 */
class LogoutPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Locators
        this.logoutHeading = page.getByRole('heading', { name: 'Account Logout' });
        this.logoutMessage = page.getByText('You have been logged off your account. It is now safe to leave the computer.');
        this.shoppingCartMessage = page.getByText('Your shopping cart has been saved, the items inside it will be restored whenever you log back into your account.');
        this.continueButton = page.getByRole('link', { name: 'Continue' });
    }

    /**
     * Verify logout page is displayed
     * @returns {Promise<boolean>} True if logout page is displayed
     */
    async isLogoutPageDisplayed() {
        return await this.logoutHeading.isVisible();
    }

    /**
     * Verify logout confirmation message is displayed
     * @returns {Promise<boolean>} True if logout message is displayed
     */
    async isLogoutMessageDisplayed() {
        return await this.logoutMessage.isVisible();
    }

    /**
     * Verify shopping cart saved message is displayed
     * @returns {Promise<boolean>} True if cart message is displayed
     */
    async isShoppingCartMessageDisplayed() {
        return await this.shoppingCartMessage.isVisible();
    }

    /**
     * Click continue button to return to home page
     */
    async clickContinue() {
        await this.continueButton.click();
    }

    /**
     * Get the logout page URL
     * @returns {Promise<string>} Logout page URL
     */
    async getLogoutUrl() {
        return this.getCurrentUrl();
    }
}

module.exports = LogoutPage;