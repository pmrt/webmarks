import {
    onReady,
    intrp,
    getTabsTops,
    elemTops,
    isObject,
    isHTMLElement,
} from '../src/webtabs';
import { expectAll } from './helpers';

describe('callbacks are triggered with onReady', () => {
    afterAll(() => {
        // readyState getter reset
        Object.defineProperty(document, "readyState", {
            get() { return "complete"; },
            configurable: true,
          });
    });

    test('callback is triggered if document is ready', () => {
        const cb = jest.fn();
        onReady(cb);

        // Testing if it's really asynchronous
        expect(cb).toHaveBeenCalledTimes(0);
        setTimeout(() => {
            expect(cb).toHaveBeenCalled();
        }, 100);
    });

    test('callback is triggered and listener is removed if document is not ready', () => {
        const cb = jest.fn();
        Object.defineProperty(document, "readyState", {
          get() { return "loading"; },
          configurable: true,
        });
        onReady(cb);

        setTimeout(() => {
            expect(cb).toHaveBeenCalledTimes(0);
        }, 100);
        // Dispatch event twice.
        document.dispatchEvent(new Event("DOMContentLoaded"));
        document.dispatchEvent(new Event("DOMContentLoaded"));
        // Listener should be removed after first dispatch, and therefore should be called once.
        expect(cb).toHaveBeenCalledTimes(1);
    });
});

describe('interpolates elements tops between ranges', () => {
    test('intrp interpolates the given value between ranges', () => {
        expectAll({
            dataset: [
                [ [0, 10], [0, 100], 1 ],
                [ [0, 1280], [0, 480], 200],
                [ [1, 50], [0, 100], 50],
                [ [0, 10], [0, 100], 0 ],
                [ [0, 10], [0, 100], 2 ],
            ],
            results: [10, 75, 100, 0, 20],
        }, (set, want) => {
            let got = intrp(...set);
            expect(got).toBe(want);
        })
    });
});

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

describe('isObject checks for objects', () => {
    test('returns false for non-objects and true for objects', () => {
        expectAll({
            dataset: [function(){}, ()=>{}, null, undefined, false, true, {}, {test:1}, [], [1], NaN],
            results: [false, false, false, false, false, false, true, true, false, false, false],
        }, (set, want) => {
            let got = isObject(set);
            expect(got).toStrictEqual(want);
        })
    });
});

describe('isHTMLElement checks for Element objects', () => {
    afterAll(() => {
        document.body.innerHTML = '';
    })

    test('returns false for objects wich doesn\'t implement DOM methods', () => {
        document.body.innerHTML = '<div id="test" class="test"></div>';
        const el = document.getElementById('test');
        const htmlCollection = document.getElementsByClassName('test');

        expectAll({
            dataset: [{}, {a:3}, el, [], htmlCollection, htmlCollection[0]],
            results: [false, false, true, false, false, true],
        }, (set, want) => {
            let got = isHTMLElement(set);
            expect(got).toStrictEqual(want);
        });
    });
});