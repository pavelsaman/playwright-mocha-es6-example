/* global browser */

import { saveVideo } from 'playwright-video';
import chai from 'chai';
import * as env from '../../Helpers/env.js';
import * as options from '../../Helpers/browserOptions.js';
import ProductDetail from '../../Objects/productDetail.js';
import ProductPopup from '../../Objects/productPopup.js';
import SizesPopup from '../../Objects/sizesPopup.js';
import useful from 'useful-library';

const config = useful.loadJsonFile('config.json');
const expect = chai.expect;
const baseUrl = config.baseUrl[env.envWithLang()];
const productUrl = "damska-mikina-cussa/lswp203828";
const SUCCESS = 200;

/* eslint-disable max-lines-per-function, max-nested-callbacks,
   prefer-arrow-callback */
suite('Product detail', function () {

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

    test('Choose different product size', async function () {

        const sizes = await page.$$(ProductDetail.sizes);
        const selected = await ProductDetail.selectedSize(page);

        // choose different product size
        let newSelected = useful.randInt(0, sizes.length - 1);
        if (sizes.length > 1) {
            while (selected === newSelected)
                newSelected = useful.randInt(0, sizes.length - 1);
        }

        // click on different product size
        await sizes[newSelected].click();
        await page.waitForFunction(
            args => {
                const sizeOpts = document.querySelectorAll(args.selector);
                if (sizeOpts[args.index].getAttribute('class')
                    .includes('active'))
                    return true;
                return false;
            },
            {
                selector: ProductDetail.sizes,
                index   : newSelected
            }
        );

        // get product size text
        const productSizeText = await sizes[newSelected].innerText();

        // open product popup and assert product size text
        await ProductDetail.addProductIntoCart(page, 1);
        const productSizePopupEl = await page.$(ProductPopup.size);
        const productSizepopupText = await productSizePopupEl.innerText();

        expect(productSizeText).to.equal(productSizepopupText);
    });

    test('Open and close product sizes popup', async function () {

        await page.click(ProductDetail.sizesLink);
        await page.waitForSelector(SizesPopup.popup);
        await page.click(SizesPopup.close);
        await page.waitForSelector(SizesPopup.popup, { state: 'hidden' });
    });

    test('Open product popup and go back to product detail', async function () {

        await ProductDetail.addProductIntoCart(page, 1);
        await page.click(ProductPopup.goBack);
        await page.waitForSelector(ProductDetail.sizesLink);
    });

    test('Go to product listing through belongs to link', async function () {

        const belongToLinks = await page.$$(ProductDetail.belongToLink);
        const hrefAttr
            = await belongToLinks[useful.randInt(0, belongToLinks.length - 1)]
                .getAttribute('href');
        console.log(baseUrl + hrefAttr);
        const res = await useful.request({
            method      : 'GET',
            url         : baseUrl + hrefAttr,
            maxRedirects: 0
        });

        expect(res.status).to.equal(SUCCESS);
    });
});
