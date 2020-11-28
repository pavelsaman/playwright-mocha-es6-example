import ProductPopup from './productPopup';
import config from '../config.json';

class ProductDetail {
    constructor () {
        this.name = '.c-product-detail-main__info-title';
        this.addToCart = '#add-to-cart';
        this.quantity = '#product-detail-quantity';
        this.quantityInput = 'input[id="product-detail-quantity"]';
        this.coupon = '.c-product-detail-main__info-tag' +
            + '.c-product-detail-main__info-tag--coupon.js-product-coupon';
        this.sizesLink = '#detail-size-table-toggle';
        this.sizes = '#product-detail-size > a';
        this.belongToLink = '.c-product-detail-footer__sorting-link';
    }

    async chooseQuantity (page, quantity = undefined) {
        if (quantity) {
            if (quantity <= config.maxQuantityOption) {
                await page.selectOption(this.quantity,
                    { value: quantity.toString() }
                );
            } else {
                await page.selectOption(this.quantity, { value: 'other' });
                await page.fill(this.quantityInput, quantity.toString());
                await page.focus(this.addToCart);
            }
        }
    }

    async addProductIntoCart (page, quantity = undefined) {
        await this.chooseQuantity(page, quantity);

        await Promise.all([
            page.waitForFunction(
                selector => {
                    const p = document.querySelector(selector);
                    if (p)
                        return p.getAttribute("class").includes('visible');
                    return false;
                },
                ProductPopup.popup
            ),
            page.click(this.addToCart)
        ]);
    }

    selectedSize (page) {
        return page.evaluate(
            selector => {
                const sizes = document.querySelectorAll(selector);
                let i = 0;
                for(const el of sizes) {
                    if (el.getAttribute('class').includes('active'))
                        return i;
                    i++;
                }

                return undefined;
            },
            this.sizes
        );
    }
}

export default new ProductDetail();