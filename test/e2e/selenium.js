import * as path from 'path';
import {
    until,
    Builder,
    By,
    Key
} from 'selenium-webdriver';
import 'chromedriver';
import 'selenium-webdriver/chrome';
import 'selenium-webdriver/firefox';

const publicPath = path.join(__dirname, '../');
const filePath = 'file://' + path.join(publicPath, '/dist/index.html#e2e-test');
const timeout = 20000;

let driver;

export async function setup(obj) {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().setPosition(0, 0);
    await driver.manage().window().setSize(1280, 1024);
    await driver.get(filePath);

    if (obj) {
        await driver.executeScript(`window.__testOpts = ${JSON.stringify(obj)}`);
    }
    await driver.executeScript('window.init(window.__testOpts)');

    return driver;
}

export class $By {
    static async _el(locator) {
        return await driver.wait(until.elementsLocated(locator), timeout);
    }

    static async id(id) {
        return await $By._el(By.id(id));
    }

    static async class(name) {
        return await $By._el(By.className(name));
    }
}