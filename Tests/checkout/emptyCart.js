import { saveVideo } from 'playwright-video';
import chai from 'chai';
import config from '../../config';
import * as env from '../../Helpers/env';
import * as options from '../../Helpers/browserOptions';
import Header from '../../Objects/header';
import Cart from '../../Objects/cart';

const expect = chai.expect;
const baseUrl = config.baseUrl[env.envWithLang()];

suite('Empty cart', function () {

    const suiteName = this.title.replace(/ /g, '_');
    let context, page, isoDatetime, testName;

    suiteSetup(async function () {
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
        await page.goto(baseUrl, { waitUntil: 'networkidle' });
    });

    teardown(async function () {    
        await page.screenshot({
            path: `./Results/Screenshots/${suiteName}/${testName}-${isoDatetime}.png`
        });    
        await page.close();
        await context.close();
    });

    test('Go to empty cart', async function () {

        await page.click(Header.cart);
        await page.waitForSelector(Cart.steps.one.warning);
        await page.waitForSelector(Cart.steps.one.goShopping);
    });

    test('Go shopping from empty cart', async function () {

        await page.click(Header.cart);
        await page.click(Cart.steps.one.goShopping);
        const currentUrl = await page.url();

        expect(currentUrl).to.equal(baseUrl);
    });
});