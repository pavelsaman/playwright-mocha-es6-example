
class ProductListing {
    constructor () {
        this.productItem = '.c-product-list__item';
        this.productName = this.productItem + ' > h2';
        this.productPrice = '.c-product-list__item-price-normal';
        this.productDiscount = '.c-product-list__item-discount';
        this.coupon = '.c-product-list__item-coupon.js-product-coupon';
    }
}

export default new ProductListing();