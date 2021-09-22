const SPACING_BOTTOM = 31;
const BOTTOM_MARGIN = 71;
/*
 * Update the height
 * It is used in chart annotation, because we have added a layer to listen for mouse move
 * So the props height should go to the div that listen the mouse move, and the Highchart component
 * should be the height pass in parameter (which should be at 100%).
 */
export const getUpdatedDomPropsHeight = (domProps, height) => {
    if (domProps?.style?.height) {
        return {
            ...domProps,
            style: {
                ...domProps.style,
                height,
            },
        };
    }
    return domProps;
};
/*
 * We updated the config to have more space in bottom chart so that we can display annotations count
 * below the xAxis without being cut
 */
export const getUpdatedConfigWithNewBottomHeight = (config) => {
    if (!isNaN(config?.chart?.margin)) {
        if (config?.chart?.margin < BOTTOM_MARGIN) {
            const margin = config.chart.margin;
            config.chart.margin = [margin, margin, BOTTOM_MARGIN, margin];
        }
        return config;
    } else if (config?.chart?.margin?.length > 2 && config.chart.margin[2] < BOTTOM_MARGIN) {
        config.chart.margin[2] = BOTTOM_MARGIN;
    } else if (config?.chart?.marginBottom < BOTTOM_MARGIN) {
        config.chart.marginBottom = BOTTOM_MARGIN;
    } else if (config?.chart?.spacing?.length > 2 && config.chart.spacing[2] < SPACING_BOTTOM) {
        config.chart.spacing[2] = SPACING_BOTTOM;
    } else if (config?.chart?.spacingBottom && config.chart.spacingBottom < SPACING_BOTTOM) {
        config.chart.spacingBottom = SPACING_BOTTOM;
    } else {
        config.chart.spacingBottom = SPACING_BOTTOM;
    }
    return config;
};
