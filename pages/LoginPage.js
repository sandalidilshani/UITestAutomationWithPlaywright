const BasePage = require('./BasePage');

class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        
        this.loginNameInput = page.locator('#loginFrm_loginname');
        this.passwordInput = page.locator('#loginFrm_password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.accountLoginHeading = page.getByRole('heading', { name: 'Account Login' }).first();
        this.returningCustomerHeading = page.getByRole('heading', { name: 'Returning Customer', exact: true });
        this.newCustomerHeading = page.getByRole('heading', { name: 'I am a new customer.' });
        this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot your password?' });
        this.forgotLoginLink = page.getByRole('link', { name: 'Forgot your login?' });
        this.continueButton = page.getByRole('button', { name: 'Continue' });
    }


    
    async login(username, password) {
        await this.loginNameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

   
    async enterUsername(username) {
        await this.loginNameInput.fill(username);
    }

    
    async enterPassword(password) {
        await this.passwordInput.fill(password);
    }

    
    async clickLoginButton() {
        await this.loginButton.click();
    }

    
    async isLoginPageDisplayed() {
        return await this.accountLoginHeading.isVisible();
    }

   
    async isReturningCustomerSectionVisible() {
        return await this.returningCustomerHeading.isVisible();
    }

    async clickForgotPassword() {
        await this.forgotPasswordLink.click();
    }

    
    async clickForgotLogin() {
        await this.forgotLoginLink.click();
    }

    async clearLoginFields() {
        await this.loginNameInput.clear();
        await this.passwordInput.clear();
    }
}

module.exports = LoginPage;