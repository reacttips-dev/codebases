import * as React from "react";
import { StatelessComponent } from "react";
import * as PropTypes from "prop-types";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import GAVerifiedTooltipContent from "./GAVerifiedTooltipContent";

interface IGAVerifiedTooltip {
    isEnabled: boolean;
    isActive: boolean;
    isPrivate: boolean;
    openTooltip: boolean;
    metric: string;
}

interface IGAVerifiedTooltipContentStrings {
    title: string;
    body: string;
    linkText: string;
}

function setContent(isActive, isPrivate) {
    let _content: IGAVerifiedTooltipContentStrings = {
        title: "",
        body: "",
        linkText: "",
    };
    //Tooltip content for not-verified website
    if (!isActive) {
        _content.title = "GAVerified.tooltip.disabled.title";
        _content.body = "GAVerified.tooltip.disabled.body";
        _content.linkText = "GAVerified.tooltip.disabled.linkText";
    }

    //Tooltip content for public website
    else if (isActive && !isPrivate) {
        _content.title = "GAVerified.tooltip.public.title";
        _content.body = "GAVerified.tooltip.public.body";
        _content.linkText = "GAVerified.tooltip.public.linkText";
    }

    //Tooltip content for private website
    else if (isActive && isPrivate) {
        _content.title = "GAVerified.tooltip.private.title";
        _content.body = "GAVerified.tooltip.private.body";
        _content.linkText = "GAVerified.tooltip.private.linkText";
    }

    return _content;
}

const GAVerifiedTooltip: StatelessComponent<IGAVerifiedTooltip> = ({
    isEnabled,
    isActive,
    isPrivate,
    openTooltip,
    children,
    metric,
}) => {
    const _content = setContent(isActive, isPrivate);
    return (
        <PopupHoverContainer
            content={() => (
                <GAVerifiedTooltipContent
                    metric={metric}
                    openTooltip={openTooltip}
                    isPrivate={isPrivate}
                    isActive={isActive}
                    title={_content.title}
                    body={_content.body}
                    linkText={_content.linkText}
                />
            )}
            injectClosePopupIntoContent={true}
            config={{
                enabled: isEnabled,
                defaultOpen: openTooltip,
                placement: "bottom",
                allowHover: true,
            }}
        >
            {children}
        </PopupHoverContainer>
    );
};

GAVerifiedTooltip.propTypes = {
    isEnabled: PropTypes.bool.isRequired,
    isActive: PropTypes.bool,
    isPrivate: PropTypes.bool,
    openTooltip: PropTypes.bool,
    metric: PropTypes.string,
};

export default GAVerifiedTooltip;
