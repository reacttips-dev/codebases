import { IBannerProps, InfoBanner } from "components/React/PlaResearch/InfoBanner";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import React from "react";
import { connect } from "react-redux";

// the InfoBannerContainer helps us to specify when to display the info banner.

interface IBannerContainerProps extends IBannerProps {
    displayInDuration?: string[];
    displayInWebSource?: string[];
    params?: { duration: string; webSource: string };
}

export const InfoBannerContainerInner: React.FunctionComponent<IBannerContainerProps> = (props) => {
    const { params } = props;
    const { duration, webSource } = params;
    const { displayInDuration, displayInWebSource } = props;
    const isDurationConditionsSatisfied = displayInDuration.includes(duration);
    const isWebSourceConditionsSatisfied = displayInWebSource.includes(webSource);
    const areAllConditionsSatisfied =
        isDurationConditionsSatisfied && isWebSourceConditionsSatisfied;
    return areAllConditionsSatisfied ? <InfoBanner {...props} /> : <span />;
};

const mapStateToProps = ({ routing }) => {
    return {
        params: routing.params,
    };
};

export const InfoBannerContainer = connect(mapStateToProps)(InfoBannerContainerInner);

SWReactRootComponent(InfoBannerContainer, "InfoBannerContainer");
