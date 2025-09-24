const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

class CartPage extends BasePage {
    constructor(page) {
        super(page);
        
        // Basic cart elements
        this.emptyCartMessage = page.locator('text=Your shopping cart is empty!');
        this.cartTable = page.locator('.container-fluid.cart-info.product-list table.table.table-striped.table-bordered');
        this.productRows = page.locator('.container-fluid.cart-info.product-list table tbody tr:not(:first-child)');
        
        // Essential buttons
        this.updateButton = page.locator('button#cart_update');
        this.checkoutButton = page.locator('a#cart_checkout2');
        this.continueShoppingButton = page.locator('a:has-text("Continue Shopping")');
        
        // Summary section
        this.grandTotal = page.locator('#totals_table td:has-text("Total:") + td span.bold.totalamout');
    }

    async navigateToCart() {
        await this.page.goto('/index.php?rt=checkout/cart');
        await expect(this.page).toHaveTitle(/Shopping Cart/);
    }

    async isCartEmpty() {
        return await this.emptyCartMessage.isVisible();
    }

    async getCartItemCount() {
        if (await this.isCartEmpty()) {
            return 0;
        }
        const cartItems = await this.productRows.count();
        console.log(`Cart item count: ${cartItems}`);
        return cartItems;
    }

    async getProductNameInCart(index = 0) {
        const row = this.productRows.nth(index);
        const nameCell = row.locator('td.align_left').first();
        const nameLink = nameCell.locator('a').first();
        return await nameLink.textContent();
    }

    async getQuantityInCart(index = 0) {
        const row = this.productRows.nth(index);
        const quantityInput = row.locator('td.align_center input.form-control');
        return await quantityInput.inputValue();
    }

    async removeProduct(index = 0) {
        const row = this.productRows.nth(index);
        const removeBtn = row.locator('td.align_center a.btn.btn-sm.btn-default[href*="remove"]');
        await removeBtn.click();
        await this.page.waitForLoadState();
    }

    async proceedToCheckout() {
        await this.checkoutButton.click();
        await this.page.waitForLoadState();
    }

    async verifyProductInCart(productName, quantity) {
        if (await this.isCartEmpty()) {
            throw new Error(`Cart is empty, cannot verify product "${productName}"`);

        }
        await this.cartTable.waitFor({ state: 'visible' });
        
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
        
        expect(productFound).toBeTruthy();
        
        if (quantity && productIndex >= 0) {
            const cartQuantity = await this.getQuantityInCart(productIndex);
            expect(parseInt(cartQuantity)).toBe(quantity);
        }
    }

    async clearCart() {
        const itemCount = await this.getCartItemCount();
        for (let i = 0; i < itemCount; i++) {
            await this.removeProduct(0);
        }
    }

    async getCartInfo() {
        // Get cart info from the cart link text (e.g., "0 Items - $0.00")
        const cartLink = this.page.locator('a:has-text("Cart")').first();
        const cartLinkText = await cartLink.textContent();
        
        // Extract item count from text like "0 Items - $0.00"
        const itemCountMatch = cartLinkText.match(/(\d+)\s+Items/);
        const itemCount = itemCountMatch ? parseInt(itemCountMatch[1]) : 0;
        
        // Extract total price from text like "0 Items - $0.00"
        const priceMatch = cartLinkText.match(/\$([\d.]+)/);
        const totalPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;
        
        return {
            itemCount: itemCount,
            totalPrice: totalPrice,
            cartLinkText: cartLinkText
        };
    }
}

module.exports = CartPage;