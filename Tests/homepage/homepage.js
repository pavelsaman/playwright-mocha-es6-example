import { chromium } from 'playwright';
import { saveVideo } from 'playwright-video';
import chai from 'chai';
import config from '../../config';
import * as env from '../../Helpers/env';
import * as options from '../../Helpers/browserOptions';
import Newsletter from '../../Objects/newsletter';
import emails from '../../Resources/clientEmails.json';
import getCookie from '../../Helpers/cookie';
import CookieStripe from '../../Objects/cookieStripe';

const expect = chai.expect;
const baseUrl = config.baseUrl[env.envWithLang()];

suite('Homepage', function () {

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
        await saveVideo(
            page,
            `./Results/Videos/${isoDatetime}/${suiteName}/${testName}.mp4`
        );
        await page.goto(baseUrl);
    });

    teardown(async function () {        
        await page.close();
        await context.close();
    });

    test('Correct email addresses', async function () {

        const emailElements 
            = await page.$$('[href="mailto:' + emails[env.lang()] + '"]');
        expect(emailElements.length).to.equal(2);
    });

    test('Cookie is saved after confirmation', async function () {

        let cookies = await context.cookies();
        expect(
            getCookie(
                cookies,
                { 
                    searchFor: 'name', 
                    searchValue: 'cookieAllowed' 
                }
            )
        ).to.be.false;

        await page.click(CookieStripe.confirm);
        cookies = await context.cookies();
        expect(
            getCookie(
                cookies,
                { 
                    searchFor: 'name', 
                    searchValue: 'cookieAllowed' 
                }
            )
        ).to.be.true;
    });

    test('Tiles contain valid links', async function () {

    });

    test('Sign up for newsletter', async function () {

    });

    test('Newsletter email field is required', async function () {

        const emailIsRequired = await page.$eval(
            Newsletter.email,
            e => e.hasAttribute("required")
        );
        expect(emailIsRequired).to.be.true;        
    });

    test('Newsletter contains valid link for more information', async function () {

    });
});