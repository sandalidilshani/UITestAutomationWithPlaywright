const BasePage = require('./BasePage');

/**
 * AccountPage class representing the user account dashboard
 */
class AccountPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Locators
        this.accountHeading = page.getByRole('heading', { name: 'My Account', exact: true });
        this.welcomeMessage = page.getByText(/Welcome back/);
        this.logoffLink = page.getByRole('link', { name: 'Logoff', exact: true });
        
        // Account menu links
        this.accountDashboardLink = page.getByRole('link', { name: 'Account Dashboard' });
        this.wishListLink = page.getByRole('link', { name: 'My wish list' });
        this.editAccountLink = page.getByRole('link', { name: 'Edit account details' });
        this.changePasswordLink = page.getByRole('link', { name: 'Change password' });
        this.addressBookLink = page.getByRole('link', { name: 'Manage Address Book' });
        this.orderHistoryLink = page.getByRole('link', { name: 'Order history' });
        this.transactionHistoryLink = page.getByRole('link', { name: 'Transaction history' });
        this.downloadsLink = page.getByRole('link', { name: 'Downloads' });
        this.notificationsLink = page.getByRole('link', { name: 'Notifications' });
    }

    /**
     * Verify account page is displayed
     * @returns {Promise<boolean>} True if account page is displayed
     */
    async isAccountPageDisplayed() {
        return await this.accountHeading.isVisible();
    }

    /**
     * Verify welcome message is displayed for a specific user
     * @param {string} username - Expected username
     * @returns {Promise<boolean>} True if welcome message is displayed
     */
    async isWelcomeMessageDisplayed(username) {
        const welcomeText = this.page.getByText(new RegExp(`Welcome back ${username}`, 'i'));
        return await welcomeText.isVisible();
    }

    /**
     * Click on logoff link
     */
    async clickLogoff() {
        await this.logoffLink.click();
    }

    /**
     * Navigate to account dashboard
     */
    async clickAccountDashboard() {
        await this.accountDashboardLink.click();
    }

    /**
     * Navigate to wish list
     */
    async clickWishList() {
        await this.wishListLink.click();
    }

    /**
     * Navigate to edit account details
     */
    async clickEditAccount() {
        await this.editAccountLink.click();
    }

    /**
     * Navigate to change password
     */
    async clickChangePassword() {
        await this.changePasswordLink.click();
    }

    /**
     * Navigate to address book
     */
    async clickAddressBook() {
        await this.addressBookLink.click();
    }

    /**
     * Navigate to order history
     */
    async clickOrderHistory() {
        await this.orderHistoryLink.click();
    }

    /**
     * Navigate to the account page
     */
    async navigate() {
        await this.navigateTo(`${this.baseUrl}/index.php?rt=account/account`);
    }

    /**
     * Get the account page URL
     * @returns {Promise<string>} Account page URL
     */
    async getAccountUrl() {
        return this.getCurrentUrl();
    }
}

module.exports = AccountPage;