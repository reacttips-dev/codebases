import * as React from "react";
import { StatelessComponent } from "react";
import * as classNames from "classnames";
import * as PropTypes from "prop-types";
import * as _ from "lodash";
import GAVerifiedIcon from "./GAVerifiedIcon";
import GAVerifiedTooltip from "./GAVerifiedTooltip";
import SWReactRootComponent from "decorators/SWReactRootComponent";
type IGAVerifedContainerSize = "SMALL" | "MEDIUM" | "LARGE";
export const GAVerifedContainerSizes: IGAVerifedContainerSize[] = ["SMALL", "MEDIUM", "LARGE"];
export interface IGAVerifedContainer {
    size: IGAVerifedContainerSize;
    isActive: boolean;
    isPrivate: boolean;
    tooltipAvailable: boolean;
    tooltipIsActive: boolean;
    metric: string;
}

const GAVerifiedContainer: StatelessComponent<IGAVerifedContainer> = ({
    size,
    isActive,
    isPrivate,
    tooltipAvailable,
    tooltipIsActive,
    metric,
}) => {
    let _icon = <GAVerifiedIcon isActive={isActive} size={size} />;

    let _privateRibbon = undefined;
    if (isPrivate && !(size == "SMALL")) {
        _privateRibbon = (
            <div className="GAVerified-private-ribbon">
                <i className="sw-icon-private" />
            </div>
        );
    }

    return (
        <GAVerifiedTooltip
            isEnabled={tooltipAvailable}
            isActive={isActive}
            isPrivate={isPrivate}
            openTooltip={tooltipIsActive}
            metric={metric}
        >
            <div className={classNames("GAVerified-container", `GAVerified-container--${size}`)}>
                {_icon}
                {_privateRibbon}
            </div>
        </GAVerifiedTooltip>
    );
};

GAVerifiedContainer.propTypes = {
    size: PropTypes.oneOf(GAVerifedContainerSizes).isRequired,
    isActive: PropTypes.bool.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    tooltipAvailable: PropTypes.bool.isRequired,
    tooltipIsActive: PropTypes.bool,
    metric: PropTypes.string,
};

SWReactRootComponent(GAVerifiedContainer, "GAVerifiedContainer");

export default GAVerifiedContainer;
