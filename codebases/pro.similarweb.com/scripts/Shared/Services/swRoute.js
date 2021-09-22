import angular from "angular";
import { swSettings } from "../../common/services/swSettings";

angular.module("shared").factory("swRoute", function (swNavigator) {
    var defaultDuration = "6m";

    function getCustomDuration(customDuration) {
        var duration = customDuration.split("-"),
            fromDate = swSettings.momentFromString(duration[0]),
            toDate = swSettings.momentFromString(duration[1]);
        return toDate.diff(fromDate, "months") + 1 + "m";
    }

    function getCustomDurationEndDate(customDuration) {
        var duration = customDuration.split("-");
        return swSettings.momentFromString(duration[1]).endOf("month").startOf("day");
    }

    return {
        duration: function () {
            var params = swNavigator.getParams();
            var dur = params && params.duration ? params.duration : defaultDuration,
                isCustom = dur.indexOf("-") !== -1;

            if (isCustom) {
                dur = getCustomDuration(dur);
            }

            var unit = dur.substring(dur.length - 1) === "d" ? "days" : "months",
                length = Number(dur.substring(0, dur.length - 1));

            return {
                unit: unit,
                length: length,
                from: function () {
                    var from = this.to().add(-length + 1, unit);
                    //If were on months units we need to set the 'from' date day to 1 because the 'to' date day is the last day of the month
                    return this.isWindow() ? from : from.set("date", 1);
                },
                to: function () {
                    if (isCustom) {
                        return getCustomDurationEndDate(swNavigator.getParams().duration);
                    } else {
                        return unit === "months"
                            ? swSettings.current.endDate.clone()
                            : swSettings.current.windowEndDate
                            ? swSettings.current.windowEndDate.clone()
                            : swSettings.current.endDate.clone();
                    }
                },
                previous: function () {
                    return this.to().add(-1, unit);
                },
                isWindow: function () {
                    return unit === "days";
                },
            };
        },
    };
});
