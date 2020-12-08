import Cart from './cart.js';
import useful from 'useful-library';

const config = useful.loadJsonFile('config.json');

class ProductPopup {
    constructor () {
        this.addToCart = '.o-green-button.o-green-button--smaller';
        this.quantity = '#popup-product-quantity';
        this.quantityInput = 'input[id="popup-product-quantity"]';
        this.popup = '#cart-popup';
        this.goBack = '.c-popup__info-buttons-link.js-close-popup';
        this.size = '.c-popup__info-size-item';
    }

    async addProductIntoCart (page, quantity = undefined) {
        if (quantity)
            if (quantity <= config.maxQuantityOption) {
                await page.selectOption(
                    this.quantity,
                    { value: quantity.toString() }
                );
            } else {
                await page.selectOption(this.quantity, { value: 'other' });
                await page.fill(this.quantityInput, quantity.toString());
                await page.focus(this.addToCart);
            }

        await page.click(this.addToCart);
        await page.waitForSelector(Cart.removeProduct);
        await page.waitForSelector(Cart.continue);
    }
}

export default new ProductPopup();
