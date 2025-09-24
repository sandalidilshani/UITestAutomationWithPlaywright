const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class SearchPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Basic search elements
        this.searchBox = page.getByPlaceholder('Search Keywords');
        this.searchButton = page.getByTitle('Go').locator('i');
        this.searchResults = page.locator('.thumbnails .col-md-3');
        this.noResultsMessage = page.getByText('There is no product that');
        this.productTitles = page.locator('.productname, .product-name, a.prdocutname');
        
        // Optional elements (may not exist on all pages)
        this.paginationControls = page.locator('.pagination');
        this.nextPageLink = page.getByRole('link', { name: 'Next' });
        this.sortDropdown = page.locator('#sort');
        this.priceFilter = page.locator('.price-filter');
        this.searchSuggestions = page.locator('.search-suggestions, .autocomplete-suggestions');
        this.suggestionItems = page.locator('.search-suggestions li, .autocomplete-suggestions div');
    }

    // Basic search functionality
    async performSearch(searchTerm) {
        await this.searchBox.fill(searchTerm);
        await this.searchButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async performEmptySearch() {
        await this.searchBox.clear();
        await this.searchButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async typeInSearchBox(searchTerm) {
        await this.searchBox.fill(searchTerm);
        await this.page.waitForTimeout(1000);
    }

    // Verification methods
    async verifySearchResultsDisplayed() {
        await expect(this.searchResults.first()).toBeVisible();
    }

    async verifyNoSearchResults() {
        const resultsCount = await this.searchResults.count();
        expect(resultsCount).toBe(0);
    }

    async verifySearchResultsRelevance(searchTerm) {
        await this.page.waitForLoadState('networkidle');
        const productCount = await this.productTitles.count();
        expect(productCount).toBeGreaterThan(0);
        
        const productTexts = await this.productTitles.allTextContents();
        const relevantProducts = productTexts.filter(text => 
            text.toLowerCase().includes(searchTerm.toLowerCase())
        );
        expect(relevantProducts.length).toBeGreaterThan(0);
    }

    async verifyNoProductsFoundMessage() {
        const messageVisible = await this.noResultsMessage.first().isVisible();
        expect(messageVisible).toBeTruthy();
    }

    async verifyGracefulHandling() {
        const pageError = await this.page.locator('.error-500, .server-error').count();
        expect(pageError).toBe(0);
    }

    // Utility methods
    async getSearchResultsCount() {
        return await this.searchResults.count();
    }

    async verifyPaginationDisplayed() {
        await expect(this.paginationControls).toBeVisible();
    }

    async clickNextPage() {
        await this.nextPageLink.click();
        await this.page.waitForLoadState('networkidle');
    }

    async sortResultsBy(sortOption) {
        await this.sortDropdown.selectOption({ label: sortOption });
        await this.page.waitForLoadState('networkidle');
    }

    async verifySortedByPriceAscending() {
        const priceElements = this.page.locator('.price, .pricenew');
        const prices = await priceElements.allTextContents();
        
        const numericPrices = prices.map(price => {
            const cleanPrice = price.replace(/[^0-9.]/g, '');
            return parseFloat(cleanPrice) || 0;
        }).filter(price => price > 0);

        for (let i = 1; i < numericPrices.length; i++) {
            expect(numericPrices[i]).toBeGreaterThanOrEqual(numericPrices[i - 1]);
        }
    }

    async verifySearchSuggestionsAppear() {
        await expect(this.searchSuggestions.first()).toBeVisible();
    }

    async verifySearchFromCurrentPage(searchTerm) {
        await this.performSearch(searchTerm);
        await this.verifySearchResultsDisplayed();
    }

    async verifyTimeoutHandling() {
        // Check that no server errors occurred
        const serverError = await this.page.locator('.error-500, .server-error').count();
        expect(serverError).toBe(0);
        
        // Check that the search box is still functional
        const searchBoxResponsive = await this.searchBox.isVisible();
        expect(searchBoxResponsive).toBeTruthy();
        
        // Check that the page didn't crash
        const pageTitle = await this.page.title();
        expect(pageTitle).toBeTruthy();
    }

    async verifySearchCaseInsensitive(upperCaseTerm, lowerCaseTerm) {
        await this.performSearch(upperCaseTerm);
        const upperCaseResults = await this.getSearchResultsCount();
        
        await this.performSearch(lowerCaseTerm);
        const lowerCaseResults = await this.getSearchResultsCount();
        
        expect(upperCaseResults).toBe(lowerCaseResults);
        expect(upperCaseResults).toBeGreaterThan(0);
    }

    // Additional methods needed by tests
    async verifyValidationMessage() {
        const validationMessage = this.page.locator('.alert-danger, .error-message, .validation-error');
        const validationVisible = await validationMessage.first().isVisible();
        expect(validationVisible).toBeTruthy();
    }

    async selectSuggestion(suggestionText) {
        const suggestion = this.suggestionItems.filter({ hasText: suggestionText });
        await suggestion.first().click();
        await this.page.waitForLoadState('networkidle');
    }

    async applyPriceFilter(minPrice, maxPrice) {
        const minPriceInput = this.page.locator('input[name="min_price"], #price-min');
        const maxPriceInput = this.page.locator('input[name="max_price"], #price-max');
        
        if (await minPriceInput.count() > 0) {
            await minPriceInput.fill(minPrice.toString());
        }
        if (await maxPriceInput.count() > 0) {
            await maxPriceInput.fill(maxPrice.toString());
        }
        
        const applyFilterButton = this.page.getByRole('button', { name: 'Apply' });
        if (await applyFilterButton.count() > 0) {
            await applyFilterButton.click();
            await this.page.waitForLoadState('networkidle');
        }
    }
}

module.exports = SearchPage;