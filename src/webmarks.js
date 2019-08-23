import { onReady, each, isObject, isHTMLElement, injectCSS } from './helpers';
import { getMarksTops } from './marks';

const defaultCfg = {

}


const styles =
'.webmarks{position:fixed;top:0;right:0;bottom:0;}' +
'.webmark{position:absolute;background:#8667ff;right:0;}';

export class Webmarks {
    constructor(marksOpts) {
        injectCSS(styles);
        try {
            this.setupOpts(marksOpts);
        } catch(err) {
            console.error(err);
        }
        onReady(this.createMarks, this);
    }

    /*
    * setupOpts setups _getMarkOpts and _elems for future use based on the first element of marksOpts
    *
    * _elems contains all the HTMLElements which the marks will highlight. _elems can be a HTMLCollection.
    *
    * _getMarksOpts(i) is a dynamic function which will retrieve the options for the element with index `i`.
    * The function will be setup so that it'll return the default config for all the elements (if no custom
    * config is provided) or the provided custom options for the corresponding index.
    */
    setupOpts(marksOpts) {
        this._marksOpts = marksOpts;

        let peek = marksOpts[0];
        if (isHTMLElement(peek)) {
            this._getMarkOpts = () => defaultCfg;
            this._elems = marksOpts;
        } else if (isObject(peek)) {
            this._getMarkOpts = (i) => this._marksOpts[i];
            this._elems = marksOpts.map(opts => opts.el);
        } else {
            throw new TypeError(JSON.stringify(peek) + " is neither an object nor an HTMLElement");
        }
    }

    // TODO - 2. e2e test this
    createMarks() {
        // perform the top calculations
        const tops = getMarksTops(this._elems);

        const wrapper = document.createElement('div');
        wrapper.classList.add('webmarks');
        document.body.insertBefore(wrapper, document.body.firstChild);

        // TODO - remove markOpts and add a hook to this loop
        each(tops, (i, markTop) => {
            let opts = this._getMarkOpts(i);
            const mark = document.createElement('div');
            mark.classList.add('webmark');
            wrapper.appendChild(mark);
            mark.style.top = markTop + 'px';
        });
    }
}

// expose Webmarks.js
window.Webmarks = Webmarks;
