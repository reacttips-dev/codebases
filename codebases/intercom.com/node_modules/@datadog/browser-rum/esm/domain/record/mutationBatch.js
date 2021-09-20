import { monitor, noop } from '@datadog/browser-core';
/**
 * Maximum duration to wait before processing mutations. If the browser is idle, mutations will be
 * processed more quickly. If the browser is busy executing small tasks (ex: rendering frames), the
 * mutations will wait MUTATION_PROCESS_MAX_DELAY milliseconds before being processed. If the
 * browser is busy executing a longer task, mutations will be processed after this task.
 */
var MUTATION_PROCESS_MAX_DELAY = 100;
export function createMutationBatch(processMutationBatch) {
    var cancelScheduledFlush = noop;
    var pendingMutations = [];
    function flush() {
        cancelScheduledFlush();
        processMutationBatch(pendingMutations);
        pendingMutations = [];
    }
    return {
        addMutations: function (mutations) {
            if (pendingMutations.length === 0) {
                cancelScheduledFlush = scheduleMutationFlush(flush);
            }
            pendingMutations.push.apply(pendingMutations, mutations);
        },
        flush: flush,
        stop: function () {
            cancelScheduledFlush();
        },
    };
}
function scheduleMutationFlush(flush) {
    var browserWindow = window;
    // Use 'requestIdleCallback' when available: it will throttle the mutation processing if the
    // browser is busy rendering frames (ex: when frames are below 60fps). When not available, the
    // fallback on 'requestAnimationFrame' will still ensure the mutations are processed after any
    // browser rendering process (Layout, Recalculate Style, etc.), so we can serialize DOM nodes
    // efficiently.
    if (browserWindow.requestIdleCallback) {
        var id_1 = browserWindow.requestIdleCallback(monitor(flush), { timeout: MUTATION_PROCESS_MAX_DELAY });
        return function () { return browserWindow.cancelIdleCallback(id_1); };
    }
    var id = browserWindow.requestAnimationFrame(monitor(flush));
    return function () { return browserWindow.cancelAnimationFrame(id); };
}
//# sourceMappingURL=mutationBatch.js.map