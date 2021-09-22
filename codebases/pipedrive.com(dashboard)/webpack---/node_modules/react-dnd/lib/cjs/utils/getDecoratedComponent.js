"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getDecoratedComponent(instanceRef) {
    var currentRef = instanceRef.current;
    if (currentRef == null) {
        return null;
    }
    else if (currentRef.decoratedRef) {
        // go through the private field in decorateHandler to avoid the invariant hit
        return currentRef.decoratedRef.current;
    }
    else {
        return currentRef;
    }
}
exports.getDecoratedComponent = getDecoratedComponent;
