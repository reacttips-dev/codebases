import { Close } from "@similarweb/ui-components/dist/simple-legend";
import * as React from "react";
import { FC } from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { WebsiteTooltip } from "../React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import {
    ClosableItemColorMarker,
    ClosableItemContainer,
    ClosableItemIconContainer,
    ClosableItemText,
} from "./StyledComponent";

interface IWebsiteClosableCompareItemProps {
    id: string;
    name: string;
    color: string;
    icon: string;
    isDisabled: boolean;
    onIconClick: (item) => void;
    onClose: (item) => void;
    item;
    link: string;
    tooltipData: any;
    closable?: boolean;
}

export const WebsiteClosableCompareItem: FC<IWebsiteClosableCompareItemProps> = (props) => {
    const onSiteClick = (): void => {
        TrackWithGuidService.trackWithGuid("query-bar.website", "click", {
            websiteName: props.name,
        });
    };

    return (
        <ClosableItemContainer onClick={props.onIconClick.bind(null, { ...props })}>
            <WebsiteTooltip domain={props.id} placement="bottom">
                <ClosableItemIconContainer>
                    {props.icon && (
                        <img data-automation-closable-website-icon-image={true} src={props.icon} />
                    )}
                    {props.color && (
                        <ClosableItemColorMarker style={{ backgroundColor: props.color }} />
                    )}
                    {props.closable ? (
                        <span onClick={() => props.onClose(props.id)}>
                            <Close />
                        </span>
                    ) : null}
                </ClosableItemIconContainer>
            </WebsiteTooltip>
            {props.name && (
                <ClosableItemText
                    onClick={onSiteClick}
                    data-automation-closable-item-text={true}
                    href={props.link}
                    target="_blank"
                >
                    {props.name}
                </ClosableItemText>
            )}
        </ClosableItemContainer>
    );
};
WebsiteClosableCompareItem.displayName = "WebsiteClosableCompareItem";
WebsiteClosableCompareItem.defaultProps = {
    closable: true,
};
