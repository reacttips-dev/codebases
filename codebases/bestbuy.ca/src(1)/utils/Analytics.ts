export const analytics = {
    eventToSessionStorage: (linkName, eventName = "analytics-set-activitymap") => {
        if (typeof window !== "undefined") {
            const AppEventDataBacklog = [];
            if (!!sessionStorage.AEDBacklog) {
                let backlogArray = sessionStorage.getItem("AEDBacklog");
                if (backlogArray === null) {
                    backlogArray = "";
                }
                else {
                    AppEventDataBacklog.push(JSON.parse(backlogArray));
                }
            }
            const prevPageName = (window.frames["adobe-launch-iframe"] &&
                window.frames["adobe-launch-iframe"].contentWindow.s &&
                window.frames["adobe-launch-iframe"].contentWindow.s.pageName) ||
                (window.s && window.s.pageName) ||
                "";
            const eventData = {
                event: eventName,
                linkName,
                location: window.parent.location,
                prevPage: prevPageName,
            };
            AppEventDataBacklog.push(eventData);
            sessionStorage.setItem("AEDBacklog", JSON.stringify(AppEventDataBacklog));
        }
    },
    eventToAppEventData: (event) => {
        if (typeof window !== "undefined") {
            if (window.frames["adobe-launch-iframe"] &&
                window.frames["adobe-launch-iframe"].contentWindow &&
                window.frames["adobe-launch-iframe"].contentWindow.AppEventData) {
                window.frames["adobe-launch-iframe"].contentWindow.AppEventData.push(event);
            }
            else if (window.AppEventData) {
                window.AppEventData.push(event);
            }
        }
    },
};
export default analytics;
//# sourceMappingURL=Analytics.js.map