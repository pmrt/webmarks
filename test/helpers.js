
export function expectAll(fixtures, matcherFn) {
    fixtures.dataset.forEach((set, i) => {
        matcherFn(set, fixtures.results[i]);
    });
}