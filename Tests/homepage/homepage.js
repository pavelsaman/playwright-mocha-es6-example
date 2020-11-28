/* global suite, suiteSetup, setup, teardown, test, browser */

import { saveVideo } from 'playwright-video';
import chai from 'chai';
import config from '../../config';
import * as env from '../../Helpers/env';
import * as options from '../../Helpers/browserOptions';
import Newsletter from '../../Objects/newsletter';
import emails from '../../Resources/clientEmails.json';
import getCookie from '../../Helpers/cookie';
import CookieStripe from '../../Objects/cookieStripe';
import Homepage from '../../Objects/homepage';
import request from '../../Helpers/networkRequest';
import getAllLinks from '../../Helpers/links';
import FlashMessage from '../../Objects/flashMessage';
import personalDataLinks from '../../Resources/personalDataLinks.json';

const expect = chai.expect;
const baseUrl = config.baseUrl[env.envWithLang()];

suite('Homepage', function () {

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

        const tileLinks = await getAllLinks(page, Homepage.tileLinks);

        let i = 1;
        for (let l of tileLinks) {

            console.log('[' + i + '/' + tileLinks.size + '] ' + l);
            i++;

            let res = await request({
                method: 'GET',
                url: (l.includes('http')) ? l : baseUrl + l
            });

            expect(res.status).to.equal(200);
        }
    });

    test('Sign up for newsletter', async function () {

        await page.fill(Newsletter.email, config.testerEmail);
        await page.check(Newsletter.checkbox);
        await Promise.all([
            page.waitForSelector(
                FlashMessage.confirmation,
                { state: 'visible' }
            ),
            page.click(Newsletter.send)
        ]);
    });

    test('Newsletter email field is required', async function () {

        await page.waitForFunction(
            selector => document.querySelector(selector),
            Newsletter.link
        );
        const emailIsRequired = await page.$eval(
            Newsletter.email,
            e => e.hasAttribute("required")
        );
        expect(emailIsRequired).to.be.true;
    });

    test('Newsletter contains valid link for more information',
        async function () {

        await page.waitForFunction(
            selector => document.querySelector(selector),
            Newsletter.link
        );
        const hrefAttr = await page.$eval(
            Newsletter.link,
            el => el.getAttribute('href')
        );

        expect(hrefAttr).to.equal(personalDataLinks[env.lang()]);
    });
});