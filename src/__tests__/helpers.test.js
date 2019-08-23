import {
    isObject,
    isHTMLElement,
    onReady,
} from '../helpers';
import {
    expectAll
} from '../../test/helpers';

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