import { onReady, each, isHTMLElement, injectCSS, debounce } from './helpers';
import { getMarksRects } from './marks';

// noop is an empty function. All hooks will default to it
const noop = () => {};
// isRememberingScroll figures out if the browser is remembering the last scrol position
const isRememberingScroll = window.scrollY != 0;
// resizeWait defines the debouncing wait time (ms) to be applied on window resize
const resizeWait = 500;
const styles =
'.webmarks{position:fixed;top:0;right:0;bottom:0;transition: opacity 100ms;}' +
'.webmark{position:absolute;background:#8667ff;right:0;}';

const defaultOpts = {
    // classes contains the class names which will be used to create the marks
    classes: {
        wrapper: 'webmarks',
        mark: 'webmark',
    },
    // alwaysVisible determines whether the marks will be visible or not when
    // user is not scrolling
    // true – marks will be always visible
    // false - marks will hide after user stops scrolling
    alwaysVisible: false,
    // hideAfter defines a wait time (ms) rigth after user stops scrolling, after which the
    // marks will hide. The time will be reset as user keeps scrolling (debouncing)
    hideAfter: 500,
    // renderSizes determines whether the marks will be drawn with the corresponding scaled height of
    // each element or not. Set it to 'true' if you want to represent the height of your elements along
    // the scrollbar
    renderSizes: false,
    // onNewMark hook will be invoked right after each mark creation
    // onNewMark(mark, wrapper) will take two args:
    // - `mark` is the HTMLElement of the mark which has been created
    // - `wrapper` is the immediate parent element of all the  marks
    onNewMark: noop,
    // onUpdateMark hook will be invoked right after each mark position update
    // - `mark` is the HTMLElement of the mark which has been updated
    // - `wrapper` is the immediate parent element of all the  marks
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

    /*
    * _setup handles the Webmarks setup merging, setting and saving the elements and options,ready to be used.
    *
    * If `alwaysVisible` is set to `true` it'll hide (or show and hide if browser is remembering the scroll
    * position) the marks, setting up a function to be invoked on scroll which will show/hide the marks. Also,
    * it will setup a debounced function to update the marks position on window resize
    */
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

    /*
    * show makes the webmarks' wrapper visible. Transition animation will have effects on this function
    */
    show() {
        this.visible = true;
    }

    /*
    * hide makes the webmarks' wrapper invisible. Transition animation will have effects on this function
    */
    hide() {
        this.visible = false;
    }

    /*
    * createMarks handles the marks wrapper/each mark creation.
    */
    // TODO - 2. e2e test this
    createMarks() {
        // perform the top calculations
        const rects = getMarksRects(this.elems);

        const wrapper = this.wrapper = document.createElement('div');
        wrapper.classList.add(this.opts.classes.wrapper);
        document.body.insertBefore(wrapper, document.body.firstChild);

        // TODO - move this to _setup
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

    /*
    * updateMarks handles the mark repositioning
    */
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
