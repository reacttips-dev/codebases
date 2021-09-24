import fzy from 'fzy.js';
import escapeRegExp from 'lodash/escapeRegExp';

function identity(x) {
    return x;
}

export default function fuzzy(list, query, getter = identity) {
    const regex = new RegExp(
        query
        .split('')
        .map(escapeRegExp)
        .join('.*?'),
    );

    const candidates = list.filter((item) => getter(item).match(regex));

    const wrapped = candidates.map((candidate) => {
        const val = getter(candidate);
        return {
            item: candidate,
            score: fzy.score(query, val),
            matches: fzy.positions(query, val),
        };
    });

    return wrapped;
}