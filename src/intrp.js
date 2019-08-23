import { pageHeight } from './helpers';

// page caches the needed page sizes to avoid further calculations
export const page = {
    height: pageHeight(),
}

export function intrpElemTop(elemTop) {
    return intrp([0, page.height], [0, window.innerHeight], elemTop);
}

/*
* intrp interpolates a provided value `v` given two arrays with the following format: [min, max]
*
* e.g.: intrp([0, 10], [0, 100], 1) => 10
*   intrp([0, 1280], [0, 480], 640)  => 220
*/
export function intrp(range, newRange, v) {
    const [ x, y ] = range;
    const [ x2, y2 ] = newRange;

    return ((v - x) * (y2 - x2) / (y - x)) + x2
}