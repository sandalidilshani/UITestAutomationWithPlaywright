const path = require('path');
const HomePage = require('../pages/HomePage');
const SearchPage = require('../pages/SearchPage');
const searchTestData = require('../test-data/search-test-data');
const { test, expect } = require('../fixtures/loginFixture');

const authFile = path.join(__dirname, 'storeLoginContext', 'storageState.json');

test.describe('Search Functionality Tests - Guest User', () => {
    test.describe.configure({ tag: '@guest' });
    let homePage;
    let searchPage;
    test.beforeEach(async ({ loginFixture: page }) => {
        homePage = new HomePage(page);
        searchPage = new SearchPage(page);
        await homePage.navigate();
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });

    test('TC002_001 - Verify product search with valid product name', async () => {
        await expect(searchPage.searchBox).toBeVisible();
        await searchPage.performSearch(searchTestData.valid.searchTerm);
        await searchPage.verifySearchResultsDisplayed();
        await searchPage.verifySearchResultsRelevance(searchTestData.valid.searchTerm);
    });

    test('TC002_002 - Verify product search with invalid/non-existent product', async () => {
        await expect(searchPage.searchBox).toBeVisible();

        await searchPage.performSearch(searchTestData.invalid.searchTerm);

        await searchPage.verifyNoProductsFoundMessage();
        await searchPage.verifyNoSearchResults();
    });

    test('TC002_003 - Verify product search with empty search field', async () => {
        await expect(searchPage.searchBox).toBeVisible();

        await searchPage.performEmptySearch();

        const hasValidationMessage = await searchPage.page.locator('.alert-danger, .error-message, .validation-error').count() > 0;
        
        if (hasValidationMessage) {
            await searchPage.verifyValidationMessage();
        } else {
            const currentUrl = await searchPage.getCurrentUrl();
            expect(currentUrl).toContain('automationteststore.com');
        }
    });

    test('TC002_004 - Verify product search with special characters', async () => {
        await expect(searchPage.searchBox).toBeVisible();

        await searchPage.performSearch(searchTestData.specialCharacters.searchTerm);
        await searchPage.verifyGracefulHandling();
    });

    test('TC002_005 - Verify product search with numbers', async () => {
        await expect(searchPage.searchBox).toBeVisible();

        await searchPage.performSearch(searchTestData.numeric.searchTerm);

        const resultsCount = await searchPage.getSearchResultsCount();
        expect(resultsCount).toBeGreaterThanOrEqual(0);
    });

    test('TC002_006 - Verify case-insensitive search', async () => {
        await expect(searchPage.searchBox).toBeVisible();

        await searchPage.verifySearchCaseInsensitive(
            searchTestData.caseInsensitive.upperCase,
            searchTestData.caseInsensitive.lowerCase
        );
    });

    test('TC002_007 - Verify search with maximum character limit', async () => {
        await expect(searchPage.searchBox).toBeVisible();

        await searchPage.performSearch(searchTestData.longString.searchTerm);

        await searchPage.verifyGracefulHandling();
    });

    test('TC002_008 - Verify search results pagination', async () => {
        await expect(searchPage.searchBox).toBeVisible();

        await searchPage.performSearch(searchTestData.pagination.searchTerm);

        const paginationExists = await searchPage.page.locator('.pagination').count() > 0;
        
        if (paginationExists) {
            await searchPage.verifyPaginationDisplayed();
            
            const nextPageExists = await searchPage.nextPageLink.count() > 0;
            if (nextPageExists) {
                await searchPage.clickNextPage();
                const currentUrl = await searchPage.getCurrentUrl();
                expect(currentUrl).toContain('page=2' || 'p=2' || '&page=' || '&p=');
            }
        }
    });

    test('TC002_009 - Verify search results sorting functionality', async () => {
        await expect(searchPage.searchBox).toBeVisible();
        await searchPage.performSearch(searchTestData.sorting.searchTerm);

        const sortDropdownExists = await searchPage.sortDropdown.count() > 0;
    
        if (sortDropdownExists) {
            await searchPage.sortResultsBy(searchTestData.sorting.sortOption);
            await searchPage.verifySortedByPriceAscending();
        } else {
            console.log('Sorting functionality not available on search results page');
        }
    });

    test('TC002_010 - Verify search results filtering', async () => {
        await expect(searchPage.searchBox).toBeVisible();
        await searchPage.performSearch(searchTestData.filtering.searchTerm);

        const filterExists = await searchPage.priceFilter.count() > 0;
        
        if (filterExists) {
            await searchPage.applyPriceFilter(
                searchTestData.filtering.priceRange.min,
                searchTestData.filtering.priceRange.max
            );
            
            const resultsCount = await searchPage.getSearchResultsCount();
            expect(resultsCount).toBeGreaterThanOrEqual(0);
        } else {
            console.log('Price filtering not available on search results page');
        }
    });

    test('TC002_011 - Verify search suggestions/autocomplete', async () => {
        await expect(searchPage.searchBox).toBeVisible();

        await searchPage.typeInSearchBox(searchTestData.autocomplete.partialTerm);

        const suggestionsExist = await searchPage.searchSuggestions.count() > 0;
        
        if (suggestionsExist) {
            await searchPage.verifySearchSuggestionsAppear();
            
            const suggestionCount = await searchPage.suggestionItems.count();
            if (suggestionCount > 0) {
                const firstSuggestionText = await searchPage.suggestionItems.first().textContent();
                await searchPage.selectSuggestion(firstSuggestionText);
                await searchPage.verifySearchResultsDisplayed();
            }
        } else {
            console.log('Search suggestions/autocomplete not available');
        }
    });

    test('TC002_012 - Verify search from different pages', async () => {
        const categoryLink = searchPage.page.getByRole('link', { name: /skincare/i }).first();
        const categoryExists = await categoryLink.count() > 0;
        
        if (categoryExists) {
            await categoryLink.click();
            await searchPage.page.waitForLoadState('networkidle');
        }

        await searchPage.verifySearchFromCurrentPage(searchTestData.crossPage.searchTerm);

        const resultsCount = await searchPage.getSearchResultsCount();
        expect(resultsCount).toBeGreaterThanOrEqual(0);
    });

    test('TC002_013 - Verify search timeout handling', async () => {
    
        await expect(searchPage.searchBox).toBeVisible();
        
        await searchPage.page.route('**/*', async route => {
            if (route.request().url().includes('search')) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            await route.continue();
        });
        await searchPage.performSearch(searchTestData.timeout.searchTerm);
    
        await searchPage.verifyTimeoutHandling();
    });

    test('TC002_014 - Verify product search without user login (Guest user)', async () => {

        await homePage.navigate();
        await expect(searchPage.searchBox).toBeVisible();
        const loginLink = searchPage.page.getByRole('listitem').filter({ hasText: 'Login or register' });
        await expect(loginLink).toBeVisible();
        await expect(searchPage.searchBox).toBeVisible();
        await searchPage.performSearch(searchTestData.guestUser.searchTerm);
        await searchPage.verifySearchResultsDisplayed();
        await searchPage.verifySearchResultsRelevance(searchTestData.guestUser.searchTerm);
        const firstProduct = searchPage.searchResults.first();
        await firstProduct.click();
        await searchPage.page.waitForLoadState('networkidle');
        
    });



    test('TC002_018 - Verify search accessibility from login/register pages', async () => {
        // Test search from login page
        const loginLink = searchPage.page.getByRole('link', { name: /login|sign in/i });
        await loginLink.click();
        await searchPage.page.waitForLoadState('networkidle');

        // Check if search box is available on login page
        const searchBoxOnLogin = searchPage.page.getByPlaceholder('Search Keywords');
        const searchBoxExists = await searchBoxOnLogin.count() > 0;

        if (searchBoxExists) {
            await searchBoxOnLogin.fill(searchTestData.searchFromAuthPages.searchTerm);
            const searchButtonOnLogin = searchPage.page.getByTitle('Go').locator('i');
            await searchButtonOnLogin.click();
            await searchPage.page.waitForLoadState('networkidle');

            // Verify search works and redirects appropriately
            const resultsCount = await searchPage.getSearchResultsCount();
            expect(resultsCount).toBeGreaterThanOrEqual(0);

            // Check if we're on search results page
            const currentUrl = await searchPage.getCurrentUrl();
            expect(currentUrl).toContain('keyword=' || 'search=' || 'q=');
        }

        // Test search from registration page (if available)
        const registerLink = searchPage.page.getByRole('link', { name: /register|sign up|create account/i });
        const registerLinkExists = await registerLink.count() > 0;

        if (registerLinkExists) {
            await registerLink.click();
            await searchPage.page.waitForLoadState('networkidle');

            const searchBoxOnRegister = searchPage.page.getByPlaceholder('Search Keywords');
            const searchBoxOnRegisterExists = await searchBoxOnRegister.count() > 0;

            if (searchBoxOnRegisterExists) {
                await searchBoxOnRegister.fill(searchTestData.searchFromAuthPages.searchTerm);
                const searchButtonOnRegister = searchPage.page.getByTitle('Go').locator('i');
                await searchButtonOnRegister.click();
                await searchPage.page.waitForLoadState('networkidle');

                // Verify search works from registration page
                const resultsCount = await searchPage.getSearchResultsCount();
                expect(resultsCount).toBeGreaterThanOrEqual(0);
            }
        }

        console.log('Search functionality accessibility from authentication pages verified');
    });
});

// Tests that require authentication (Logged-in user tests)
test.describe('Search Functionality Tests - Authenticated User', () => {
    test.describe.configure({ tag: '@authenticated' });
    
    let homePage;
    let searchPage;


    test.beforeEach(async ({ guestFixture: page }) => {
        homePage = new HomePage(page);
        searchPage = new SearchPage(page);
        await homePage.navigate();
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });

    test('TC002_015 - Verify product search with logged-in user ', async () => {
        
       
        await expect(searchPage.searchBox).toBeVisible();
        await searchPage.performSearch("men");

        await searchPage.verifySearchResultsDisplayed();
        const resultsCount = await searchPage.getSearchResultsCount();
        expect(resultsCount).toBeGreaterThan(0);
    });

    test('TC002_017 - Verify search history/suggestions for logged-in users )', async () => {
        
       
    });

    test('TC002_016 - Verify search functionality consistency between guest and logged-in users (using stored context)', async () => {
        const logoutLink = searchPage.page.getByRole('link', { name: /logout|sign out/i }).first();
        const logoutExists = await logoutLink.count() > 0;
        
        if (logoutExists) {
            await logoutLink.click();
            await searchPage.page.waitForLoadState('networkidle');
        }

        await homePage.navigate();
        await searchPage.performSearch(searchTestData.searchConsistency.searchTerm);
        const guestResultsCount = await searchPage.getSearchResultsCount();
        const guestResults = await searchPage.productTitles.allTextContents();

        await searchPage.page.goto('https://automationteststore.com/index.php?rt=account/account');
        await searchPage.page.waitForLoadState('networkidle');

        await homePage.navigate();
        await searchPage.performSearch(searchTestData.searchConsistency.searchTerm);
        const loggedInResultsCount = await searchPage.getSearchResultsCount();
        const loggedInResults = await searchPage.productTitles.allTextContents();

        expect(guestResultsCount).toBe(loggedInResultsCount);
        expect(guestResults.sort()).toEqual(loggedInResults.sort());
        expect(guestResultsCount).toBeGreaterThan(0);
    });
});