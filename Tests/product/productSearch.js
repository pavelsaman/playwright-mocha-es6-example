/* global browser */

import { saveVideo } from 'playwright-video';
import * as env from '../../Helpers/env.js';
import * as options from '../../Helpers/browserOptions.js';
import Fulltext from '../../Objects/fulltext.js';
import FlashMessage from '../../Objects/flashMessage.js';
import ProductListing from '../../Objects/productListing.js';
import useful from 'useful-library';

const config = useful.loadJsonFile('config.json');
const invalidTerms = useful.loadJsonFile('./Resources/invalidSearchTerms.json');
const baseUrl = config.baseUrl[env.envWithLang()];
const SUCCESS = 200;

async function waitForSearchSuggestions (page, searchTerm) {
    await page.waitForResponse(
        response => response.status() === SUCCESS
            && response.url()
                === encodeURI(baseUrl
                    + Fulltext.suggestUrl.replace('{term}', searchTerm))
        ,
        { timeout: config.reqTimeout }
    );
    await page.waitForSelector(Fulltext.searchContainer);
    await page.waitForSelector(Fulltext.showMore);
    await page.waitForSelector(Fulltext.close);
}

/* eslint-disable max-lines-per-function, max-nested-callbacks,
   prefer-arrow-callback */
suite('Product search', function () {

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
        await page.goto(baseUrl, { waitUntil: 'networkidle' });
    });

    teardown(async function () {
        await page.screenshot({
            path: './Results/Screenshots/' + suiteName + '/'
                + testName + '-' + isoDatetime + '.png'
        });
        await page.close();
        await context.close();
    });

    test('Search for product', async function () {

        const searchTerm = 'boty';
        await page.type(Fulltext.input, searchTerm);
        await waitForSearchSuggestions(page, searchTerm);
        await page.click(Fulltext.glass);
        await page.waitForSelector(ProductListing.productItem);
    });

    test('Search for product with national letters', async function () {

        const searchTerm = env.lang() === "cz" ? 'šála' : 'detská ';
        await page.type(Fulltext.input, searchTerm);
        await waitForSearchSuggestions(page, searchTerm);
        await page.click(Fulltext.glass);
        await page.waitForSelector(ProductListing.productItem);
    });

    invalidTerms.forEach((term, i) => {
        test(i + '-search with invalid term', async function () {

            await page.type(Fulltext.input, term);
            await page.click(Fulltext.glass);
            await page.waitForSelector(
                FlashMessage.warning,
                { state: 'attached' }
            );
        });
    });
});
