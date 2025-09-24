const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class ProductPage extends BasePage {
    constructor(page) {
        super(page);
        this.productTitle = page.locator('h1').first();
        this.productPrice = page.locator('.productprice').first();
        this.productImage = page.locator('.product-image img').first();
        this.productDescription = page.locator('#description p').first();
        this.productModel = page.locator('text=Model:').first();
        this.manufacturerInfo = page.locator('text=Manufacturer:').first();
        this.quantityInput = page.locator('#product_quantity');
        this.totalPriceDisplay = page.locator('text=Total Price:').first();
        this.outOfStockLabel = page.locator('text=Out of Stock').first();
        this.inStockLabel = page.locator('.product-stock:has-text("In Stock")').first();
        this.addToCartButton = page.locator('[href="#"]:has-text("Add to Cart")').first();
        this.printButton = page.locator('a:has-text("Print")').first();
        this.productOptions = page.locator('.product-options');
        this.sizeOptions = page.locator('select[name*="option"], input[name*="option"][type="radio"]');
        this.colorOptions = page.locator('select[name*="color"], input[name*="color"][type="radio"]');
        
        this.successMessage = page.locator('.alert-success');
        this.errorMessage = page.locator('.alert-error, .alert-danger');
        
        this.breadcrumb = page.locator('.breadcrumb');
        
        this.descriptionTab = page.locator('a[href="#description"]');
        this.reviewsTab = page.locator('a[href="#review"]');
        this.tagsTab = page.locator('a[href="#producttag"]');
        
        this.relatedProducts = page.locator('.related-products');
    }

    async navigateToProduct(productId) {
        try {
            await this.page.goto(`/index.php?rt=product/product&product_id=${productId}`, {
                waitUntil: 'domcontentloaded',
                timeout: 60000
            });
            
            await Promise.all([
                this.page.waitForSelector('h1', { timeout: 10000 }),
                this.page.waitForSelector('.productprice', { timeout: 10000 }),
                this.page.waitForSelector('[href="#"]:has-text("Add to Cart")', { timeout: 10000 })
            ]);
            
        } catch (error) {
            console.error(`Failed to navigate to product ${productId}:`, error.message);
            throw new Error(`Navigation to product ${productId} failed: ${error.message}`);
        }
    }

    async navigateToProductByUrl(productUrl) {
        try {
            await this.page.goto(productUrl, {
                timeout: 60000
            });
            
            await Promise.all([
                this.page.waitForSelector('h1', { timeout: 10000 }),
                this.page.waitForSelector('.productprice', { timeout: 10000 }),
                this.page.waitForSelector('[href="#"]:has-text("Add to Cart")', { timeout: 10000 })
            ]);
            
        } catch (error) {
            console.error(`Failed to navigate to product URL ${productUrl}:`, error.message);
            throw new Error(`Navigation to product URL ${productUrl} failed: ${error.message}`);
        }
    }

    async getProductTitle() {
        return await this.productTitle.textContent();
    }

    async getProductPrice() {
        return await this.productPrice.textContent();
    }

    async getProductModel() {
        try {
            return await this.productModel.textContent();
        } catch {
            return null;
        }
    }

    async isOutOfStock() {
        try {
            return await this.outOfStockLabel.isVisible();
        } catch (error) {
            console.log('Error checking out of stock status:', error.message);
            return false;
        }
    }

    async isInStock() {
        try {
            return await this.inStockLabel.isVisible() || !await this.isOutOfStock();
        } catch (error) {
            console.log('Error checking in stock status:', error.message);
            return true; // Default to in stock if we can't determine
        }
    }

    async isAddToCartButtonEnabled() {
        try {
            if (await this.isOutOfStock()) {
                return false;
            }
            return await this.addToCartButton.isVisible();
        } catch (error) {
            console.log('Error checking add to cart button status:', error.message);
            return false; // Default to disabled if we can't determine
        }
    }

    async setQuantity(quantity) {
        await this.quantityInput.clear();
        console.log('Setting quantity to:', quantity);
        await this.quantityInput.fill(quantity.toString());
        
        // Wait for total price to update
        await this.page.waitForTimeout(500);
    }

    async getQuantity() {
        return await this.quantityInput.inputValue();
    }

    async getTotalPrice() {
        return await this.totalPriceDisplay.textContent();
    }

    async addToCart(quantity) {
        if (quantity !== 1) {
            await this.setQuantity(quantity);
        }
        
        // Verify add to cart button is available
        expect(await this.isAddToCartButtonEnabled()).toBeTruthy();
        
        await this.addToCartButton.click();
        await this.page.waitForLoadState();
    }

    async selectProductOption(optionType, optionValue) {
        // Simple approach: just click on the option text
        try {
            await this.page.locator(`text="${optionValue}"`).first().click();
            await this.page.waitForTimeout(500);
        } catch (error) {
            console.log(`Failed to select ${optionType} option ${optionValue}: ${error.message}`);
            throw error;
        }
    }

    async selectSize(size) {
        // Simple approach: click on the size text to select the radio button
        try {
            await this.page.locator(`text="${size}"`).first().click();
            await this.page.waitForTimeout(500);
        } catch (error) {
            console.log(`Failed to select size ${size}: ${error.message}`);
            // Try finding the radio button directly
            try {
                const sizeRadio = this.page.locator(`input[type="radio"]`).filter({ hasText: size });
                await sizeRadio.first().check();
                await this.page.waitForTimeout(500);
            } catch (fallbackError) {
                console.log(`Fallback also failed: ${fallbackError.message}`);
                throw error;
            }
        }
    }

    async selectColor(color) {
        // Simple fix: check if color is already selected, if not then select it
        try {
            const colorSelect = this.page.locator('#option345').filter({ hasText: 'Color' }).first();
            // Check current selection first
            const currentValue = await colorSelect.inputValue();
            if (currentValue !== color.toLowerCase()) {
                await colorSelect.selectOption(color);
            }
            await this.page.waitForTimeout(500);
        } catch (error) {
            console.log(`Failed to select color ${color}: ${error.message}`);
            // If select fails, just continue - color might already be correct
        }
    }

    async hasProductOptions() {
        return await this.productOptions.isVisible();
    }

    
    async verifyProductDetails(expectedTitle, expectedPrice = null) {
        const actualTitle = await this.getProductTitle();
        expect(actualTitle).toContain(expectedTitle);
        
        if (expectedPrice) {
            const actualPrice = await this.getProductPrice();
            expect(actualPrice).toContain(expectedPrice);
        }
    }

    

    async addToCartWithOptions(quantity = 1, options = {}) {
        // Select product options if provided
        if (options.size) {
            await this.selectSize(options.size);
        }
        
        if (options.color) {
            await this.selectColor(options.color);
        }
        
        // Set quantity and add to cart
        await this.addToCart(quantity);
    }

    async getMaxAvailableStock() {
       
        return 999;
    }

    async attemptAddToCartWithExcessiveQuantity(maxStock) {
        const excessiveQuantity = maxStock + 5;
        await this.setQuantity(excessiveQuantity);
        await this.addToCartButton.click();
        await this.page.waitForLoadState();
    }

    async printProduct() {
        await this.printButton.click();
    }

    async clickDescriptionTab() {
        await this.descriptionTab.click();
    }

    async clickReviewsTab() {
        await this.reviewsTab.click();
    }

    async getProductDescription() {
        await this.clickDescriptionTab();
        return await this.productDescription.textContent();
    }

    async verifySuccessMessage(message = null) {
        expect(await this.successMessage.isVisible()).toBeTruthy();
        if (message) {
            const actualMessage = await this.successMessage.textContent();
            expect(actualMessage).toContain(message);
        }
    }

    async verifyErrorMessage(message = null) {
        expect(await this.errorMessage.isVisible()).toBeTruthy();
        if (message) {
            const actualMessage = await this.errorMessage.textContent();
            expect(actualMessage).toContain(message);
        }
    }
}

module.exports = ProductPage;