import { $By, setup } from './selenium';
import './helpers';

let driver, got, want;

window.testOpts = { renderSizes: false };

describe('marks', () => {
    afterEach(async () => {
        // chromedriver process won't close for some reason.
        await driver.close();
        await driver.quit();
    });

    test('create marks', async () => {
        driver = await setup();

        got = await $By.class('webmark');
        want = 5;
        expect(got).toHaveLength(want);
    });

    test('marks have the corresponding top', async () => {
        driver = await setup();
        let errorMargin = 5;

        let marks = await $By.class('webmark');
        for (let i = 0; i < marks.length; i++) {
            got = await marks[i].getCssValue('top');
            want = [14, 150, 261, 378, 485];
            let gotWithoutPx = parseInt(got.slice(0, -2));
            expect(gotWithoutPx).toBeAround(want[i], errorMargin);
        }
    });

    test('marks render sizes', async () => {
        driver = await setup({
            renderSizes: true,
        });

        let marks = await $By.class('webmark');
        for (let i = 0; i < marks.length; i++) {
            got = await marks[i].getCssValue('height');
            want = [26, 8, 8 ,8, 8];
            let gotWithoutPx = parseInt(got.slice(0, -2));
            expect(gotWithoutPx).toBe(want[i]);
        }
    });

    test('don\'t render sizes when renderSizes=false', async () => {
        driver = await setup({
            renderSizes: false,
        });

        let marks = await $By.class('webmark');
        for (let i = 0; i < marks.length; i++) {
            got = await marks[i].getCssValue('height');
            want = [1, 1, 1 ,1, 1];
            let gotWithoutPx = parseInt(got.slice(0, -2));
            expect(gotWithoutPx).toBe(want[i]);
        }
    });

    test('marks are repositioned on resize', async () => {
        driver = await setup();
        let errorMargin = 5;

        let marks = await $By.class('webmark');
        for (let i = 0; i < marks.length; i++) {
            got = await marks[i].getCssValue('top');
            want = [14, 150, 261, 378, 485];
            let gotWithoutPx = parseInt(got.slice(0, -2));
            expect(gotWithoutPx).toBeAround(want[i], errorMargin);
        }

        await driver.manage().window().setSize(1280, 600);

        // wait until last top changes after resize event
        await driver.wait(async () => {
            const lastGot = parseInt(got.slice(0, -2));
            let lastMark = marks[marks.length-1];
            got = await lastMark.getCssValue('top');
            let gotWithoutPx = parseInt(got.slice(0, -2));
            return await gotWithoutPx !== lastGot;
        }, 20000);

        for (let i = 0; i < marks.length; i++) {
            got = await marks[i].getCssValue('top');
            want = [10, 118, 206, 299, 383];
            let gotWithoutPx = parseInt(got.slice(0, -2));
            expect(gotWithoutPx).toBeAround(want[i], errorMargin);
        }
    });

    test.each([[false, '0'], [true, '1']])(
        'when alwaysVisible=%s marks opacity is %i',
        async (alwaysVisible, expectedOpacity) => {
            driver = await setup({
                alwaysVisible,
            });

            got = await $By.class('webmarks');
            want = 1;
            expect(got).toHaveLength(want);

            let wrapper = got[0];
            got = await wrapper.getCssValue('opacity');
            want = expectedOpacity;
            expect(got).toBe(want);
        })
});