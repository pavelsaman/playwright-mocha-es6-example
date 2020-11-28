
class Cart1 {
    constructor () {
        this.warning = '.c-step-1__warning';
        this.goShopping = 'a[href="/"]';
    }
}

class Cart2 {
    constructor () {
        this.deliveryPaymentItem = 'c-step-2__item';
        this.deliveryPaymentName = 'c-step-2__item-name';
    }

    async selectDeliveryMethod (page, deliveryMethodName) {
        const selector = '//label[@class="'
            + this.deliveryPaymentItem
            + '"]//div[@class="'
            + this.deliveryPaymentName
            + '" and text()="'
            + deliveryMethodName + '"]';
        const selectedDelivery = await page.$(selector);
        await selectedDelivery.click();
    }

    async selectPaymentMethod (page, paymentMethodName) {
        const selector = '//label[@class="'
            + this.deliveryPaymentItem
            + '"]//div[@class="'
            + this.deliveryPaymentName
            + '" and text()="'
            + paymentMethodName + '"]';
        const selectedPayment = await page.$(selector);
        await selectedPayment.click();
    }
}

class Cart3 {
    constructor () {
        this.invoiceInfo = {
            firstName: '#FirstName',
            lastName: '#LastName',
            street: '#Street',
            city: '#City',
            zipCode: '#ZipCode',
            email: '#Email',
            phone: '#Phone'
        }
        this.checkbox = {
            generalTerms: '//label[@class="o-checkbox__label required" ' +
                + 'and @for="OrderConsents_0__IsChecked"]'
        }
    }

    async fillInInvoiceInfo (page, invoiceInfo) {

        if (invoiceInfo.firstName)
            await page.fill(this.invoiceInfo.firstName, invoiceInfo.firstName);

        if (invoiceInfo.lastName)
            await page.fill(this.invoiceInfo.lastName, invoiceInfo.lastName);

        if (invoiceInfo.street)
            await page.fill(this.invoiceInfo.street, invoiceInfo.street);

        if (invoiceInfo.city)
            await page.fill(this.invoiceInfo.city, invoiceInfo.city);

        if (invoiceInfo.zipCode)
            await page.fill(this.invoiceInfo.zipCode, invoiceInfo.zipCode);

        if (invoiceInfo.email)
            await page.fill(this.invoiceInfo.email, invoiceInfo.email);

        if (invoiceInfo.phone)
            await page.fill(this.invoiceInfo.phone, invoiceInfo.phone);
    }
}

class Cart4 {
    constructor () {
        this.strongTYTexts = '.c-thank-you__text > strong';
    }
}

class Cart {
    constructor () {
        this.continue = '.c-cart-buttons__continue.o-button';
        this.productQuantity = '.c-step-1__item-select';
        this.removeProduct = '.c-step-1__item-remove';
        this.steps = {
            one: new Cart1(),
            two: new Cart2(),
            three: new Cart3(),
            four: new Cart4()
        }
    }
}

export default new Cart();