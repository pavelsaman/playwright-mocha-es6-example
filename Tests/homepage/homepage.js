import { chromium } from 'playwright';
import chai from 'chai';
import config from '../../config';
import * as env from '../../Helpers/env';
import * as options from '../../Helpers/browserOptions';

const expect = chai.expect;
const baseUrl = config.baseUrl[env.envWithLang()];

suite('Homepage', () => {

    let browser, context, page;

    suiteSetup(async () => {
        browser = await chromium.launch(options.browserConfig());
    });

    suiteTeardown(async () => {
        await browser.close();
    });

    setup(async () => {
        context = await browser.newContext(options.contextConfig());
        page = await context.newPage();
        await page.goto(baseUrl);
    });

    teardown(async () => {

    });

    test('Correct email addresses', async () => {

    });

    test('Cookie is saved after confirmation', async () => {

    });

    test('Tiles contain valid links', async () => {

    });

    test('Sign up for newsletter', async () => {

        
    });

    test('Newsletter email field is required', async () => {

    });

    test('Newsletter contains valid link for more information', async () => {

    });
});