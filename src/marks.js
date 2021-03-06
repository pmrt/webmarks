import {
    intrpTop,
    scaleHeight,
} from './ratio';
import {
    each
} from './helpers';

/*
* getMarksRects determines the `elems` elements fixed tops, caching the result for future use (eg. resizing
* will need marks tops to be recalculated for the new visible window height but element tops is always the
* same), then in the same iteration it'll interpolate each element top between the fixed page height and
* the visible window height, returning an array with all the corresponding marks tops for the current visible
* window height.
*
* Cached element rects will be stored into the provided `cachedRects` array. It caches elements fixed rects
* for future use as they will never change. Whenever the visible window changes, new marks tops need to be
* updated. Caching this will avoid re-computing the fixed elems rects in an update.
**/
export function getMarksRects(elems, cachedRects) {
    let rects = new Array(elems.length);
    // peek the first element to check if cache is available
    let loopfn = cachedRects[0] === undefined
        ? function uncached(i, el) {
            const elRect = el.getBoundingClientRect();
            // distance from the page top to the element top
            let elemTop = window.scrollY + elRect.top;
            cachedRects[i] = { top: elemTop, height: elRect.height };
            rects[i] = getMarkRects(elemTop, elRect.height);
        }
        : function cached(i) {
            const elRect = cachedRects[i];
            rects[i] = getMarkRects(elRect.top, elRect.height);
        }
    each(elems, loopfn);
    return rects;
}

/*
* getMarkRects takes an element top and an element height and computes the corresponding
* needed markRects
*/
function getMarkRects(elemTop, elemHeight) {
    return { top: intrpTop(elemTop), height: scaleHeight(elemHeight)}
}