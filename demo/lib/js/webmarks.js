/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "../src/webmarks.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../src/helpers.js":
/*!*************************!*\
  !*** ../src/helpers.js ***!
  \*************************/
/*! exports provided: onReady, each, injectCSS, isObject, isHTMLElement, pageHeight, debounce */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"onReady\", function() { return onReady; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"each\", function() { return each; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"injectCSS\", function() { return injectCSS; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isObject\", function() { return isObject; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isHTMLElement\", function() { return isHTMLElement; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"pageHeight\", function() { return pageHeight; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"debounce\", function() { return debounce; });\n/*\n* onReady adds a callback `cb` to be triggered if document is ready. It'll call the callback as `self`\n* (optional) with the given `args` (optional).\n*\n* eg.: onReady(cb); onReady(cb, [param1, param2, param3]);\n*/\nfunction onReady(cb, args, self) {\n    if (document.readyState === 'complete') {\n        // Call it asynchronously\n        setTimeout(() => {\n            cb.apply(self, args);\n        }, 0);\n    } else {\n        const fn = function() {\n            document.removeEventListener(\"DOMContentLoaded\", fn);\n            cb.apply(self, args);\n        }\n        document.addEventListener(\"DOMContentLoaded\", fn);\n    }\n}\n\nfunction each(arr, cb, self) {\n    for (let i = 0; i < arr.length; i++) {\n        cb.call(self, i, arr[i], arr);\n    }\n}\n\nfunction injectCSS(styles) {\n    const s = document.createElement('style');\n    s.type = \"text/css\";\n    s.innerText = styles;\n\n    const links = document.getElementsByTagName('link');\n    if (links.length !== 0) {\n        const first = links[0];\n        document.head.insertBefore(s, first);\n    } else {\n        document.head.appendChild(s);\n    }\n}\n\n/*\n* isObject checks if a given `obj` is an object. Array and functions return 'false' as they have\n* length >= 0.\n*/\nfunction isObject(obj) {\n    let t = typeof obj;\n    return t === 'object' && !!obj && obj.length === undefined;\n}\n\nfunction isHTMLElement(obj) {\n    return obj instanceof Element;\n}\n\nfunction pageHeight() {\n    let body = document.body,\n        html = document.documentElement;\n    return Math.max(\n        body.scrollHeight, body.offsetHeight, html.clientHeight,\n        html.scrollHeight, html.offsetHeight\n    );\n}\n\nfunction debounce(fn, wait, ctx) {\n    let timer,\n        args;\n\n    function later() {\n        fn.apply(ctx, args);\n        timer = args = undefined;\n    }\n\n\treturn (...args) => {\n        args = args;\n        if (timer) {\n            clearTimeout(timer);\n        }\n\t\ttimer = setTimeout(later, wait);\n\t}\n}\n\n\n\n//# sourceURL=webpack:///../src/helpers.js?");

/***/ }),

/***/ "../src/marks.js":
/*!***********************!*\
  !*** ../src/marks.js ***!
  \***********************/
/*! exports provided: elemRects, getMarksRects */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"elemRects\", function() { return elemRects; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getMarksRects\", function() { return getMarksRects; });\n/* harmony import */ var _ratio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ratio */ \"../src/ratio.js\");\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ \"../src/helpers.js\");\n\n\n\n// cache elements fixed rects for future use as they will never change. Whenever the visible window\n// changes, new marks tops need to be updated. Caching this will avoid retrieving the fixed elems\n// rects in an update.\nlet elemRects = new Array();\n\n/*\n* getMarksRects determines the `elems` elements fixed tops, caching the result for future use (eg. resizing\n* will need marks tops to be recalculated for the new visible window height but element tops is always the\n* same), then in the same iteration it'll interpolate each element top between the fixed page height and\n* the visible window height, returning anarray with all the corresponding marks tops for the current visible\n* window height.\n**/\nfunction getMarksRects(elems) {\n    let rects = new Array(elems.length);\n    // peek the first element to check if cache is available\n    let loopfn = elemRects[0] === undefined\n        ? function uncached(i, el) {\n            const elRect = el.getBoundingClientRect();\n            // distance from the page top to the element top\n            let elemTop = window.scrollY + elRect.top;\n            elemRects[i] = { top: elemTop, height: elRect.height };\n            rects[i] = getMarkRects(elemTop, elRect.height);\n        }\n        : function cached(i) {\n            const elRect = elemRects[i];\n            rects[i] = getMarkRects(elRect.top, elRect.height);\n        }\n    Object(_helpers__WEBPACK_IMPORTED_MODULE_1__[\"each\"])(elems, loopfn);\n    return rects;\n}\n\n/*\n* getMarkRects takes an element top and an element height and computes the corresponding\n* needed markRects\n*/\nfunction getMarkRects(elemTop, elemHeight) {\n    return { top: Object(_ratio__WEBPACK_IMPORTED_MODULE_0__[\"intrpTop\"])(elemTop), height: Object(_ratio__WEBPACK_IMPORTED_MODULE_0__[\"scaleHeight\"])(elemHeight)}\n}\n\n//# sourceURL=webpack:///../src/marks.js?");

/***/ }),

/***/ "../src/ratio.js":
/*!***********************!*\
  !*** ../src/ratio.js ***!
  \***********************/
/*! exports provided: page, scaleHeight, intrpTop, intrp */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"page\", function() { return page; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"scaleHeight\", function() { return scaleHeight; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"intrpTop\", function() { return intrpTop; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"intrp\", function() { return intrp; });\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ \"../src/helpers.js\");\n\n\n// page caches the needed page sizes to avoid further calculations\nlet page = {}\n\nfunction setPageSizes() {\n    page.height = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"pageHeight\"])();\n}\nObject(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"onReady\"])(setPageSizes);\n\n/*\n* scaleHeight scales an `elementHeight` (relative to the total page height) to the corresponding height\n* for the current window height. (ratio * newValue)\n*\n* e.g.: scale the height of a given element with 4000 height, if the total page height = 8000\n*   and the current window height = 1000.\n*   x = 4000; f(x)?\n*   f(x) = 4000/8000 * 1000 = 500; scaleHeight(4000) -> 500\n*   In order words: the mark height will be 500 height (half of the window) if the element height\n*   is half of the page.\n*/\nfunction scaleHeight(elemHeight) {\n    return elemHeight / page.height * window.innerHeight;\n}\n\nfunction intrpTop(elemTop) {\n    return intrp([0, page.height], [0, window.innerHeight], elemTop);\n}\n\n/*\n* intrp interpolates a provided value `v` given two arrays with the following format: [min, max]\n*\n* e.g.: intrp([0, 10], [0, 100], 1) => 10\n*   intrp([0, 1280], [0, 480], 640)  => 220\n*   In other words: we're translating one range into a new one, maintaining the ratio. Given two\n*   ranges [0, 10] to [0, 100]; 1 in [0, 10] will be translated as 10 in [0, 100]; 5 in [0, 10]\n*   will be translated as 50 in [0, 100], etc. ie. Lineal interpolation.\n*/\nfunction intrp(range, newRange, v) {\n    const [ x, y ] = range;\n    const [ x2, y2 ] = newRange;\n\n    return ((v - x) * (y2 - x2) / (y - x)) + x2\n}\n\n//# sourceURL=webpack:///../src/ratio.js?");

/***/ }),

/***/ "../src/webmarks.js":
/*!**************************!*\
  !*** ../src/webmarks.js ***!
  \**************************/
/*! exports provided: Webmarks */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Webmarks\", function() { return Webmarks; });\n/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ \"../src/helpers.js\");\n/* harmony import */ var _marks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./marks */ \"../src/marks.js\");\n\n\n\n// noop is an empty function. All hooks will default to it\nconst noop = () => {};\n// isRememberingScroll figures out if the browser is remembering the last scrol position\nconst isRememberingScroll = window.scrollY != 0;\n// resizeWait defines the debouncing wait time (ms) to be applied on window resize\nconst resizeWait = 500;\n\nconst defaultOpts = {\n    // classes contains the class names which will be used to create the marks\n    classes: {\n        wrapper: 'webmarks',\n        mark: 'webmark',\n    },\n    // alwaysVisible determines whether the marks will be visible or not when\n    // user is not scrolling\n    // true – marks will be always visible\n    // false - marks will hide after user stops scrolling\n    alwaysVisible: false,\n    // hideAfter defines a wait time (ms) rigth after user stops scrolling, after\n    // which themarks will hide. The time will be reset as user keeps scrolling\n    // (debouncing)\n    hideAfter: 500,\n    // renderSizes determines whether the marks will be drawn with the corresponding\n    // scaled height of each element or not. Set it to 'true' if you want to represent\n    // the height of your elements along the scrollbar\n    renderSizes: false,\n    // onNewMark hook will be invoked right after each mark creation\n    // onNewMark(mark, wrapper) will take two args:\n    // - `mark` is the HTMLElement of the mark which has been created\n    // - `wrapper` is the immediate parent element of all marks\n    onNewMark: noop,\n    // onUpdateMark hook will be invoked right after each mark position update\n    // - `mark` is the HTMLElement of the mark which has been updated\n    // - `wrapper` is the immediate parent element of all marks\n    onUpdateMark: noop,\n    // onCreation callback will be invoked right after all marks have been created\n    // - `marks` is an array with all the marks which have been created.\n    // - `wrapper` is the immediate parent element of all marks\n    onCreation: noop,\n    // onUpdate callback will be invoked right after all marks have been updated\n    // - `marks` is an array with all the marks which have been updated.\n    // - `wrapper` is the immediate parent element of all marks\n    onUpdate: noop,\n    // beforeCreation callback will be invoked right before marks creation\n    // - `wrapper` is the immediate parent element of all the future marks\n    beforeCreation: noop,\n    // beforeUpdate callback will be invoked right before marks update\n    // - `wrapper` is the immediate parent element of all the future marks\n    beforeUpdate: noop,\n    // attachTo is an HTMLElement. If provided, it'll attach the wrapper to the\n    // `attachTo` element (as first child), instead of the document.body. The\n    // provided element height will change to match window.innerHeight.\n    attachTo: null,\n    // opacityTransition of the wrapper\n    opacityTransition: 100,\n}\n\nclass Webmarks {\n    constructor(elems, opts) {\n        this._onScroll = this._onScroll.bind(this);\n\n        try {\n            Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"onReady\"])(this._init, [elems, opts], this);\n        } catch(err) {\n            console.error(err);\n        }\n    }\n\n    /*\n    * visible getter. Returns true if opacity = 1, false if opacity = 0.\n    */\n    get visible() {\n        return !!parseInt(this.wrapper.style.opacity);\n    }\n\n    /*\n    * visible setter. Takes a `bool` (true or false) and converts it to int (1 or 0).\n    */\n    set visible(bool) {\n        this.wrapper.style.opacity = bool >>> 0;\n    }\n\n    /*\n    * _init initializes the library\n    */\n    _init(elems, opts) {\n        this._setup(elems, opts)\n        this._createMarks();\n    }\n\n    /*\n    * _setup handles the Webmarks setup merging, setting and saving the elements and options,ready to be used.\n    *\n    * If `alwaysVisible` is set to `true` it'll hide (or show and hide if browser is remembering the scroll\n    * position) the marks, setting up a function to be invoked on scroll which will show/hide the marks. Also,\n    * it will setup a debounced function to update the marks position on window resize\n    */\n    _setup(elems, opts) {\n        if (!elems) {\n            throw new TypeError(\"Elements array can't be empty\");\n        }\n\n        let peek = elems[0];\n        if (!Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"isHTMLElement\"])(peek)) {\n            throw new TypeError(JSON.stringify(peek) + \" is not an HTMLElement\");\n        }\n\n        this.elems = elems;\n        this.opts = {...defaultOpts, ...opts};\n\n        const attachTo = this.opts.attachTo;\n        if (attachTo && !Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"isHTMLElement\"])(attachTo)) {\n            throw new TypeError(JSON.stringify(peek) + \" is not an HTMLElement\");\n        }\n\n        let pos = attachTo ? 'absolute' : 'fixed';\n        Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"injectCSS\"])(\n        `.webmarks{`+\n            `position:${pos};` +\n            `top:0;`+\n            `right:0;`+\n            `bottom:0;`+\n            `transition: opacity ${this.opts.opacityTransition}ms;`+\n        `}`+\n        `.webmark{`+\n            `position:absolute;`+\n            `background:#333;`+\n            `right:0;}`\n        );\n        this._createWrapper();\n\n        if (!this.opts.alwaysVisible) {\n            // If user refreshes the page and the browser remembers the scroll it'll trigger the\n            // '_onScroll' method, resulting in a weird behaviour where marks will be visible until\n            // the user scrolls the page again. Therefore, we detect if browser is remembering scroll\n            // and if it does, we'll make it visible and hide it (similar behaviour as the scrollbar\n            // in most OS')\n            this.visible = isRememberingScroll;\n            this.hideAfterScroll = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"debounce\"])(this.hide, this.opts.hideAfter, this);\n            document.addEventListener('scroll', () => {\n                window.requestAnimationFrame(this._onScroll);\n            });\n        }\n\n        this.updateAfterResize = Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"debounce\"])(this._updateMarks, resizeWait, this);\n        window.addEventListener('resize', () => {\n            window.requestAnimationFrame(this.updateAfterResize);\n        })\n    }\n\n    /*\n    * show makes the webmarks' wrapper visible. Transition animation will have effects on this function\n    */\n    show() {\n        this.visible = true;\n    }\n\n    /*\n    * hide makes the webmarks' wrapper invisible. Transition animation will have effects on this function\n    */\n    hide() {\n        this.visible = false;\n    }\n\n    _createWrapper() {\n        const wrapper = this.wrapper = document.createElement('div');\n        const attachTo = this.opts.attachTo;\n        wrapper.classList.add(this.opts.classes.wrapper);\n\n        if (attachTo) {\n            attachTo.insertBefore(wrapper, attachTo.firstChild);\n            attachTo.style.height = window.innerHeight + 'px';\n        } else {\n            document.body.insertBefore(wrapper, document.body.firstChild);\n        }\n    }\n\n    /*\n    * _createMarks handles each mark creation.\n    */\n    _createMarks() {\n        const rects = Object(_marks__WEBPACK_IMPORTED_MODULE_1__[\"getMarksRects\"])(this.elems);\n        this.marks = new Array(rects.length);\n\n        this.opts.beforeCreation(this.wrapper);\n\n        Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"each\"])(rects, (i, rect) => {\n            const mark = this.marks[i] = document.createElement('div');\n            mark.classList.add(this.opts.classes.mark);\n            mark.style.top = rect.top + 'px';\n            if (this.opts.renderSizes) {\n                mark.style.height = rect.height + 'px';\n            }\n\n            this.wrapper.appendChild(mark);\n            this.opts.onNewMark(mark, this.wrapper);\n        });\n\n        this.opts.onCreation(this.marks, this.wrapper);\n    }\n\n    /*\n    * _updateMarks handles the mark repositioning\n    */\n    _updateMarks() {\n        const rects = Object(_marks__WEBPACK_IMPORTED_MODULE_1__[\"getMarksRects\"])(this.elems);\n\n        this.hide();\n        this.opts.beforeUpdate(this.wrapper);\n\n        Object(_helpers__WEBPACK_IMPORTED_MODULE_0__[\"each\"])(rects, (i, rect) => {\n            const mark = this.marks[i];\n            mark.style.top = rect.top + 'px';\n\n            this.opts.onUpdateMark(mark, this.wrapper);\n        });\n\n        this.show();\n        this.opts.onUpdate(this.marks, this.wrapper);\n    }\n\n    _onScroll() {\n        if (this.visible) {\n            this.hideAfterScroll();\n        } else {\n            this.show();\n        }\n    }\n}\n\n// expose Webmarks.js\nwindow.Webmarks = Webmarks;\n\n\n//# sourceURL=webpack:///../src/webmarks.js?");

/***/ })

/******/ });