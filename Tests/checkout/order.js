/* global browser */

import { saveVideo } from 'playwright-video';
import chai from 'chai';
import * as env from '../../Helpers/env.js';
import * as options from '../../Helpers/browserOptions.js';
import ProductDetail from '../../Objects/productDetail.js';
import ProductPopup from '../../Objects/productPopup.js';
import Cart from '../../Objects/cart.js';
import SummaryBox from '../../Objects/summaryBox.js';
import useful from 'useful-library';

const config = useful.loadJsonFile('config.json');
const expect = chai.expect;
const baseUrl = config.baseUrl[env.envWithLang()];
const orderData = useful.loadJsonFile('./Resources/' + env.env() + '/'
    + env.lang() + '/order.json');
const productUrl = "damska-mikina-cussa/lswp203828";

function waitForSelected (page, selector, text) {
    return page.waitForFunction(
        args => {
            const els = document.querySelectorAll(args.selector);
            for (const el of els) {
                if (el.innerText === args.text)
                    return true;
            }
            return false;
        },
        {
            selector: selector,
            text    : text
        }
    );
}

/* eslint-disable max-lines-per-function, max-nested-callbacks */
suite('Create order', function () {

    const suiteName = this.title.replace(/ /g, '_');
    let context, page, isoDatetime, testName;

    suiteSetup(function () {
        isoDatetime = new Date().toISOString().replace(/:/g, '-');
    });

    setup(async function () {
        testName = this.currentTest.title.replace(/ /g, '_');

        context = await browser.newContext(options.contextConfig());
        page = await context.newPage();
        if (config.recordVideo) {
            await saveVideo(
                page,
                `./Results/Videos/${suiteName}/${testName}-${isoDatetime}.mp4`
            );
        }
        await page.goto(baseUrl + productUrl, { waitUntil: 'networkidle' });
    });

    teardown(async function () {
        await page.screenshot({
            path: './Results/Screenshots/' + suiteName + '/' + testName + '-'
                + isoDatetime + '.png'
        });
        await page.close();
        await context.close();
    });

    orderData.forEach((data, i) => {
        test(i + '-create order as unregistered user', async function () {

            await ProductDetail.addProductIntoCart(page, 1);
            await ProductPopup.addProductIntoCart(page, 1);
            await page.click(Cart.continue);

            // cart 2
            await Promise.all([
                waitForSelected(
                    page,
                    SummaryBox.deliveryName,
                    data.deliveryMethod
                ),
                Cart.steps.two.selectDeliveryMethod(page, data.deliveryMethod)
            ]);
            await Promise.all([
                waitForSelected(
                    page,
                    SummaryBox.paymentName,
                    data.paymentMethod
                ),
                Cart.steps.two.selectPaymentMethod(page, data.paymentMethod)
            ]);

            // cart 3
            await page.click(Cart.continue);
            await Cart.steps.three.fillInInvoiceInfo(page, data);
            await page.check(Cart.steps.three.checkbox.generalTerms);

            // cart 4 === TY page
            await page.click(Cart.continue);
            await page.waitForSelector(Cart.steps.four.strongTYTexts);
            const strongTexts = await page.$$(Cart.steps.four.strongTYTexts);
            const orderNumber = await strongTexts[1].innerText();

            if (env.lang() === 'cz')
                expect(orderNumber).to.match(/^[0-9]{2}0[0-9]{5}$/);
            if (env.lang() === 'sk')
                expect(orderNumber).to.match(/^[0-9]{2}1[0-9]{5}$/);
        }).timeout(config.longTestCaseTimeout);
    });
});
