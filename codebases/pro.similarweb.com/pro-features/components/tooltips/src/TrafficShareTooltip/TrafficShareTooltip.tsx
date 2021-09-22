import styled from "styled-components";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import * as PropTypes from "prop-types";
import * as React from "react";
import { StatelessComponent } from "react";
import { TrafficShareTooltipContent } from "./TrafficShareTooltipContent";
import { ITrafficShareBarProps } from "../../../../styled components/StyledTrafficShare/src/StyledTrafficShare";

/**
 * a Tooltip that that shows TrafficShare bar description
 */

const TrafficShareWrapper = styled.div`
    width: 100%;
    height: 16px;
    display: flex;
`;

interface ITrafficShareTooltipProps {
    title: string;
    trafficShareProps: ITrafficShareBarProps[];
    enabled?: boolean;
    placement?: string;
    cssClass?: string;
    cssClassContent?: string;
}

export const TrafficShareTooltip: StatelessComponent<ITrafficShareTooltipProps> = ({
    title,
    trafficShareProps,
    enabled,
    placement,
    cssClass,
    cssClassContent,
    children,
}) => {
    return (
        <PopupHoverContainer
            content={() => (
                <TrafficShareTooltipContent title={title} trafficShareProps={trafficShareProps} />
            )}
            config={{ enabled, placement, cssClass, cssClassContent }}
        >
            <TrafficShareWrapper>{children}</TrafficShareWrapper>
        </PopupHoverContainer>
    );
};
TrafficShareTooltip.propTypes = {
    title: PropTypes.string.isRequired,
    enabled: PropTypes.bool,
    placement: PropTypes.string,
    cssClass: PropTypes.string,
    cssClassContent: PropTypes.string,
    trafficShareProps: PropTypes.arrayOf(
        PropTypes.shape({
            color: PropTypes.string,
            backgroundColor: PropTypes.string,
            width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            text: PropTypes.string,
            name: PropTypes.string,
        }),
    ).isRequired,
};

TrafficShareTooltip.defaultProps = {
    enabled: true,
    placement: "top",
    cssClass: "trafficShareTooltip-element",
    cssClassContent: "trafficShareTooltip-element-content",
};
