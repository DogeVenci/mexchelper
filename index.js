import puppeteer from 'puppeteer';
import * as fs from "fs"

const main = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: [
            '--proxy-server=socks5://127.0.0.1:7777',
        ],
    });
    const page = await browser.newPage();
    await page.goto('https://www.mexc.com/zh-CN/login', { 'timeout': 1000 * 60 });
    await page.waitForSelector("#__next > div.login_loginBox__kVwMC > div.login_wrapper__aEuqp > div > div.login_left__f0lLE > div > div > div:nth-child(2)", { timeout: 999999 })
    const data = await page.evaluate(() => {
        return document.querySelector('#__next > div.login_loginBox__kVwMC > div.login_wrapper__aEuqp > div > div.qrcode-login_wrapper__agi1J.qrcode-login_component_qr_code__cVz9c > div.qrcode-login_qrcodeWrapper__sOsyE > div > canvas').toDataURL();
    });
    if (data) {
        const imgData = data.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = Buffer.from(imgData, 'base64');
        fs.writeFileSync("image.png", dataBuffer)
        console.log("二维码保存成功 扫码登录", "image.png")
    }
    await page.waitForSelector("#globalNav > div.header_rightWrapper__2CIJ_ > div:nth-child(3) > div > div > a > span", { timeout: 999999 })
    await page.click("#globalNav > div.header_rightWrapper__2CIJ_ > div:nth-child(3) > div > div > a > span")
    await page.click("#globalNav > div.header_rightWrapper__2CIJ_ > div:nth-child(3) > div > div > div > div > section > ul > li:nth-child(5) > a")
}

main()