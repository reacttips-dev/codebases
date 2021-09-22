import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import * as PropTypes from "prop-types";
import * as React from "react";
import { StatelessComponent } from "react";
import classNames from "classnames";
import { SegmentTooltipContent } from "./SegmentTooltipContent";

/**
 * a Tooltip that that shows an segment description
 */

interface ISegmentTooltipProps {
    domain?: string;
    segmentName?: string;
    segmentId?: any;
    onClick?: () => void;
    isOrgSegment?: boolean;
    dateModified?: string;
    placement?: string;
    debounce?: number;
    cssClassContainer?: string;
}

export const SegmentTooltip: StatelessComponent<ISegmentTooltipProps> = (props) => {
    return (
        <PopupHoverContainer
            content={() => <SegmentTooltipContent {...props} />}
            config={{
                placement: props.placement,
                cssClassContent: "Popup-content-infoCard",
                cssClassContainer: classNames("Popup-Container-infoCard", props.cssClassContainer),
                width: 394,
                height: 204,
                allowHover: true,
                closeDelay: 50,
            }}
            debounce={props.debounce}
        >
            {props.children}
        </PopupHoverContainer>
    );
};
SegmentTooltip.propTypes = {
    domain: PropTypes.string,
    segmentName: PropTypes.string,
    segmentId: PropTypes.string,
    onClick: PropTypes.func,
    isOrgSegment: PropTypes.bool,
    dateModified: PropTypes.string,
    placement: PropTypes.string,
    debounce: PropTypes.number,
    cssClassContainer: PropTypes.string,
};

SegmentTooltip.defaultProps = {
    placement: "top-left",
};
