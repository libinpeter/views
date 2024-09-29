const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Apply stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

(async () => {
    let browser;

    try {
        // Launch the browser with stealth mode and proxy settings
        browser = await puppeteer.launch({
            headless: true, // Set to true for headless mode
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        // Set a custom User-Agent and a random viewport size to avoid detection
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36');

        await page.setViewport({
            width: Math.floor(Math.random() * (1920 - 1200 + 1)) + 1200,
            height: Math.floor(Math.random() * (1080 - 700 + 1)) + 700,
            deviceScaleFactor: 1,
        });

        // Go to httpbin.org to check IP address
        await page.goto('https://httpbin.org/ip', { waitUntil: 'networkidle2' });
        const ipInfo = await page.evaluate(() => JSON.parse(document.body.innerText));
        console.log(`IP Address: ${ipInfo.origin}`);

        // Navigate to the target page
        await page.goto('https://www.instafollowers.co/get-free-instagram-likes', { waitUntil: 'networkidle2' });
        // Take a screenshot after interaction
        await page.screenshot({ path: 'github_actions_screenshot1.png', fullPage: true });
        console.log('Page interaction completed.');

        // Simulate user scrolling and random delay
        await simulateUserScroll(page);
        await randomDelay(3000, 5000);

        // Simulate mouse movement and hover on the input field
        await simulateMouseMove(page, 100, 100, 400, 300); // Move from point A to point B
        await page.hover('#user');

        // Wait for the input field and type the Instagram URL
        await page.waitForSelector('#user');
        const instagramUrl = 'https://www.instagram.com/p/DATjCtVR91Z/';
        await page.type('#user', instagramUrl);
        await randomDelay(2000, 4000);

        // Wait for the 'Get Free Likes' button and click it
        await page.waitForSelector('.FreePostSubmitCapthcaButton');
        await page.hover('.FreePostSubmitCapthcaButton');
        await randomDelay(1000, 2000);
        await page.click('.FreePostSubmitCapthcaButton');
        await randomDelay(70000, 75000); // Wait 60-70 seconds to mimic natural delay

        // Handle CAPTCHA if it appears
        await handleCaptcha(page);
        await randomDelay(10000, 15000); // Random delay before closing

        // Take a screenshot after interaction
        await page.screenshot({ path: 'github_actions_screenshot2.png', fullPage: true });
        console.log('Page interaction completed.');

    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
})();

// Utility function to introduce random delay
const randomDelay = (min, max) => new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));

// Function to simulate user scroll
async function simulateUserScroll(page) {
    for (let i = 0; i < 5; i++) {
        await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight / 2);
        });
        await randomDelay(1000, 2000);
    }
}

// Function to simulate mouse movements between two points
async function simulateMouseMove(page, startX, startY, endX, endY) {
    const steps = 30; // Define how smooth the movement is
    for (let i = 0; i < steps; i++) {
        const x = startX + ((endX - startX) * i) / steps;
        const y = startY + ((endY - startY) * i) / steps;
        await page.mouse.move(x, y);
        await randomDelay(10, 30); // Tiny delay between each step
    }
}

// Function to handle CAPTCHA solving
async function handleCaptcha(page) {
    try {
        // Find the reCAPTCHA frame
        const recaptchaFrame = await page.frames().find(frame => frame.url().includes('recaptcha'));

        if (recaptchaFrame) {
            await recaptchaFrame.waitForSelector('.recaptcha-checkbox', { visible: true });
            await recaptchaFrame.click('.recaptcha-checkbox');
            console.log("Clicked CAPTCHA checkbox");
        } else {
            console.log("No CAPTCHA frame found");
        }
    } catch (error) {
        console.error("Error handling CAPTCHA:", error);
    }
}
