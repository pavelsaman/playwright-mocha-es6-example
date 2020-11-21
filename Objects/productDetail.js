import ProductPopup from './productPopup';

class ProductDetail {
    constructor () {
        this.name = '.c-product-detail-main__info-title';
        this.addToCart = '#add-to-cart';
        this.quantity = '#product-detail-quantity';
        this.quantityInput = 'input[id="product-detail-quantity"]';
        this.coupon = '.c-product-detail-main__info-tag.c-product-detail-main__info-tag--coupon.js-product-coupon';
        this.sizesLink = '#detail-size-table-toggle';
    }

    async addProductIntoCart (page, quantity = undefined) {
        if (quantity) {
            if (quantity <= 10) {
                await page.selectOption(this.quantity,
                    { value: quantity.toString() }
                );
            } else {
                await page.selectOption(this.quantity, { value: 'other' });
                await page.fill(this.quantityInput, quantity.toString());
                await page.focus(this.addToCart);
            }
        }

        await Promise.all([
            page.waitForFunction(
                selector => {
                    let p = document.querySelector(selector);
                    if (p) {
                        return p.getAttribute("class").includes('visible');
                    }
                    return false;
                },    
                ProductPopup.popup
            ),
            page.click(this.addToCart)
        ]);              
    }    
}

export default new ProductDetail();