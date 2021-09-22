import { Injector } from "common/ioc/Injector";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { addToDashboard } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";
import React, { useEffect } from "react";
import { allTrackers } from "services/track/track";

export const AddToDashboard = ({ metric, webSource, filters, overrideParams = {} }) => {
    let addToDashboardModal = { dismiss: () => null };

    useEffect(() => () => addToDashboardModal.dismiss(), [addToDashboardModal]);

    const a2d = () => {
        allTrackers.trackEvent("Pop up", "open", `Add to my Dashboard/${metric.title}`);

        addToDashboardModal = addToDashboard({
            metric: metric.addToDashboardName,
            type: metric.chartType ? metric.chartType : "Graph",
            webSource,
            modelType: "fromWebsite",
            filters,
            overrideAddToDashboardParams: overrideParams,
        });
    };
    return <AddToDashboardButton onClick={() => a2d()} />;
};
