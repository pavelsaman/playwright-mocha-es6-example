/* global browser */

import { saveVideo } from 'playwright-video';
import chai from 'chai';
import * as env from '../../Helpers/env.js';
import * as options from '../../Helpers/browserOptions.js';
import Newsletter from '../../Objects/newsletter.js';
import getCookie from '../../Helpers/cookie.js';
import CookieStripe from '../../Objects/cookieStripe.js';
import Homepage from '../../Objects/homepage.js';
import getAllLinks from '../../Helpers/links.js';
import FlashMessage from '../../Objects/flashMessage.js';
import useful from 'useful-library';

const config = useful.loadJsonFile('config.json');
const personalDataLinks
    = useful.loadJsonFile('./Resources/personalDataLinks.json');
const emails
    = useful.loadJsonFile('./Resources/clientEmails.json');
const { expect } = chai;
const baseUrl = config.baseUrl[env.envWithLang()];

/* eslint-disable max-lines-per-function, max-nested-callbacks,
   prefer-arrow-callback */
suite('Homepage', function () {

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
            path: './Results/Screenshots/' + suiteName + '/' + testName + '-'
                + isoDatetime + '.png'
        });
        await page.close();
        await context.close();
    });

    test('Correct email addresses', async function () {

        const emailElements
            = await page.$$('[href="mailto:' + emails[env.lang()] + '"]');
        // eslint-disable-next-line no-magic-numbers
        expect(emailElements.length).to.equal(2);
    });

    test('Cookie is saved after confirmation', async function () {

        let cookies = await context.cookies();
        expect(getCookie(
            cookies,
            {
                searchFor  : 'name',
                searchValue: 'cookieAllowed'
            }
        )).to.be.false;

        await page.click(CookieStripe.confirm);
        cookies = await context.cookies();
        expect(getCookie(
            cookies,
            {
                searchFor  : 'name',
                searchValue: 'cookieAllowed'
            }
        )).to.be.true;
    });

    test('Tiles contain valid links', async function () {

        const tileLinks = await getAllLinks(page, Homepage.tileLinks);

        let i = 1;
        for (const l of tileLinks) {

            console.log('[' + i + '/' + tileLinks.size + '] ' + l);
            i++;

            const res = await useful.request({
                method: 'GET',
                url   : l.includes('http') ? l : baseUrl + l
            });
            // eslint-disable-next-line no-magic-numbers
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

    test('Newsletter contains valid link', async function () {

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
