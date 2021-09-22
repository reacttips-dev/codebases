export var Evars;
(function (Evars) {
    Evars["eVar34"] = "eVar34";
})(Evars || (Evars = {}));
export const setAnalyticVariable = (key, value) => {
    if (typeof window !== "undefined") {
        try {
            window.sessionStorage.setItem(key, value.toLowerCase());
        }
        catch (_a) {
            return;
        }
    }
};
export const eventToSessionStorage = (linkName, eventName = "analytics-set-activitymap") => {
    if (typeof window !== "undefined") {
        let AppEventDataBacklog = [];
        if (!!sessionStorage.AEDBacklog) {
            const backlogArray = sessionStorage.getItem("AEDBacklog");
            if (backlogArray !== null) {
                AppEventDataBacklog = AppEventDataBacklog.concat(JSON.parse(backlogArray));
            }
        }
        const prevPageName = window.frames["adobe-launch-iframe"] &&
            window.frames["adobe-launch-iframe"].contentWindow.s &&
            window.frames["adobe-launch-iframe"].contentWindow.s.pageName ||
            window.s && window.s.pageName || "";
        const eventData = {
            event: eventName,
            linkName,
            location: window.parent.location,
            prevPage: prevPageName,
        };
        AppEventDataBacklog.push(eventData);
        sessionStorage.setItem("AEDBacklog", JSON.stringify(AppEventDataBacklog));
    }
};
export default setAnalyticVariable;
//# sourceMappingURL=setAnalyticVariable.js.map