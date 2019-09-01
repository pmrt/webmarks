import { onReady, each, isHTMLElement, injectCSS, debounce } from './helpers';
import { getMarksRects } from './marks';

const noop = () => {};

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

const rememberingScroll = window.scrollY != 0;
const resizeWait = 500;
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

    hide() {
        this.wrapper.style.opacity = '0';
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
