export default {
    // Track # of times wide content is scaled or truncated
    // If truncated, scale is 1;
    // otherwise scale will be 0.1, 0.2, ..., 0.9.
    WCScaledOrTruncated: {
        name: 'WCScaledOrTruncated',
        customData: (scale: number): [number] => [getScaleForDatapoint(scale)],
    },

    // Track # of times scale container has been hovered on at least once during its lifecycle,
    // i.e. # of times scale control has been shown at least once.
    WCScaleContainerHovered: {
        name: 'WCScaleContainerHovered',
    },

    // Track # of times scale control has been clicked to scale up.
    WCScaleUp: {
        name: 'WCScaleUp',
        customData: (scale: number): [number] => [getScaleForDatapoint(scale)],
    },
};

function getScaleForDatapoint(scale: number): number {
    if (scale < 0) {
        // We've seen various negative values being logged here.
        // Consolidate all negative values to -1.
        return -1;
    } else if (scale < 1) {
        // Preserve one decimal point for logging datapoint.
        return Math.floor(scale * 10) / 10;
    } else {
        return 1;
    }
}
