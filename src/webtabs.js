export class Webtabs {
    constructor(opts) {
        this._opts = opts;
        onReady(this._init, this);
    }

    _init() {
        console.log('Webtabs initialized with: ' + JSON.stringify(this._opts))
    }
}

/*
* onReady adds a callback `cb` to be triggered if document is ready
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

// expose Webtabs.js
window.Webtabs = Webtabs;
