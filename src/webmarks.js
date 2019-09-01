import { onReady, each, isHTMLElement, injectCSS, debounce } from './helpers';
import { getMarksRects } from './marks';

const noop = () => {};
const isRememberingScroll = window.scrollY != 0;
const resizeWait = 500;
const styles =
'.webmarks{position:fixed;top:0;right:0;bottom:0;transition: opacity 100ms;}' +
'.webmark{position:absolute;background:#8667ff;right:0;}';

const defaultOpts = {
    classes: {
        wrapper: 'webmarks',
        mark: 'webmark',
    },
    alwaysVisible: false,
    hideAfter: 500,
    renderSizes: false,
    onNewMark: noop,
    onUpdateMark: noop,
}


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

    /*
    * visible getter. Returns true if opacity = 1, false if opacity = 0.
    */
    get visible() {
        return !!parseInt(this.wrapper.style.opacity);
    }

    /*
    * visible setter. Takes a `bool` (true or false) and converts it to int (1 or 0).
    */
    set visible(bool) {
        this.wrapper.style.opacity = bool >>> 0;
    }

    _setup(elems, opts) {
        if (!elems) {
            throw new TypeError("Elements array can't be empty");
        }

        let peek = elems[0];
        if (!isHTMLElement(peek)) {
            throw new TypeError(JSON.stringify(peek) + " is not an HTMLElement");
        }

        // TODO - create themes and remove CSS injection. It should be unopinated
        injectCSS(styles);
        this.elems = elems;
        this.opts = {...defaultOpts, ...opts};
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    // TODO - 2. e2e test this
    createMarks() {
        // perform the top calculations
        const rects = getMarksRects(this.elems);

        const wrapper = this.wrapper = document.createElement('div');
        wrapper.classList.add(this.opts.classes.wrapper);
        document.body.insertBefore(wrapper, document.body.firstChild);

        if (!this.opts.alwaysVisible) {
            // If user refreshes the page and the browser remembers the scroll it'll trigger the
            // '_onScroll' method, resulting in a weird behaviour where marks will be visible until
            // the user scrolls the page again. Therefore, we detect if browser is remembering scroll
            // and if it does, we'll make it visible and hide it (similar behaviour as the scrollbar
            // in most OS')
            this.visible = isRememberingScroll;
            this.hideAfterScroll = debounce(this.hide, this.opts.hideAfter, this);
            document.addEventListener('scroll', () => {
                window.requestAnimationFrame(this._onScroll);
            });
        }

        this.updateAfterResize = debounce(this.updateMarks, resizeWait, this);
        window.addEventListener('resize', () => {
            window.requestAnimationFrame(this.updateAfterResize);
        })

        this.marks = new Array(rects.length);
        each(rects, (i, rect) => {
            const mark = this.marks[i] = document.createElement('div');
            mark.classList.add(this.opts.classes.mark);
            mark.style.top = rect.top + 'px';
            if (this.opts.renderSizes) {
                mark.style.height = rect.height + 'px';
            }
            wrapper.appendChild(mark);

            this.opts.onNewMark(mark, wrapper);
        });
    }

    updateMarks() {
        const rects = getMarksRects(this.elems);

        this.hide();

        each(rects, (i, rect) => {
            const mark = this.marks[i];
            mark.style.top = rect.top + 'px';

            this.opts.onUpdateMark(mark, this.wrapper);
        });

        this.show();
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
