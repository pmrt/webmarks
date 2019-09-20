import {
    getMarksRects,
} from '../marks';
import {
    page,
} from '../ratio';

describe('calculate marks tops', () => {
    let cachedRects = new Array();

    beforeAll(() => {
        document.head.innerHTML =
            '<style>' +
                '* { margin: 0; }' +
                '.test { position: relative; }' +
            '</style>';
        document.body.innerHTML =
            '<div id="first" class="test"></div>' +
            '<div id="second" class="test"></div>' +
            '<div id="third" class="test"></div>';
        window.innerHeight = 100;
        window.scrollY = 0;
        page.height = 1000;

        document.getElementById('first').getBoundingClientRect = () => {
            return { top: 10, height: 100 }
        };
        document.getElementById('second').getBoundingClientRect = () => {
            return { top: 20, height: 100 }
        };
        document.getElementById('third').getBoundingClientRect = () => {
            return { top: 30, height: 100 }
        };
    });

    afterAll(() => {
        // Clear globals and reset
        document.head.innerHTML =
        document.body.innerHTML = '';
        window.innerHeight = 0;
        page.height = 0;

        cachedRects = new Array();
    });

    test('get marks tops = [1, 2, 3] and cache the element tops', () => {
        const elems = document.getElementsByClassName('test');
        // cache should be empty
        expect(cachedRects).toEqual([]);
        const got = getMarksRects(elems, cachedRects);
        // mark rects
        const want = [{top: 1, height: 10}, {top: 2, height: 10}, {top: 3, height: 10}];
        expect(got).toEqual(want);
        // cache shouldn't be empty (fixed elem rects)
        expect(cachedRects).toEqual([{top: 10, height: 100}, {top: 20, height: 100}, {top: 30, height: 100}]);
    });

    test('getMarksRects uses cache', () => {
        const elems = document.getElementsByClassName('test');
        expect(cachedRects).toEqual([{top: 10, height: 100}, {top: 20, height: 100}, {top: 30, height: 100}]);
        // override cache
        cachedRects[2].top = 50;
        const got = getMarksRects(elems, cachedRects);
        const want = [{top: 1, height: 10}, {top: 2, height: 10}, {top: 5, height: 10}];
        expect(got).toEqual(want);
    });
});