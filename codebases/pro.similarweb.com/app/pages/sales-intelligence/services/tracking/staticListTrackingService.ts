const createStaticListTrackingService = (
    track: (category: string, action: string, name: string) => void,
) => {
    return {
        trackDomainSelected(type: "open" | "change", domainPosition: number) {
            track("table row", "click", `Expand sidebar/${type}/${domainPosition}`);
        },
        trackSignalDDOpened() {
            track("list filters", "open", "main signal filter");
        },
        trackSignalDDClosed(tabTotal: number) {
            track("Drop down", "close", `Main Signal filter/${tabTotal}`);
        },
        trackSignalDDTabChanged(tabName: string) {
            track("list filters", "change tab", `main signal filter/${tabName}`);
        },
        trackSignalDDValueSelected(tabName: string, signalName: string) {
            track("list filters", "select", `main signal filter/${tabName}/${signalName}`);
        },
    };
};

export default createStaticListTrackingService;
