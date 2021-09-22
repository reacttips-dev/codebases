import { logUsage } from 'owa-analytics';
import isEqual from 'lodash-es/isEqual';

export type KeyVariables<TKey> = { key: TKey; variables: any; diag: (key: TKey) => string };

// REVIEW:  it's possible if we have a query that can be called with many different variables, this linear
// search through the variable set will be slow.  I could imagine a fancier data structure that starts linear
// and switches to a map that uses fast-stable-json-stringify on the variables as a key if the list gets too long,
// but keeping it simple for now and adding a datapoint to track the maximum size per session
const GETTING_TOO_BIG = 500;
export type KeyVariablesMap<T extends KeyVariables<TKey>, TKey> = Map<TKey, Array<T>>;

const NOT_FOUND = -1;

export function createMap<T extends KeyVariables<TKey>, TKey>() {
    const map: Map<TKey, Array<T>> = new Map();
    return {
        upsert: (item: T) => _upsert<T, TKey>(map, item),
        remove: (item: T) => _remove(map, item),
        get: (item: Pick<T, 'key' | 'variables'>) => _get(map, item),
        clear: () => map.clear(),
        count: () => map.size,
        forEach: (cb: (value: T) => void) => {
            map.forEach((v: T[], k: TKey) => {
                v.forEach(vv => cb(vv));
            });
        },
    };
}

function _upsert<T extends KeyVariables<TKey>, TKey>(map: KeyVariablesMap<T, TKey>, item: T): T {
    const entries = map.get(item.key) || [];
    const idx = findIndex(entries, item);

    if (idx !== NOT_FOUND) {
        return entries[idx];
    } else {
        entries.push(item);
        map.set(item.key, entries);

        if (entries.length > GETTING_TOO_BIG) {
            logUsage('KVMap.TooBig', { size: entries.length, name: item.diag(item.key) });
        }

        return item;
    }
}
function _remove<T extends KeyVariables<TKey>, TKey>(map: KeyVariablesMap<T, TKey>, item: T) {
    const entries = map.get(item.key)!;
    const idx = findIndex(entries, item);
    entries.splice(idx, 1);
}

function _get<T extends KeyVariables<TKey>, TKey>(
    map: KeyVariablesMap<T, TKey>,
    item: Pick<T, 'key' | 'variables'>
): T {
    const entries = map.get(item.key) || [];
    return entries[findIndex(entries, item)];
}

function findIndex<TKey>(
    entries: Array<KeyVariables<TKey>>,
    item: Pick<KeyVariables<TKey>, 'key' | 'variables'>
): number {
    let idx = NOT_FOUND;

    entries.some((e, i) => {
        const eq = isEqual(e.variables, item.variables);
        if (eq) {
            idx = i;
        }

        return eq;
    });

    return idx;
}
