// Takes two arrays that are assumed sorted, and computes the (sorted) intersection.
function sortedIntersectionOfSorted(a, b) {
    let i = 0;
    let j = 0;
    // eslint-disable-next-line prefer-const
    let accum = [];
    while (i < a.length && j < b.length) {
        if (a[i] < b[j]) {
            // eslint-disable-next-line no-plusplus
            i++;
        } else if (b[j] < a[i]) {
            // eslint-disable-next-line no-plusplus
            j++;
        } else {
            // assert(a[i] == b[j])
            accum.push(a[i]);
            // eslint-disable-next-line no-plusplus
            i++;
            // eslint-disable-next-line no-plusplus
            j++;
        }
    }
    return accum;
}

module.exports = {
    sortedIntersectionOfSorted
};