const BasePage = require('./BasePage');


class HomePage extends BasePage {
    constructor(page) {
        super(page);
        
       
        this.loginOrRegisterLink = page.getByRole('link', { name: 'Login or register' });
        this.mainMenuDropdown = page.locator('select.form-control');
        this.searchBox = page.getByPlaceholder('Search Keywords');
        this.cartLink = page.getByRole('link', { name: /0 Items - \$0\.00/ });
    }

    
    async navigate() {
        await this.navigateTo(this.baseUrl);
    }

   
    async clickLoginOrRegister() {
        await this.loginOrRegisterLink.click();
    }

    async goToAccountPage(){
        await this.page.getByRole('link', { name: 'Account', exact: true }).click();
    }


    async isUserLoggedIn() {
        const welcomeLink = this.page.getByRole('link', { name: /Welcome back/ });
        return await welcomeLink.isVisible();
    }

    
    async isUserLoggedOut() {
        return await this.loginOrRegisterLink.isVisible();
    }
}

module.exports = HomePage;