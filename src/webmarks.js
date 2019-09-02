import { onReady, each, isHTMLElement, injectCSS, debounce } from './helpers';
import { getMarksRects } from './marks';

// noop is an empty function. All hooks will default to it
const noop = () => {};
// isRememberingScroll figures out if the browser is remembering the last scrol position
const isRememberingScroll = window.scrollY != 0;
// resizeWait defines the debouncing wait time (ms) to be applied on window resize
const resizeWait = 500;

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
    // - `wrapper` is the immediate parent element of all marks
    onNewMark: noop,
    // onUpdateMark hook will be invoked right after each mark position update
    // - `mark` is the HTMLElement of the mark which has been updated
    // - `wrapper` is the immediate parent element of all marks
    onUpdateMark: noop,
    // onCreation callback will be invoked right after all marks have been created
    // - `marks` is an array with all the marks which have been created.
    // - `wrapper` is the immediate parent element of all marks
    onCreation: noop,
    // onUpdate callback will be invoked right after all marks have been updated
    // - `marks` is an array with all the marks which have been updated.
    // - `wrapper` is the immediate parent element of all marks
    onUpdate: noop,
    // beforeCreation callback will be invoked right before marks creation
    // - `wrapper` is the immediate parent element of all the future marks
    beforeCreation: noop,
    // beforeUpdate callback will be invoked right before marks update
    // - `wrapper` is the immediate parent element of all the future marks
    beforeUpdate: noop,
}


export class Webmarks {
    constructor(elems, opts) {
        this._onScroll = this._onScroll.bind(this);

        try {
            onReady(this._init, [elems, opts], this);
        } catch(err) {
            console.error(err);
        }
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
    * _init initializes the library
    */
    _init(elems, opts) {
        this._setup(elems, opts)
        this._createMarks();
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

        this.elems = elems;
        this.opts = {...defaultOpts, ...opts};

        this._createWrapper();

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

        this.updateAfterResize = debounce(this._updateMarks, resizeWait, this);
        window.addEventListener('resize', () => {
            window.requestAnimationFrame(this.updateAfterResize);
        })
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

    _createWrapper() {
        const wrapper = this.wrapper = document.createElement('div');
        wrapper.classList.add(this.opts.classes.wrapper);
        document.body.insertBefore(wrapper, document.body.firstChild);
    }

    /*
    * _createMarks handles each mark creation.
    */
    _createMarks() {
        const rects = getMarksRects(this.elems);
        this.marks = new Array(rects.length);

        this.opts.beforeCreation(this.wrapper);

        each(rects, (i, rect) => {
            const mark = this.marks[i] = document.createElement('div');
            mark.classList.add(this.opts.classes.mark);
            mark.style.top = rect.top + 'px';
            if (this.opts.renderSizes) {
                mark.style.height = rect.height + 'px';
            }

            this.wrapper.appendChild(mark);
            this.opts.onNewMark(mark, this.wrapper);
        });

        this.opts.onCreation(this.marks, this.wrapper);
    }

    /*
    * _updateMarks handles the mark repositioning
    */
    _updateMarks() {
        const rects = getMarksRects(this.elems);

        this.hide();
        this.opts.beforeUpdate(this.wrapper);

        each(rects, (i, rect) => {
            const mark = this.marks[i];
            mark.style.top = rect.top + 'px';

            this.opts.onUpdateMark(mark, this.wrapper);
        });

        this.show();
        this.opts.onUpdate(this.marks, this.wrapper);
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
