const defaultCfg = {

}

export class Webtabs {
    constructor(tabsOpts) {
        try {
            this.setupOpts(tabsOpts);
        } catch(err) {
            console.error(err);
        }
        onReady(this.createTabs, this);
    }

    /*
    * setupOpts setups _getTabOpts and _elems for future use based on the first element of tabsOpts
    *
    * _elems contains all the HTMLElements which the tabs will mark. _elems can be a HTMLCollection.
    *
    * _getTabsOpts(i) is a dynamic function which will retrieve the options for the element with index `i`.
    * The function will be setup so that it'll return the default config for all the elements (if no custom
    * config is provided) or the provided custom options for the corresponding index.
    */
    setupOpts(tabsOpts) {
        this._tabsOpts = tabsOpts;

        let peek = tabsOpts[0];
        if (isHTMLElement(peek)) {
            this._getTabOpts = () => defaultCfg;
            this._elems = tabsOpts;
        } else if (isObject(peek)) {
            this._getTabOpts = (i) => this._tabsOpts[i];
            this._elems = tabsOpts.map(opts => opts.el);
        } else {
            throw new TypeError(JSON.stringify(peek) + " is neither an object nor an HTMLElement");
        }
    }

    // TODO - 2. e2e test this
    createTabs() {
        // TODO - 1. create tabs with the given tops
        const tops = getTabsTops(this._elems);
        each(tops, (i, tabTop) => {
            let opts = this._getTabOpts(i);
        });
    }
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

// expose Webtabs.js
window.Webtabs = Webtabs;
