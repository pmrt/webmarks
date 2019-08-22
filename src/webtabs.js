export class Webtabs {
    constructor(opts) {
        this.opts = opts;
        onReady(this._init, this);
    }

    _init() {
        const elems = getElems(this.opts.el);
        // TODO - 2. e2e test this
        createTabs(elems);
    }
}

export function createTabs(elems) {
    const tops = getTabsTops(elems);
    // TODO - 1. create tabs with the given tops
}

// cache elements fixed tops for future use as they will never change. Whenever the visible window
// changes, new tabs tops need to be updated. Caching this will avoid recalculating the fixed elems
// tops in an update.
export let elemTops = new Array();
/*
* getTabsTops determines the `elems` elements fixed tops, caching the result for future use (eg. resizing
* will need tabs tops to be recalculated for the new visible window height but element tops is always the
* same), then in the same iteration it'll interpolate each element top between the fixed page height and
* the visible window height, returning anarray with all the corresponding tabs tops for the current visible
* window height.
**/
export function getTabsTops(elems) {
    let tops = new Array(elems.length);
    // peek the first element to check if cache is available
    let loopfn = elemTops[0] === undefined
        ? function uncached(i, el) {
            let elemTop = elemTops[i] = window.scrollY + el.getBoundingClientRect().top;
            tops[i] = intrpElemTop(elemTop);
        }
        : function cached(i) {
            tops[i] = intrpElemTop(elemTops[i]);
        }
    each(elems, loopfn);
    return tops;
}

export function intrpElemTop(elemTop) {
    return intrp([0, document.body.clientHeight], [0, window.innerHeight], elemTop);
}

/*
* intrp interpolates a provided value `v` given two arrays with the following format: [min, max]
*
* e.g.: intrp([0, 10], [0, 100], 1) => 10
*   intrp([0, 1280], [0, 480], 640)  => 220
*/
export function intrp(range, newRange, v) {
    const [ x, y ] = range;
    const [ x2, y2 ] = newRange;
    return ((v - x) * (y2 - x2) / (y - x)) + x2
}

export function getElems(selector) {
    return document.getElementsByClassName(selector);
}

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

export function each(arr, cb) {
    for (let i = 0; i < arr.length; i++) {
        cb(i, arr[i], arr);
    }
}

// expose Webtabs.js
window.Webtabs = Webtabs;
