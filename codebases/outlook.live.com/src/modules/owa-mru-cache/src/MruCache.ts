import { action } from 'satcheljs/lib/legacy';
import type { ObservableMap } from 'mobx';

export interface ReferenceGetter {
    (): string | string[];
}

export default class MruCache<T> {
    private store: ObservableMap<string, T>;
    private deleteCallback: (key: string) => void;
    private references: ReferenceGetter[] = [];
    protected mruList: string[] = []; // sorted from older to newer

    constructor(private maxSize: number) {}

    initialize(store: ObservableMap<string, T>, deleteCallback?: (key: string) => void) {
        if (!this.store) {
            this.store = store;
            this.deleteCallback = deleteCallback;

            // Initialize the MRU list with the existing contents of the cache
            for (let key of store.keys()) {
                this.mruList.push(key);
            }
        }
    }

    add(key: string, value: T) {
        action('MruCache_add')(() => {
            this.store.set(key, value);

            if (this.mruList.indexOf(key) >= 0) {
                // The item is already in the cache, so just touch it
                this.touch(key);
            } else {
                // Add the item and, if necessary, purge old items
                this.mruList.push(key);
                this.purgeIfNecessary();
            }
        })();
    }

    get(key: string) {
        return this.store.get(key);
    }

    getAndTouch(key: string) {
        const obj = this.store.get(key);
        if (obj) {
            this.touch(key);
        }

        return obj;
    }

    has(key: string) {
        return this.store.has(key);
    }

    remove(key: string) {
        action('MruCache_remove')(() => {
            if (this.store.has(key) && !this.isReferenced(key)) {
                return this.removeItemAtIndex(this.mruList.indexOf(key));
            }
        })();
    }

    registerReference(reference: ReferenceGetter) {
        this.references.push(reference);
    }

    clear() {
        action('MruCache_clear')(() => {
            // Try purge all the items
            this.purgeTillSize(0);
        })();
    }

    /**
     * We return a new array instead of the mruList because we do not want the callee to update the mruList directly.
     * Also we assume that callee would want to do something with these ids present at a
     * particular time when the api is called and as mruList will be changing all the times,
     * callee would end up operating on the wrong set of the item ids if we returned mruList.
     */
    getItemIds(): string[] {
        return new Array(...this.mruList);
    }

    private touch(key: string) {
        let i = this.mruList.indexOf(key);
        if (i < 0) {
            throw new Error(`Item with key '${key}' does not exist in the cache.`);
        }

        // Move the key to the end of the list
        this.mruList.splice(i, 1);
        this.mruList.push(key);
    }

    /**
     * If we're above max MRU capacity, purge oldest items that are not referenced until we're under max size.
     */
    private purgeIfNecessary() {
        this.purgeTillSize(this.maxSize);
    }

    /**
     * Purge items until mru list is above the given size
     */
    private purgeTillSize(size: number) {
        let i = 0;
        while (this.mruList.length > size && i < this.mruList.length) {
            let key = this.mruList[i];
            if (this.isReferenced(key)) {
                i++;
            } else {
                this.removeItemAtIndex(i);
            }
        }
    }

    /**
     * Remove item from MRU at specified index
     */
    private removeItemAtIndex(index: number) {
        if (index < 0 || index >= this.mruList.length) {
            throw new Error('Invalid index to remove: ' + index);
        }

        let key = this.mruList[index];
        this.mruList.splice(index, 1);

        if (this.deleteCallback) {
            this.deleteCallback(key);
        } else {
            this.store.delete(key);
        }
    }

    private isReferenced(key: string) {
        for (let i = 0; i < this.references.length; i++) {
            const referenceValue: string | string[] = this.references[i]();
            if (Array.isArray(referenceValue)) {
                if (referenceValue.indexOf(key) != -1) {
                    return true;
                }
            } else {
                if (referenceValue == key) {
                    return true;
                }
            }
        }

        return false;
    }
}
