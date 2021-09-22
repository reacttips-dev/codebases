import { IButtonProps, IconButton } from "@similarweb/ui-components/dist/button";
import { PopupClickContainer } from "@similarweb/ui-components/dist/popup-click-container";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import * as React from "react";
import { StatelessComponent } from "react";
import styled from "styled-components";
import I18n from "../../../../app/components/React/Filters/I18n";
import { i18nFilter } from "../../../../app/filters/ngFilters";
import "../style/NotificationButton.scss";

export interface INotificationButtonProps {
    isDisabled?: boolean;
    isLoading?: boolean;
    isActivated?: boolean;
    onClick?: (event?) => void;
    toolTipText?: string;
    promotionTooltip?: boolean;
}

const NotificationIconButton = styled(IconButton)`
    .SWReactIcons {
        svg {
            path {
                fill: ${({ isActivated }: IButtonProps) => (isActivated ? `#2A3E52` : null)};
            }
        }
    }
`;

const DashboardTemplatesPromotionTooltipContent = styled.div`
    width: 200px;
    box-sizing: border-box;
`;

const DashboardTemplatesPromotionTooltipTitle = styled.div`
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 3px;
    color: #fff;
`;

const DashboardTemplatesPromotionTooltipText = styled.div`
    font-weight: 400;
    font-size: 12px;
    line-height: 17px;
    color: #fff;
`;

const getTemplatesPromotionTooltip = () => {
    return (
        <DashboardTemplatesPromotionTooltipContent>
            <DashboardTemplatesPromotionTooltipTitle>
                <I18n>home.page.dashboard.promotion.tooltip.notifications.title</I18n>
            </DashboardTemplatesPromotionTooltipTitle>
            <DashboardTemplatesPromotionTooltipText>
                <I18n>home.page.dashboard.promotion.tooltip.notifications.body</I18n>
            </DashboardTemplatesPromotionTooltipText>
        </DashboardTemplatesPromotionTooltipContent>
    );
};
export const NotificationButton: StatelessComponent<INotificationButtonProps> = (props) => {
    const buttonText = props.isActivated
        ? i18nFilter()("dashboard.dashboardSubscription.subscribeButtonText.SUBSCRIBED")
        : i18nFilter()("dashboard.dashboardSubscription.subscribeButtonText.SUBSCRIBE");
    const buttonIcon = props.isActivated ? "checked" : "mail";
    const getToolTipText = (toolTipText) => () => {
        return <div>{toolTipText}</div>;
    };
    const onClick = () => {
        // PopupHoverContainer.closePopup();
        props.onClick();
    };
    const buttonComponent = props.promotionTooltip ? (
        <PopupClickContainer
            content={getTemplatesPromotionTooltip}
            config={{
                enabled: true,
                defaultOpen: true,
                placement: "bottom",
                allowHover: true,
                cssClass: "Popup-element-wrapper--pro dashboardTemplatePromote-popup",
            }}
        >
            <div>
                <NotificationIconButton
                    iconName={buttonIcon}
                    type={"flat"}
                    isActivated={props.isActivated}
                    isDisabled={props.isDisabled}
                    onClick={onClick}
                >
                    {buttonText}{" "}
                </NotificationIconButton>
            </div>
        </PopupClickContainer>
    ) : (
        <NotificationIconButton
            iconName={buttonIcon}
            type={"flat"}
            isActivated={props.isActivated}
            isDisabled={props.isDisabled}
            onClick={onClick}
        >
            {buttonText}{" "}
        </NotificationIconButton>
    );

    const ButtonComponentWithToolTip = !props.promotionTooltip ? (
        <PopupHoverContainer
            content={getToolTipText(props.toolTipText)}
            config={{
                maxWidth: 185,
                enabled: true,
                placement: "bottom",
                allowHover: true,
                cssClass: "Popup-element-wrapper--pro notificationButton-popup",
            }}
        >
            <div>{buttonComponent}</div>
        </PopupHoverContainer>
    ) : (
        buttonComponent
    );

    return props.toolTipText ? ButtonComponentWithToolTip : buttonComponent;
};
