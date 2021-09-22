import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import { isAvailable } from "common/services/pageClaims";
import { swSettings } from "common/services/swSettings";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { openUnlockModalV2 } from "services/ModalService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

interface IWidgetFooterProps {
    href: string;
    unlockHook?: any;
    trackingLabel: string;
    text: string;
    target?: string;
}
const WidgetFooterContainer = styled(FlexRow)``;

const WidgetFooterDivider = styled.div`
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
    position: absolute;
    bottom: 52px;
    left: 0;
    right: 0;
`;

const CtaContainer = styled.div`
    display: block;
    width: auto;
    position: absolute;
    right: 16px;
    bottom: 8px;
`;
export const WidgetFooter: React.FunctionComponent<IWidgetFooterProps> = ({
    href,
    unlockHook,
    trackingLabel,
    text,
    target = "_self",
}) => {
    const trackButtonClicked = () => {
        TrackWithGuidService.trackWithGuid("widget.drilldown_button", "click", { trackingLabel });
    };
    const label = i18nFilter()(text);
    const getFooterComponent = () => {
        const linkComponent = () => {
            return (
                <a href={href} target={target} onClick={trackButtonClicked}>
                    <Button type={"flat"} label={label} />
                </a>
            );
        };

        if (unlockHook) {
            if (!isAvailable(swSettings.components[unlockHook.component])) {
                return (
                    <IconButton
                        type={"flat"}
                        iconName="locked"
                        onClick={(e) => {
                            e.preventDefault();
                            openUnlockModalV2(unlockHook.hookModal);
                        }}
                    >
                        {label}
                    </IconButton>
                );
            } else {
                return linkComponent();
            }
        } else {
            return linkComponent();
        }
    };
    return (
        <>
            <WidgetFooterContainer>
                <CtaContainer>{getFooterComponent()}</CtaContainer>
            </WidgetFooterContainer>
            <WidgetFooterDivider />
        </>
    );
};

export default SWReactRootComponent(WidgetFooter, "WidgetFooter");
