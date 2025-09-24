const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class SearchPage extends BasePage {
    constructor(page) {
        super(page);
        
        this.searchBox = page.getByPlaceholder('Search Keywords');
        this.searchButton = page.getByTitle('Go').locator('i');
        this.searchResults = page.locator('.thumbnails .col-md-3');
        this.noResultsMessage = page.getByText('There is no product that');
        this.productTitles = page.locator('.productname, .product-name, a.prdocutname, .thumbnails .product-name a');
        this.paginationControls = page.locator('.pagination');
        this.nextPageLink = page.getByRole('link', { name: 'Next' });
        this.pageNumberLinks = page.locator('.pagination a[data-id]');
        this.sortDropdown = page.locator('#sort');
        this.priceFilter = page.locator('.price-filter');
        this.brandFilter = page.locator('.brand-filter');
        this.categoryFilter = page.locator('.category-filter');
        this.searchSuggestions = page.locator('.search-suggestions, .autocomplete-suggestions');
        this.suggestionItems = page.locator('.search-suggestions li, .autocomplete-suggestions div');
        this.validationMessage = page.locator('.alert-danger, .error-message, .validation-error');
        this.timeoutMessage = page.locator('.timeout-message, .error-timeout');
    }

   
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

    
    async selectSuggestion(suggestionText) {
        const suggestion = this.suggestionItems.filter({ hasText: suggestionText });
        await suggestion.first().click();
        await this.page.waitForLoadState('networkidle');
    }

    
    async verifySearchResultsDisplayed() {
        await expect(this.searchResults.first()).toBeVisible();
    }

  
    async verifyNoSearchResults() {
        const resultsCount = await this.searchResults.count();
        expect(resultsCount).toBe(0);
    }

  
    async verifySearchResultsRelevance(searchTerm) {
        await this.page.waitForLoadState('networkidle');
        
        const productTitleSelectors = [
            '.productname',
            '.product-name',
            '.product-title',
            'a.prdocutname',
            '.thumbnails .product-name a',
            '.thumbnails a[title]'
        ];
        
        let productTitles = null;
        let productCount = 0;
        
        for (const selector of productTitleSelectors) {
            const elements = this.page.locator(selector);
            const count = await elements.count();
            if (count > 0) {
                productTitles = elements;
                productCount = count;
                break;
            }
        }
        
        expect(productCount).toBeGreaterThan(0);
        
        const productTexts = await productTitles.allTextContents();
        const relevantProducts = productTexts.filter(text => 
            text.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        expect(relevantProducts.length).toBeGreaterThan(0);
    }

    
    async verifyNoProductsFoundMessage() {
        const messageVisible = await this.noResultsMessage.first().isVisible();
        expect(messageVisible).toBeTruthy();
    }

   async verifyValidationMessage() {
        const validationVisible = await this.validationMessage.first().isVisible();
        expect(validationVisible).toBeTruthy();
    }

    
    async verifyGracefulHandling() {
        const pageError = await this.page.locator('.error-500, .server-error').count();
        expect(pageError).toBe(0);
    }

 
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

   
    async clickPageNumber(pageNumber) {
        const pageLink = this.page.getByRole('link', { name: pageNumber.toString() });
        await pageLink.click();
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

    async verifySearchSuggestionsAppear() {
        await expect(this.searchSuggestions.first()).toBeVisible();
    }

  
    async verifySearchFromCurrentPage(searchTerm) {
        await this.performSearch(searchTerm);
        await this.verifySearchResultsDisplayed();
    }

   
    async verifyTimeoutHandling() {
        try {
            // Check for timeout-specific error messages
            const timeoutMessageVisible = await this.timeoutMessage.first().isVisible({ timeout: 2000 });
            if (timeoutMessageVisible) {
                console.log('Timeout message is visible - timeout handled gracefully');
                return;
            }
        } catch (error) {
            // Timeout message not found, check other indicators
        }

        try {
            // Check that no server errors occurred
            const serverError = await this.page.locator('.error-500, .server-error').first().isVisible({ timeout: 2000 });
            expect(serverError).toBeFalsy();
            
            // Check that the search box is still functional
            const searchBoxResponsive = await this.searchBox.isVisible({ timeout: 2000 });
            expect(searchBoxResponsive).toBeTruthy();
            
            // Check that the page didn't crash
            const pageTitle = await this.page.title();
            expect(pageTitle).toBeTruthy();
            
            console.log('Page remains responsive despite potential timeout');
        } catch (error) {
            console.log('Error during timeout verification:', error.message);
            throw error;
        }
    }

   
    async verifySearchCaseInsensitive(upperCaseTerm, lowerCaseTerm) {
        await this.performSearch(upperCaseTerm);
        const upperCaseResults = await this.getSearchResultsCount();
        
        await this.performSearch(lowerCaseTerm);
        const lowerCaseResults = await this.getSearchResultsCount();
        
        expect(upperCaseResults).toBe(lowerCaseResults);
        expect(upperCaseResults).toBeGreaterThan(0);
    }

   
    async verifyGuestUserAccess() {
        const loginLink = this.page.getByRole('link', { name: /login|sign in/i });
        await expect(loginLink).toBeVisible();
    }

    
    async verifyLoggedInUserAccess() {
        const userIndicator = this.page.locator('.welcome, .username, .profile-indicator').first();
        const accountLink = this.page.getByRole('link', { name: /account|profile/i });
        
        const isLoggedIn = await userIndicator.count() > 0 || await accountLink.count() > 0;
        expect(isLoggedIn).toBeTruthy();
    }

    
    async performLogin(username, password) {
        const loginLink = this.page.getByRole('link', { name: /login|sign in/i });
        await loginLink.click();
        await this.page.waitForLoadState('networkidle');

        const usernameField = this.page.getByPlaceholder(/username|email/i);
        const passwordField = this.page.getByPlaceholder(/password/i);
        const loginButton = this.page.getByRole('button', { name: /login|sign in/i });

        await usernameField.fill(username);
        await passwordField.fill(password);
        await loginButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    
    async verifyProductDetailsAccess() {
        const firstProduct = this.searchResults.first();
        await firstProduct.click();
        await this.page.waitForLoadState('networkidle');
        
        const productDetailsVisible = this.page.locator('.product-info, .product-details, .productpagecart').first();
        await expect(productDetailsVisible).toBeVisible();
    }

    
    async compareSearchResults(searchTerm) {
        await this.performSearch(searchTerm);
        const resultsCount = await this.getSearchResultsCount();
        const productTexts = await this.productTitles.allTextContents();
        
        return {
            count: resultsCount,
            products: productTexts.sort()
        };
    }

    
    async checkSearchHistory() {
        await this.searchBox.click();
        await this.page.waitForTimeout(500);

        const searchHistoryExists = await this.page.locator('.search-history, .recent-searches').count() > 0;
        return searchHistoryExists;
    }

    
    async verifySearchFromAuthPage(searchTerm) {
        const searchBoxOnPage = this.page.getByPlaceholder('Search Keywords');
        const searchBoxExists = await searchBoxOnPage.count() > 0;

        if (searchBoxExists) {
            await searchBoxOnPage.fill(searchTerm);
            const searchButtonOnPage = this.page.getByTitle('Go').locator('i');
            await searchButtonOnPage.click();
            await this.page.waitForLoadState('networkidle');

            const resultsCount = await this.getSearchResultsCount();
            expect(resultsCount).toBeGreaterThanOrEqual(0);

            const currentUrl = await this.getCurrentUrl();
            expect(currentUrl).toContain('keyword=' || 'search=' || 'q=');
        }

        return searchBoxExists;
    }
}

module.exports = SearchPage;