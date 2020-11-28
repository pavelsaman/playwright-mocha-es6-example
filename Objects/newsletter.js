
class Newsletter {
    constructor (page) {
        this.page = page;
        this.email = '#news-email';
        this.send = '.c-news-subscription__form-top-button'
            + '.o-vanta-black-button';
        this.checkbox = '[for="news-sub-consent-approved"]';
        this.link = this.checkbox + ' > a';
    }
}

export default new Newsletter();
