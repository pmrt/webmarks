import {
    getTabsTops,
    elemTops,
} from '../tabs';

describe('calculate tabs tops', () => {
    beforeAll(() => {
        document.head.innerHTML =
            '<style>' +
                '* { margin: 0; }' +
                '.test { position: relative; }' +
            '</style>';
        document.body.innerHTML =
            '<div id="first" class="test"></div>' +
            '<div id="second" class="test"></div>' +
            '<div id="third" class="test"></div>';
        window.innerHeight = 100;
        window.scrollY = 0;
        Object.defineProperty(document.body, "clientHeight", {
        get() { return 1000; },
        configurable: true,
        });
        document.getElementById('first').getBoundingClientRect = () => {
            return { top: 10 }
        };
        document.getElementById('second').getBoundingClientRect = () => {
            return { top: 20 }
        };
        document.getElementById('third').getBoundingClientRect = () => {
            return { top: 30 }
        };
    });

    afterAll(() => {
        // Clear globals and reset
        document.head.innerHTML =
        document.body.innerHTML = '';
        window.innerHeight = 0;
        Object.defineProperty(document.body, "clientHeight", {
          get() { return 0; },
          configurable: true,
        });
        elemTops[0] = undefined;
        elemTops[1] = undefined;
        elemTops[2] = undefined;
    });

    test('get tabs tops = [1, 2, 3] and cache the element tops', () => {
        const elems = document.getElementsByClassName('test');
        // cache should be empty
        expect(elemTops).toEqual([]);
        const got = getTabsTops(elems);
        const want = [1, 2, 3];
        expect(got).toEqual(want);
        // cache shouldn't be empty
        expect(elemTops).toEqual([10,20,30]);
    });

    test('getTabsProps uses cache', () => {
        const elems = document.getElementsByClassName('test');
        expect(elemTops).toEqual([10,20,30]);
        // override cache
        elemTops[2] = 50;
        const got = getTabsTops(elems)
        const want = [1, 2, 5];
        expect(got).toEqual(want);
    });
});