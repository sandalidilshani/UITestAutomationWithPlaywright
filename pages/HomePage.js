const BasePage = require('./BasePage');

class HomePage extends BasePage {
    constructor(page) {
        super(page);
        
        this.loginOrRegisterLink = page.getByRole('link', { name: 'Login or register' });
        this.homeLink = page.getByRole('link', { name: 'Home' });
        this.categoryMenu = page.locator('#categorymenu');
        this.accountLink = page.getByRole('link', { name: 'Account' });
        this.cartLink = page.getByRole('link', { name: 'Cart' });
        this.checkoutLink = page.getByRole('link', { name: 'Checkout' });
        this.searchKeywordsTextbox = page.getByRole('textbox', { name: 'Search Keywords' });
        this.searchButton = page.getByRole('button', { name: 'Search' });
    }

    async navigate() {
        await this.navigateTo(this.baseUrl);
        await this.page.waitForLoadState();
    }

    async goToHome() {
        await this.homeLink.click();
        await this.page.waitForLoadState();
    }

    async clickCategoryMenu() {
        await this.categoryMenu.click();
    }

    async goToAccount() {
        await this.accountLink.click();
        await this.page.waitForLoadState();
    }

    async goToCart() {
        await this.cartLink.click();
        await this.page.waitForLoadState();
    }

    async goToCheckout() {
        await this.checkoutLink.click();
        await this.page.waitForLoadState();
    }

    async clickLoginOrRegister() {
        await this.loginOrRegisterLink.waitFor({ state: 'visible', timeout: 10000 });
        await this.loginOrRegisterLink.click();
    }

    async isUserLoggedIn() {
        const welcomeLink = this.page.getByRole('link', { name: /Welcome back/ });
        return await welcomeLink.isVisible();
    }

    async isUserLoggedOut() {
        return await this.loginOrRegisterLink.isVisible();
    }

    async clickSearchKeywords() {
        await this.searchKeywordsTextbox.click();
    }

    async searchProducts(searchTerm) {
        await this.searchKeywordsTextbox.click();
        await this.searchKeywordsTextbox.fill(searchTerm);
        await this.searchKeywordsTextbox.press('Enter');
        await this.page.waitForLoadState();
    }
}

module.exports = HomePage;