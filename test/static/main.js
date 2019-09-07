const defaults = {
    renderSizes: true,
    alwaysVisible: true,
}

let elems = document
    .getElementsByClassName('parent');

const init = window.init = (opts) => {
    opts = opts || defaults;
    window.wm = new Webmarks(elems, opts);
}