/*
* onReady adds a callback `cb` to be triggered if document is ready. It'll call the callback as `self`
* (optional) with the given `args` (optional).
*
* eg.: onReady(cb); onReady(cb, this, param1, param2, param3);
*/
export function onReady(cb, self, ...args) {
    if (document.readyState === 'complete') {
        // Call it asynchronously
        setTimeout(cb, 0);
    } else {
        const fn = function() {
            document.removeEventListener("DOMContentLoaded", fn);
            cb.apply(self, args);
        }
        document.addEventListener("DOMContentLoaded", fn);
    }
}

export function each(arr, cb, self) {
    for (let i = 0; i < arr.length; i++) {
        cb.call(self, i, arr[i], arr);
    }
}

/*
* isObject checks if a given `obj` is an object. Array and functions return 'false' as they have
* length >= 0.
*/
export function isObject(obj) {
    let t = typeof obj;
    return t === 'object' && !!obj && obj.length === undefined;
}

export function isHTMLElement(obj) {
    return obj instanceof Element;
}