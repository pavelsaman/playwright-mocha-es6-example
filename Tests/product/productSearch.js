import { chromium } from 'playwright';
import { saveVideo } from 'playwright-video';
import chai from 'chai';
import config from '../../config';
import * as env from '../../Helpers/env';
import * as options from '../../Helpers/browserOptions';
import invalidTerms from '../../Resources/invalidSearchTerms.json';
import Fulltext from '../../Objects/fulltext';
import FlashMessage from '../../Objects/flashMessage';
import ProductListing from '../../Objects/productListing';

const expect = chai.expect;
const baseUrl = config.baseUrl[env.envWithLang()];

async function waitForSearchSuggestions (page, searchTerm) {   
    await page.waitForResponse(
        response => response.status() === 200
            && response.url()
                === encodeURI(baseUrl
                    + Fulltext.suggestUrl.replace('{term}', searchTerm))
        ,
        {
            timeout: config.reqTimeout
        }
    ); 
    await page.waitForSelector(Fulltext.searchContainer);
    await page.waitForSelector(Fulltext.showMore);
    await page.waitForSelector(Fulltext.close);
}

suite('Product search', function () {

    const suiteName = this.title.replace(/ /g, '_');
    let browser, context, page, isoDatetime, testName;

    suiteSetup(async function () {
        isoDatetime = new Date().toISOString();
        browser = await chromium.launch(options.browserConfig());        
    });

    suiteTeardown(async function () {
        await browser.close();
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
    
    test('Search for product', async function () {
        
        let searchTerm = 'boty';
        await page.type(Fulltext.input, searchTerm);
        await waitForSearchSuggestions(page, searchTerm);
        await page.click(Fulltext.glass);
        await page.waitForSelector(ProductListing.productItem);
    });

    test('Search for product with national letters', async function () {

        let searchTerm = (env.lang() === "cz") ? 'šála' : 'detská ';
        await page.type(Fulltext.input, searchTerm);
        await waitForSearchSuggestions(page, searchTerm);
        await page.click(Fulltext.glass);
        await page.waitForSelector(ProductListing.productItem);
    });

    invalidTerms.forEach(term => {
        test('Search with invalid term: ' + term, async function () {
        
            await page.type(Fulltext.input, term);
            await page.click(Fulltext.glass);
            await page.waitForSelector(
                FlashMessage.warning,
                { state: 'attached' }
            );
        });
    });
});