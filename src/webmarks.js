import { onReady, each, isHTMLElement, injectCSS, debounce } from './helpers';
import { getMarksTops } from './marks';

const noop = () => {};

const defaultOpts = {
    alwaysVisible: false,
    hideAfter: 500,
    onNewMark: noop,
}

const rememberingScroll = window.scrollY != 0;

const styles =
'.webmarks{position:fixed;top:0;right:0;bottom:0;transition: opacity 100ms;}' +
'.webmark{position:absolute;background:#8667ff;right:0;}';

export class Webmarks {
    constructor(elems, opts) {
        try {
            this._setup(elems, opts);
        } catch(err) {
            console.error(err);
        }

        this._onScroll = this._onScroll.bind(this);
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

    show() {
        this.wrapper.style.opacity = '1';
        this.visible = true;
    }

    _hide() {
        this.wrapper.style.opacity = '0';
        this.visible = false;
    }

    // TODO - 2. e2e test this
    createMarks() {
        // perform the top calculations
        const tops = getMarksTops(this.elems);

        const wrapper = this.wrapper = document.createElement('div');
        wrapper.classList.add('webmarks');
        document.body.insertBefore(wrapper, document.body.firstChild);

        if (!this.opts.alwaysVisible) {
            // If an user refreshes the page and the browser remembers the scroll it'll trigger the
            // '_onScroll' method, resulting in a weird behaviour where marks will be visible until
            // the user scrolls the page again. Therefore, we detect if browser is remembering scroll
            // and if it does, we'll make it visible and hide it (similar behaviour as the scrollbar
            // in most OS')
            if (rememberingScroll) {
                this.visible = true;
            } else {
                wrapper.style.opacity = '0';
                this.visible = false;
            }
            this.hideAfterScroll = debounce(this._hide, this.opts.hideAfter, this);

            document.addEventListener('scroll', () => {
                window.requestAnimationFrame(this._onScroll);
            });
        }

        each(tops, (i, markTop) => {
            const mark = document.createElement('div');
            mark.classList.add('webmark');
            mark.style.top = markTop + 'px';
            wrapper.appendChild(mark);

            this.opts.onNewMark(mark, wrapper);
        });
    }

    _onScroll() {
        if (this.visible) {
            this.hideAfterScroll();
        } else {
            this.show();
        }
    }
}

// expose Webmarks.js
window.Webmarks = Webmarks;
