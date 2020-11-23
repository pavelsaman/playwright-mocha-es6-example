import { devices } from 'playwright';
import { saveVideo } from 'playwright-video';
import config from '../../config';
import * as env from '../../Helpers/env';
import Header from '../../Objects/header';
import Menu from '../../Objects/menu';
import Fulltext from '../../Objects/fulltext';
import testedTablets from '../../Resources/testedTablets.json';

const baseUrl = config.baseUrl[env.envWithLang()];

testedTablets.mobileMenu.forEach(device => {
    suite(device + ' homepage view', function () {

        const suiteName = this.title.replace(/ /g, '_');
        let context, page, isoDatetime, testName;

        suiteSetup(async function () {
            isoDatetime = new Date().toISOString().replace(/:/g, '-');    
        });

        setup(async function () {
            testName = this.currentTest.title.replace(/ /g, '_');

            const iPad = devices[device];
            context = await browser.newContext({ ...iPad });
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

        test('Hamburger menu is visible', async function () {
        
            await page.waitForFunction(
                selector => {
                    let hamburger = document.querySelector(selector);
                    return window.getComputedStyle(hamburger)
                        .getPropertyValue('display') !== "none";
                },
                Header.hamburger
            );            
        });
    
        test('Fulltext magnifying glass is visible', async function () {
        
            await page.waitForFunction(
                selector => {
                    let hamburger = document.querySelector(selector);
                    return window.getComputedStyle(hamburger)
                        .getPropertyValue('display') === "block";
                },
                Header.glass
            );
        });
    
        test('Cart icon is visible', async function () {
        
            await page.waitForFunction(
                selector => document.querySelector(selector),
                Header.cart
            );
        });
    
        test('Open and close menu', async function () {                
            
            await Promise.all([
                page.waitForFunction(
                    selector => {
                        return document.querySelector(selector)
                            .getAttribute("class").includes('active');
                    },
                    Menu.container
                ),
                page.click(Header.hamburger)
            ]);  
            
            await Promise.all([
                page.waitForFunction(
                    selector => {
                        return !document.querySelector(selector)
                            .getAttribute("class").includes('active');
                    },
                    Menu.container
                ),
                page.click(Header.hamburger)
            ]);
        });
    
        test('Open and close mobile search', async function () {                
            
            await Promise.all([
                page.waitForFunction(
                    selector => {
                        return document.querySelector(selector)
                            .getAttribute("class").includes('visible');
                    },
                    Fulltext.mobileSearch
                ),
                page.evaluate(
                    selector => document.querySelector(selector).click(),
                    Header.glass
                )
            ]);            
            
            await Promise.all([
                page.waitForFunction(
                    selector => {
                        return !document.querySelector(selector)
                            .getAttribute("class").includes('visible');
                    },
                    Fulltext.mobileSearch
                ),
                page.evaluate(
                    selector => document.querySelector(selector).click(),
                    Header.glass
                )
            ]);
        });
    });
});

testedTablets.desktopMenu.forEach(device => {
    suite(device + '-homepage view', function () {
    
        const suiteName = this.title.replace(/ /g, '_');
        let context, page, isoDatetime, testName;

        suiteSetup(async function () {
            isoDatetime = new Date().toISOString().replace(/:/g, '-');    
        });

        setup(async function () {
            testName = this.currentTest.title.replace(/ /g, '_');

            const iPad = devices[device];
            context = await browser.newContext({ ...iPad });
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
    
        test('Hamburger menu is not visible', async function () {
        
            await page.waitForFunction(
                selector => {
                    let hamburger = document.querySelector(selector);
                    return window.getComputedStyle(hamburger)
                        .getPropertyValue('display') === "none";
                },
                Header.hamburger
            );
        });
    
        test('Fulltext magnifying glass is not visible', async function () {
        
            await page.waitForFunction(
                selector => {
                    let hamburger = document.querySelector(selector);
                    return window.getComputedStyle(hamburger)
                        .getPropertyValue('display') !== "block";
                },
                Header.glass
            );
        });
    });
});