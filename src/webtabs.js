import { onReady, each, isObject, isHTMLElement, injectCSS } from './helpers';
import { getTabsTops } from './tabs';

const defaultCfg = {

}


const styles =
'.webtabs{position:fixed;top:0;right:0;bottom:0;}' +
'.webtab{position:absolute;background:#8667ff;right:0;}';

export class Webtabs {
    constructor(tabsOpts) {
        injectCSS(styles);
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
        // perform the top calculations
        const tops = getTabsTops(this._elems);

        const wrapper = document.createElement('div');
        wrapper.classList.add('webtabs');
        document.body.insertBefore(wrapper, document.body.firstChild);

        // TODO - remove tabOpts and add a hook to this loop
        each(tops, (i, tabTop) => {
            let opts = this._getTabOpts(i);
            const tab = document.createElement('div');
            tab.classList.add('webtab');
            wrapper.appendChild(tab);
            tab.style.top = tabTop + 'px';
        });
    }
}

// expose Webtabs.js
window.Webtabs = Webtabs;
