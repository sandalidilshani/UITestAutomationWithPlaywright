/**
 * Base Page class containing common functionality for all pages
 */
class BasePage {
    constructor(page) {
        this.page = page;
        this.baseUrl = 'https://automationteststore.com';
    }

    /**
     * Navigate to a specific URL
     * @param {string} url - The URL to navigate to
     */
    async navigateTo(url) {
        await this.page.goto(url);
    }

    /**
     * Get the current page title
     * @returns {Promise<string>} Page title
     */
    async getTitle() {
        return await this.page.title();
    }

    /**
     * Get the current page URL
     * @returns {Promise<string>} Current URL
     */
    async getCurrentUrl() {
        return this.page.url();
    }

    /**
     * Wait for an element to be visible
     * @param {string} locator - Element locator
     */
    async waitForElement(locator) {
        await this.page.waitForSelector(locator, { state: 'visible' });
    }
}

module.exports = BasePage;