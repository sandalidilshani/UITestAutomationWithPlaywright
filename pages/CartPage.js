const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class CartPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Page elements
        this.cartTitle = page.locator('h1:has-text("Shopping Cart")');
        this.emptyCartMessage = page.locator('text=Your shopping cart is empty!');
        
        // Cart table - using the specific structure from HTML
        this.cartTable = page.locator('.container-fluid.cart-info.product-list table.table.table-striped.table-bordered');
        this.cartTableRows = page.locator('.container-fluid.cart-info.product-list table tbody tr');
        this.cartHeaderRow = page.locator('.container-fluid.cart-info.product-list table tbody tr').first();
        
        // Product elements in cart (excluding header row)
        this.productRows = page.locator('.container-fluid.cart-info.product-list table tbody tr:not(:first-child)');
        
        // Buttons - using specific selectors from HTML
        this.updateButton = page.locator('button#cart_update');
        this.checkoutButton = page.locator('a#cart_checkout1');
        this.continueShoppingButton = page.locator('a:has-text("Continue Shopping")');
        
        // Coupon section
        this.couponInput = page.locator('input[name="coupon"]');
        this.applyCouponButton = page.locator('button:has-text("Apply Coupon")');
        
        // Shipping estimation
        this.countryDropdown = page.locator('select').first();
        this.stateDropdown = page.locator('select').nth(1);
        this.zipCodeInput = page.locator('input[type="text"]').last();
        this.estimateButton = page.locator('button:has-text("Estimate")');
        
        // Summary section
        this.subTotal = page.locator('td:has-text("Sub-Total:") + td');
        this.shippingCost = page.locator('td:has-text("Flat Shipping Rate:") + td');
        this.grandTotal = page.locator('td:has-text("Total:") + td');
        
        // Success/Error messages
        this.successMessage = page.locator('.alert-success');
        this.errorMessage = page.locator('.alert-error, .alert-danger');
    }

    async navigateToCart() {
        await this.page.goto('/index.php?rt=checkout/cart');
        await expect(this.page).toHaveTitle(/Shopping Cart/);
    }

    async isCartEmpty() {
        return await this.emptyCartMessage.isVisible();
    }

    async getCartItemCount() {
        const cartItems = await this.productRows.count();
        return cartItems;
    }

    async getProductNameInCart(index = 0) {
        const row = this.productRows.nth(index);
        const nameCell = row.locator('td.align_left').first();
        const nameLink = nameCell.locator('a').first();
        return await nameLink.textContent();
    }

    async getProductModelInCart(index = 0) {
        const row = this.productRows.nth(index);
        const modelCell = row.locator('td.align_left').nth(1); // Second align_left cell is model
        return await modelCell.textContent();
    }

    async getUnitPriceInCart(index = 0) {
        const row = this.productRows.nth(index);
        const priceCell = row.locator('td.align_right').first(); // First align_right cell is unit price
        return await priceCell.textContent();
    }

    async getQuantityInCart(index = 0) {
        const row = this.productRows.nth(index);
        const quantityInput = row.locator('td.align_center input.form-control');
        return await quantityInput.inputValue();
    }

    async getTotalPriceInCart(index = 0) {
        const row = this.productRows.nth(index);
        const totalCell = row.locator('td.align_right').nth(1); // Second align_right cell is total
        return await totalCell.textContent();
    }

    async updateQuantity(quantity, index = 0) {
        const row = this.productRows.nth(index);
        const quantityField = row.locator('td.align_center input.form-control');
        await quantityField.clear();
        await quantityField.fill(quantity.toString());
        await this.updateButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async removeProduct(index = 0) {
        const row = this.productRows.nth(index);
        const removeBtn = row.locator('td.align_center a.btn.btn-sm.btn-default[href*="remove"]');
        await removeBtn.click();
        await this.page.waitForLoadState('networkidle');
    }

    async applyCoupon(couponCode) {
        await this.couponInput.fill(couponCode);
        await this.applyCouponButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getSubTotal() {
        return await this.subTotal.textContent();
    }

    async getShippingCost() {
        return await this.shippingCost.textContent();
    }

    async getGrandTotal() {
        return await this.grandTotal.textContent();
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async verifyProductInCart(productName, quantity, price = null) {
        // Wait for cart table to be visible
        await this.cartTable.waitFor({ state: 'visible' });
        
        // Find the product row by searching through all product rows
        let productFound = false;
        const itemCount = await this.getCartItemCount();
        let productIndex = -1;
        
        for (let i = 0; i < itemCount; i++) {
            const currentProductName = await this.getProductNameInCart(i);
            if (currentProductName && currentProductName.trim().includes(productName.trim())) {
                productFound = true;
                productIndex = i;
                break;
            }
        }
        
        console.log(`Verifying product "${productName}" in cart: ${productFound}`);
        expect(productFound).toBeTruthy();
        
        if (quantity && productIndex >= 0) {
            const cartQuantity = await this.getQuantityInCart(productIndex);
            expect(parseInt(cartQuantity)).toBe(quantity);
        }
        
        if (price && productIndex >= 0) {
            const cartPrice = await this.getTotalPriceInCart(productIndex);
            expect(cartPrice).toContain(price);
        }
    }
    

    async verifyCartTotals(expectedSubTotal, expectedTotal) {
        const subTotal = await this.getSubTotal();
        const grandTotal = await this.getGrandTotal();
        
        if (expectedSubTotal) {
            expect(subTotal).toContain(expectedSubTotal);
        }
        
        if (expectedTotal) {
            expect(grandTotal).toContain(expectedTotal);
        }
    }

    async getAllProductsInCart() {
        const products = [];
        const itemCount = await this.getCartItemCount();
        
        for (let i = 0; i < itemCount; i++) {
            const product = {
                name: await this.getProductNameInCart(i),
                model: await this.getProductModelInCart(i),
                unitPrice: await this.getUnitPriceInCart(i),
                quantity: await this.getQuantityInCart(i),
                totalPrice: await this.getTotalPriceInCart(i)
            };
            products.push(product);
        }
        
        return products;
    }

    async clearCart() {
        const itemCount = await this.getCartItemCount();
        for (let i = 0; i < itemCount; i++) {
            await this.removeProduct(0); // Always remove first item
        }
    }

    async waitForCartUpdate() {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000); // Additional wait for UI updates
    }

    // Additional helper methods for the specific cart structure
    async getProductImageInCart(index = 0) {
        const row = this.productRows.nth(index);
        const imageCell = row.locator('td.align_center').first();
        const imageLink = imageCell.locator('a img');
        return await imageLink.getAttribute('src');
    }

    async clickProductLinkInCart(index = 0) {
        const row = this.productRows.nth(index);
        const nameCell = row.locator('td.align_left').first();
        const nameLink = nameCell.locator('a').first();
        await nameLink.click();
        await this.page.waitForLoadState('networkidle');
    }

    async isCartTableVisible() {
        return await this.cartTable.isVisible();
    }

    async waitForCartTableToLoad() {
        await this.cartTable.waitFor({ state: 'visible', timeout: 10000 });
        await this.page.waitForLoadState('networkidle');
    }

    // Method to get specific product details by product name
    async getProductDetailsByName(productName) {
        const itemCount = await this.getCartItemCount();
        
        for (let i = 0; i < itemCount; i++) {
            const currentProductName = await this.getProductNameInCart(i);
            if (currentProductName && currentProductName.trim().includes(productName.trim())) {
                return {
                    index: i,
                    name: currentProductName,
                    model: await this.getProductModelInCart(i),
                    unitPrice: await this.getUnitPriceInCart(i),
                    quantity: await this.getQuantityInCart(i),
                    totalPrice: await this.getTotalPriceInCart(i)
                };
            }
        }
        return null;
    }
}

module.exports = CartPage;