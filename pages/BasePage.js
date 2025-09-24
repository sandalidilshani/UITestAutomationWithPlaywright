const config = require('../config/config.js');
class BasePage {
    constructor(page) {
        this.page = page;
        this.baseUrl = config.app.baseUrl;
    }
    async navigateTo(url = this.baseUrl) {
        await this.page.goto(url);
    }
    async getTitle() {
        return await this.page.title();
    }
    async getCurrentUrl() {
        return this.page.url();
    }
    async waitForElement(locator) {
        await this.page.waitForSelector(locator, { state: 'visible' });
    }
}

module.exports = BasePage;