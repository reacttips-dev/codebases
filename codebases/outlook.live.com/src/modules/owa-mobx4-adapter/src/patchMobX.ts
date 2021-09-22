// tslint:disable-next-line:forbid-import
import { observable } from 'mobx';

let needsToRun = true;

export default function patchMobX() {
    if (needsToRun) {
        needsToRun = false;
        const originalObjectFactory = observable.object;

        observable.object = function objectFactoryWrapper(
            sourceObject: any,
            decorators?: any,
            options?: any
        ) {
            // If the source object is already a proxy, we can just return the object it is a proxy to
            if (sourceObject.__proxyTarget__) {
                return sourceObject.__proxyTarget__;
            }

            // Create the store object
            let objectInStore = originalObjectFactory(sourceObject, decorators, options);

            // Turn the source object into a proxy to the store object
            proxifyObject(sourceObject, objectInStore);
            return objectInStore;
        };
    }
}

function proxifyObject(proxyObject: any, objectInStore: any) {
    // Proxy each property to the corresponding prop on the store object
    Object.keys(proxyObject).forEach(key => {
        Object.defineProperty(proxyObject, key, {
            enumerable: true,
            get: function () {
                return objectInStore[key];
            },
            set: function (value: any) {
                objectInStore[key] = value;
            },
        });
    });

    // Keep track of the object we're proxying to
    Object.defineProperty(proxyObject, '__proxyTarget__', {
        enumerable: false,
        value: objectInStore,
    });
}
