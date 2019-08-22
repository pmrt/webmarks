import { onReady } from '../src/webtabs';

describe('callbacks are triggered with onReady', () => {
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

        // readyState getter reset
        Object.defineProperty(document, "readyState", {
          get() { return "complete"; },
          configurable: true,
        });

    });
});