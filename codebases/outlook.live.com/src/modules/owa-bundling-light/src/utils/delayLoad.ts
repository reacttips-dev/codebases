let callbacks: (() => void)[] = [];
let unblocked = false;
export function runAfterInitialRender(callback: () => void) {
    if (unblocked) {
        callback();
    } else {
        callbacks.push(callback);
    }
}

export function unblockLazyLoadCallbacks() {
    unblocked = true;
    for (var ii = 0; ii < callbacks.length; ii++) {
        callbacks[ii]();
    }
    callbacks = [];
}
