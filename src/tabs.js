import {
    intrpElemTop
} from './intrp';
import {
    each
} from './helpers';

// cache elements fixed tops for future use as they will never change. Whenever the visible window
// changes, new tabs tops need to be updated. Caching this will avoid recalculating the fixed elems
// tops in an update.
export let elemTops = new Array();
/*
* getTabsTops determines the `elems` elements fixed tops, caching the result for future use (eg. resizing
* will need tabs tops to be recalculated for the new visible window height but element tops is always the
* same), then in the same iteration it'll interpolate each element top between the fixed page height and
* the visible window height, returning anarray with all the corresponding tabs tops for the current visible
* window height.
**/
export function getTabsTops(elems) {
    let tops = new Array(elems.length);
    // peek the first element to check if cache is available
    let loopfn = elemTops[0] === undefined
        ? function uncached(i, el) {
            let elemTop = elemTops[i] = window.scrollY + el.getBoundingClientRect().top;
            tops[i] = intrpElemTop(elemTop);
        }
        : function cached(i) {
            tops[i] = intrpElemTop(elemTops[i]);
        }
    each(elems, loopfn);
    return tops;
}