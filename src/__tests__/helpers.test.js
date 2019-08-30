import {
    isObject,
    isHTMLElement,
    onReady,
    debounce,
} from '../helpers';
import {
    expectAll
} from '../../test/helpers';

jest.useFakeTimers();

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
        expect(cb).not.toHaveBeenCalled();
        jest.runAllTimers();
        expect(cb).toHaveBeenCalled();
    });

    test('callback is triggered and listener is removed if document is not ready', () => {
        const cb = jest.fn();
        Object.defineProperty(document, "readyState", {
          get() { return "loading"; },
          configurable: true,
        });
        onReady(cb);
        
        expect(cb).not.toHaveBeenCalled();
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

describe ('debounces a function', () => {

    test('cancels consecutive calls, executing only one after \'wait\'', () => {
        const fn = jest.fn();
        const debounced = debounce(fn, 1000);

        debounced();
        expect(fn).not.toHaveBeenCalled();
        for (let i = 0; i < 5; i++) {
            debounced();
            jest.advanceTimersByTime(100);
            expect(fn).not.toHaveBeenCalled();
        }

        jest.advanceTimersByTime(1000);
        expect(fn).toHaveBeenCalledTimes(1);
    });
});