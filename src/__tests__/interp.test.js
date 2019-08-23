import { intrp } from '../intrp';
import { expectAll } from '../../test/helpers';

describe('interpolates elements tops between ranges', () => {
    test('intrp interpolates the given value between ranges', () => {
        expectAll({
            dataset: [
                [ [0, 10], [0, 100], 1 ],
                [ [0, 1280], [0, 480], 200],
                [ [1, 50], [0, 100], 50],
                [ [0, 10], [0, 100], 0 ],
                [ [0, 10], [0, 100], 2 ],
            ],
            results: [10, 75, 100, 0, 20],
        }, (set, want) => {
            let got = intrp(...set);
            expect(got).toBe(want);
        })
    });
});