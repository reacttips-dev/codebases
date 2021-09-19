import { ResizeObservation } from './ResizeObservation';
import { ResizeObserverCallback } from './ResizeObserverCallback';
import { ResizeObserverEntry } from './ResizeObserverEntry';

const resizeObservers = [] as ResizeObserver[];

class ResizeObserver {
    /** @internal */
    public $$callback: ResizeObserverCallback;
    /** @internal */
    public $$observationTargets = [] as ResizeObservation[];
    /** @internal */
    public $$activeTargets = [] as ResizeObservation[];
    /** @internal */
    public $$skippedTargets = [] as ResizeObservation[];

    constructor(callback: ResizeObserverCallback) {
        const message = callbackGuard(callback);
        if (message) {
            throw TypeError(message);
        }
        this.$$callback = callback;
        resizeObservers.push(this);
    }

    public observe(target: Element) {
        const message = targetGuard('observe', target);
        if (message) {
            throw TypeError(message);
        }
        const index = findTargetIndex(this.$$observationTargets, target);
        if (index > 0) {
            return;
        }
        this.$$observationTargets.push(new ResizeObservation(target));
        startLoop();
    }

    public unobserve(target: Element) {
        const message = targetGuard('unobserve', target);
        if (message) {
            throw TypeError(message);
        }
        const index = findTargetIndex(this.$$observationTargets, target);
        if (index < 0) {
            return;
        }
        this.$$observationTargets.splice(index, 1);
        checkStopLoop();
    }

    public disconnect() {
        this.$$observationTargets = [];
        this.$$activeTargets = [];
    }
}

function callbackGuard(callback: ResizeObserverCallback) {
    if (typeof(callback) === 'undefined') {
        return `Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.`;
    }
    if (typeof(callback) !== 'function') {
        return `Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function.`;
    }
}

function targetGuard(functionName: string, target: Element) {
    if (typeof(target) === 'undefined') {
        return `Failed to execute '${functionName}' on 'ResizeObserver': 1 argument required, but only 0 present.`;
    }
    if (!(target instanceof (window as any).Element)) {
        return `Failed to execute '${functionName}' on 'ResizeObserver': parameter 1 is not of type 'Element'.`;
    }
}

function findTargetIndex(collection: ResizeObservation[], target: Element) {
    for (let index = 0; index < collection.length; index += 1) {
        if (collection[index].target === target) {
            return index;
        }
    }
    return -1;
}

const gatherActiveObservationsAtDepth = (depth: number): void => {
    resizeObservers.forEach((ro) => {
        ro.$$activeTargets = [];
        ro.$$skippedTargets = [];
        ro.$$observationTargets.forEach((ot) => {
            if (ot.isActive()) {
                const targetDepth = calculateDepthForNode(ot.target);
                if (targetDepth > depth) {
                    ro.$$activeTargets.push(ot);
                } else {
                    ro.$$skippedTargets.push(ot);
                }
            }
        });
    });
};

const hasActiveObservations = (): boolean =>
    resizeObservers.some((ro) => !!ro.$$activeTargets.length);

const hasSkippedObservations = (): boolean =>
    resizeObservers.some((ro) => !!ro.$$skippedTargets.length);

const broadcastActiveObservations = (): number => {
    let shallowestTargetDepth = Infinity;
    resizeObservers.forEach((ro) => {
        if (!ro.$$activeTargets.length) {
            return;
        }

        const entries = [] as ResizeObserverEntry[];
        ro.$$activeTargets.forEach((obs) => {
            const entry = new ResizeObserverEntry(obs.target);
            entries.push(entry);
            obs.$$broadcastWidth = entry.contentRect.width;
            obs.$$broadcastHeight = entry.contentRect.height;
            const targetDepth = calculateDepthForNode(obs.target);
            if (targetDepth < shallowestTargetDepth) {
                shallowestTargetDepth = targetDepth;
            }
        });

        ro.$$callback(entries, ro);
        ro.$$activeTargets = [];
    });

    return shallowestTargetDepth;
};

const deliverResizeLoopErrorNotification = () => {
    const errorEvent = new (window as any).ErrorEvent('ResizeLoopError', {
        message: 'ResizeObserver loop completed with undelivered notifications.',
    });

    window.dispatchEvent(errorEvent);
};

const calculateDepthForNode = (target: Node): number => {
    let depth = 0;
    while (target.parentNode) {
        target = target.parentNode;
        depth += 1;
    }
    return depth;
};

const notificationIteration = () => {
    let depth = 0;
    gatherActiveObservationsAtDepth(depth);
    while (hasActiveObservations()) {
        depth = broadcastActiveObservations();
        gatherActiveObservationsAtDepth(depth);
    }

    if (hasSkippedObservations()) {
        deliverResizeLoopErrorNotification();
    }
};

let animationFrameCancelToken: undefined | number;

const startLoop = () => {
    if (animationFrameCancelToken) return;

    runLoop();
};

const runLoop = () => {
    animationFrameCancelToken = window.requestAnimationFrame(() => {
        notificationIteration();
        runLoop();
    });
};

const checkStopLoop = () => {
    if (animationFrameCancelToken && !resizeObservers.some((ro) => !!ro.$$observationTargets.length)) {
        window.cancelAnimationFrame(animationFrameCancelToken);
        animationFrameCancelToken = undefined;
    }
};

const install = () =>
    (window as any).ResizeObserver = ResizeObserver;

export {
    install,
    ResizeObserver,
};
