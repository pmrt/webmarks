/*
* onReady adds a callback `cb` to be triggered if document is ready. It'll call the callback as `self`
* (optional) with the given `args` (optional).
*
* eg.: onReady(cb); onReady(cb, [param1, param2, param3]);
*/
export function onReady(cb, args, self) {
    if (document.readyState === 'complete') {
        // Call it asynchronously
        setTimeout(() => {
            cb.apply(self, args);
        }, 0);
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

export function injectCSS(styles) {
    const s = document.createElement('style');
    s.type = "text/css";
    s.innerText = styles;
    document.head.appendChild(s);
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

export function pageHeight() {
    let body = document.body,
        html = document.documentElement;
    return Math.max(
        body.scrollHeight, body.offsetHeight, html.clientHeight,
        html.scrollHeight, html.offsetHeight
    );
}

export function debounce(fn, wait, ctx) {
    let timer,
        args;

    function later() {
        fn.apply(ctx, args);
        timer = args = undefined;
    }

	return (...args) => {
        args = args;
        if (timer) {
            clearTimeout(timer);
        }
		timer = setTimeout(later, wait);
	}
}

