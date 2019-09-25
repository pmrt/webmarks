import './webmarks.js';

function init() {
    const commonOpts = {
        alwaysVisible: true,
        renderSizes: true,
    }

    const multimarks = [
        // tutorial webmarks
        {
            opts: {
                ...commonOpts,
                stickVisibilityTo: document.getElementById('demo-1'),
            },
            elements: document.getElementsByClassName('step-title'),
        },
        // thread webmarks
        {
            opts: {
                ...commonOpts,
                stickVisibilityTo: document.getElementById('demo-2'),
                classes: {
                    wrapper: ['webmarks', 'thread-webmarks'],
                    mark: ['webmark', 'thread-webmark'],
                }
            },
            elements: document.getElementsByClassName('parent'),
        },
        // article webmarks
          {
            opts: {
                ...commonOpts,
                stickVisibilityTo: document.getElementById('demo-3'),
                classes: {
                    wrapper: ['webmarks', 'article-webmarks'],
                    mark: ['webmark', 'article-webmark'],
                }
            },
            elements: document.getElementsByClassName('snippet'),
        },
    ];

    const len = multimarks.length;
    window["__webmarks__instances__"] = new Array(len);
    for (let i=0; i < len; i++) {
        const params = multimarks[i];
        window["__webmarks__instances__"][i] = new Webmarks(params.elements, params.opts);
    }
}

window.onload = init;