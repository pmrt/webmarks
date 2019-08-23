import { onReady, each, isObject, isHTMLElement, injectCSS } from './helpers';
import { getMarksTops } from './marks';

const noop = () => {};

const defaultOpts = {
    alwaysVisible: false,
    onNewMark: noop,
}


const styles =
'.webmarks{position:fixed;top:0;right:0;bottom:0;}' +
'.webmark{position:absolute;background:#8667ff;right:0;}';

export class Webmarks {
    constructor(elems, opts) {
        try {
            this._setup(elems, opts);
        } catch(err) {
            console.error(err);
        }

        onReady(this.createMarks, this);
    }

    _setup(elems, opts) {
        if (!elems) {
            throw new TypeError("Elements array can't be empty");
        }

        let peek = elems[0];
        if (!isHTMLElement(peek)) {
            throw new TypeError(JSON.stringify(peek) + " is not an HTMLElement");
        }

        injectCSS(styles);
        this.elems = elems;
        this.opts = {...defaultOpts, ...opts};
    }

    // TODO - 2. e2e test this
    createMarks() {
        // perform the top calculations
        const tops = getMarksTops(this.elems);

        const wrapper = document.createElement('div');
        wrapper.classList.add('webmarks');
        document.body.insertBefore(wrapper, document.body.firstChild);

        each(tops, (i, markTop) => {
            const mark = document.createElement('div');
            mark.classList.add('webmark');
            mark.style.top = markTop + 'px';
            wrapper.appendChild(mark);

            this.opts.onNewMark(mark, wrapper);
        });
    }
}

// expose Webmarks.js
window.Webmarks = Webmarks;
