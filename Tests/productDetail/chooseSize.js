import { chromium } from 'playwright';
import { saveVideo } from 'playwright-video';
import chai from 'chai';
import config from '../../config';
import * as env from '../../Helpers/env';
import * as options from '../../Helpers/browserOptions';
import randInt from '../../Helpers/randInt';
import ProductDetail from '../../Objects/productDetail';
import ProductPopup from '../../Objects/productPopup';
import SizesPopup from '../../Objects/sizesPopup';

const expect = chai.expect;
const baseUrl = config.baseUrl[env.envWithLang()];
const productUrl = "damska-mikina-cussa/lswp203828";

suite('Product detail', function () {

    const suiteName = this.title.replace(/ /g, '_');
    let browser, context, page, isoDatetime;

    suiteSetup(async function () {
        isoDatetime = new Date().toISOString();
        browser = await chromium.launch(options.browserConfig());        
    });

    suiteTeardown(async function () {
        await browser.close();
    });

    setup(async function () {
        const testName = this.currentTest.title.replace(/ /g, '_');

        context = await browser.newContext(options.contextConfig());
        page = await context.newPage();    
        if (config.recordVideo) {
            await saveVideo(
                page,
                `./Results/Videos/${isoDatetime}/${suiteName}/${testName}.mp4`
            );
        }    
        await page.goto(baseUrl + productUrl, { waitUntil: 'networkidle' });
    });

    teardown(async function () {        
        await page.close();
        await context.close();
    });
    
    test('Choose different product size', async function () {

        const sizes = await page.$$(ProductDetail.sizes);
        let selected = await ProductDetail.selectedSize(page);

        // choose different product size
        let newSelected = randInt(0, sizes.length - 1);
        if (sizes.length > 1) {
            while (selected === newSelected)
                newSelected = randInt(0, sizes.length - 1); 
        }
               
        // click on different product size
        await sizes[newSelected].click();
        await page.waitForFunction(
            (args) => {
                const sizes = document.querySelectorAll(args.selector);
                if (sizes[args.index].getAttribute('class').includes('active'))
                    return true;
                return false;
            },
            {
                selector: ProductDetail.sizes,
                index: newSelected
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
});