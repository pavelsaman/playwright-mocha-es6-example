
class Fulltext {
    constructor () {
        this.input = '#fulltext-search-input';
        this.glass = '#fulltext-search-button';
        this.close = '#fulltext-search-close';
        this.showMore = '#search-more-link';
        this.searchContainer = '#search-result-container';
        this.suggestUrl = 'Product/Suggest?query={term}&pageSize=10';
        this.mobileSearch = '#mobile-search';
    }
}

export default new Fulltext();