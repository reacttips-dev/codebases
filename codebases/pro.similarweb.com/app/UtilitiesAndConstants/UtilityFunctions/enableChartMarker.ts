export const enableChartMarker = (interval: string) => {
    switch (interval) {
        case "weekly":
        case "monthly":
            return true;
        case "daily":
            return false;
        default:
            return true;
    }
};
