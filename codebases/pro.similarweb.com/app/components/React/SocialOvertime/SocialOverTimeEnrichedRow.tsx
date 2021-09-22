import { SocialOverTimeEnrichedRowCompare } from "components/React/SocialOvertime/SocialOverTimeEnrichedRowCompare";
import { SocialOverTimeEnrichedRowSingle } from "components/React/SocialOvertime/SocialOverTimeEnrichedRowSingle";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import React from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { allTrackers } from "services/track/track";

const SocialOverTimeEnrichedRowInner = (props) => {
    const clickOutsideXButton = (e) => {
        allTrackers.trackEvent("Open", "Click", "Traffic Over Time/Collapsed");
        document.body.click();
    };
    const keys = props.params.key.split(",");
    const enrichProps = { clickOutsideXButton, keys };

    const durationRaw = DurationService.getDurationData(props.params.duration).raw;
    const { from, to } = durationRaw;
    const duration = DurationService.getDiffSymbol(from, to);
    const showTrafficOverTimeChartNoData = ["28d", "1m"].includes(duration);

    // keys.length === 1 => single mode
    return keys.length === 1 ? (
        <SocialOverTimeEnrichedRowSingle
            {...props}
            enrichProps={enrichProps}
            showTrafficOverTimeChartNoData={showTrafficOverTimeChartNoData}
        />
    ) : (
        <SocialOverTimeEnrichedRowCompare
            {...props}
            enrichProps={enrichProps}
            showTrafficOverTimeChartNoData={showTrafficOverTimeChartNoData}
        />
    );
};

const mapStateToProps = (props) => ({
    params: props.routing.params,
    chosenItems: props.routing.chosenItems,
});

export const SocialOverTimeEnrichedRow = connect(mapStateToProps)(SocialOverTimeEnrichedRowInner);
SWReactRootComponent(SocialOverTimeEnrichedRow, "SocialOverTimeEnrichedRow");

// save page and pageSize as closure and return a function that got props and return JSX Element
export const GetSocialOverTimeEnrichedRow = ({ page, pageSize }) => (props) => (
    <SocialOverTimeEnrichedRow page={page} pageSize={pageSize} {...props} />
);
