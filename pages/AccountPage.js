const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');
class AccountPage extends BasePage {
    constructor(page) {
        super(page);
        
        this.accountHeading = page.getByRole('heading', { name: 'My Account', exact: true }).first();
        this.welcomeMessage = page.getByText(/Welcome back/);
        this.logoffLink = page.getByRole('link', { name: 'Logoff', exact: true });
        
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

   
    async isAccountPageDisplayed() {
        return await this.accountHeading.isVisible();
    }

    
    async isWelcomeMessageDisplayed(username) {
        const welcomeText = this.page.getByText(new RegExp(`Welcome back ${username}`, 'i'));
        return await welcomeText.isVisible();
    }

    
    async clickLogoff() {
        await this.logoffLink.click();
        await expect(this.page.getByText('Account Logout', { exact: true })).toBeVisible();
        const button = this.page.locator('.btn.btn-default.mr10');
        await button.click();
        await this.page.waitForLoadState();
    }

    
    async clickAccountDashboard() {
        await this.accountDashboardLink.click();
    }

    
    async clickWishList() {
        await this.wishListLink.click();
    }

    
    async clickEditAccount() {
        await this.editAccountLink.click();
    }

   
    async clickChangePassword() {
        await this.changePasswordLink.click();
    }

   
    async clickAddressBook() {
        await this.addressBookLink.click();
    }

   
    async clickOrderHistory() {
        await this.orderHistoryLink.click();
    }

    async navigate() {
        await this.navigateTo(`${this.baseUrl}/index.php?rt=account/account`);
    }

    
    async getAccountUrl() {
        return this.getCurrentUrl();
    }
}

module.exports = AccountPage;