import { chromium } from 'playwright';
import * as options from '../Helpers/browserOptions';

suiteSetup(async function () {
    global.browser = await chromium.launch(options.browserConfig());
});

suiteTeardown(async function () {
    await browser.close();
});