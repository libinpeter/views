const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Apply stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

(async () => {
    let browser;

    try {
        // Launch the browser in headless mode (can switch to false for debugging)
        browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-US,en;q=0.9',
        });
        await page.setViewport({ width: 1280, height: 800 });

        // Check and log IP using httpbin.org
        await page.goto('https://httpbin.org/ip', { waitUntil: 'networkidle2' });
        const ipInfo = await page.evaluate(() => JSON.parse(document.body.innerText));
        console.log(`IP Address: ${ipInfo.origin}`);

        // Navigate to the target page
        await page.goto('https://www.instafollowers.co/get-free-instagram-likes', { waitUntil: 'networkidle2' });
        await page.screenshot({ path: 'github_actions_screenshot.png', fullPage: true });

        // Wait for the input field with ID 'user' to be visible
        await page.waitForSelector('#user');
        const instagramUrl = 'https://www.instagram.com/p/DAPr2WwsGcy/';
        await page.type('#user', instagramUrl);

        // Wait for the 'Get Free Likes' button to appear and click it
        await page.waitForSelector('.FreePostSubmitCapthcaButton');
        await page.click('.FreePostSubmitCapthcaButton');
        await delay(60000);

        // Handle CAPTCHA if it appears
        await handleCaptcha(page);

    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        // Ensure the browser is closed to free up resources
        if (browser) {
            await browser.close();
        }
    }
})();

// Utility function to introduce delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to handle CAPTCHA solving
async function handleCaptcha(page) {
    try {
        // Look for the frame containing the CAPTCHA
        const recaptchaFrame = await page.frames().find(frame => frame.url().includes('recaptcha'));

        if (recaptchaFrame) {
            // Wait for the checkbox element within the CAPTCHA frame and click it
            const checkbox = await recaptchaFrame.$('.recaptcha-checkbox');
            if (checkbox) {
                await checkbox.click();
                console.log("Clicked CAPTCHA checkbox");
            } else {
                console.log("CAPTCHA checkbox not found");
            }
        } else {
            console.log("No CAPTCHA frame found");
        }
    } catch (error) {
        console.error("Error handling CAPTCHA:", error);
    }
}
