
class FBLoginPage {
    constructor () {
        this.fbAcceptCookies = 'button[data-cookiebanner="accept_button"]';
        this.fbEmail = '#email';
        this.fbPassword = '#pass';
        this.fbLoginButton = '#loginbutton';
    }
}

export default new FBLoginPage();