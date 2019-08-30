import { pageHeight } from './helpers';

// page caches the needed page sizes to avoid further calculations
export const page = {
    height: pageHeight(),
}

/*
* scaleHeight scales an `elementHeight` (relative to the total page height) to the corresponding height
* for the current window height. (ratio * newValue)
*
* e.g.: scale the height of a given element with 4000 height, if the total page height = 8000
*   and the current window height = 1000.
*   x = 4000; f(x)?
*   f(x) = 4000/8000 * 1000 = 500; scaleHeight(4000) -> 500
*   In order words: the mark height will be 500 height (half of the window) if the element height
*   is the half of the page.
*/
export function scaleHeight(elemHeight) {
    return elemHeight / page.height * window.innerHeight;
}

export function intrpTop(elemTop) {
    return intrp([0, page.height], [0, window.innerHeight], elemTop);
}

/*
* intrp interpolates a provided value `v` given two arrays with the following format: [min, max]
*
* e.g.: intrp([0, 10], [0, 100], 1) => 10
*   intrp([0, 1280], [0, 480], 640)  => 220
*   In other words: we're translating one range into a new one, maintaining the ratio. Given two
*   ranges [0, 10] to [0, 100]; 1 in [0, 10] will be translated as 10 in [0, 100]; 5 in [0, 10]
*   will be translated as 50 in [0, 100], etc. ie. Lineal interpolation.
*/
export function intrp(range, newRange, v) {
    const [ x, y ] = range;
    const [ x2, y2 ] = newRange;

    return ((v - x) * (y2 - x2) / (y - x)) + x2
}