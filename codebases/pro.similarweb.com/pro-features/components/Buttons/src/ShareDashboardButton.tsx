import * as React from "react";
import { StatelessComponent } from "react";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import WithTranslation from "../../WithTranslation/src/WithTranslation";
import styled from "styled-components";
import { IAccountUser } from "sharing/SharingService";

const ButtonWrapper = styled.div`
    display: inline-flex;
`;

interface ISharedDashboardButtonProps {
    isDisabled?: boolean;
    onClick: () => void;
    dashboardViewers: IAccountUser[];
    sharedWithAccounts: number[];
}

const formatUserName = (users: IAccountUser[]) => {
    return `${users[0].FirstName} ${users[0].LastName}`;
};

export const ShareDashboardButton: StatelessComponent<ISharedDashboardButtonProps> = (props) => (
    <WithTranslation>
        {(translate) => {
            let iconName = "employees",
                tooltipText = "dashboard.shareDashboard.tooltip.text.noshare",
                tooltipParams = {},
                buttonText = "dashboard.shareDashboard.button.text.share";
            if (props.isDisabled) {
                return (
                    <IconButton
                        isDisabled={true}
                        type="flat"
                        iconName={iconName}
                        onClick={props.onClick}
                    >
                        <span>{translate(buttonText)}</span>
                    </IconButton>
                );
            }
            if (props.sharedWithAccounts.length) {
                iconName = "company";
                tooltipText = "dashboard.shareDashboard.tooltip.text";
                buttonText = "dashboard.shareDashboard.button.text.shared";
            } else {
                switch (props.dashboardViewers.length) {
                    case 0:
                        break;
                    case 1:
                        iconName = "users";
                        tooltipText = "dashboard.shareDashboard.tooltip.text.oneuser";
                        tooltipParams = {
                            user: formatUserName(props.dashboardViewers),
                        };
                        buttonText = "dashboard.shareDashboard.button.text.shared";
                        break;
                    default:
                        iconName = "users";
                        tooltipText = "dashboard.shareDashboard.tooltip.text.multipleusers";
                        tooltipParams = {
                            user: formatUserName(props.dashboardViewers),
                            count: (props.dashboardViewers.length - 1).toString(),
                        };
                        buttonText = "dashboard.shareDashboard.button.text.shared";
                        break;
                }
            }
            return (
                <PlainTooltip
                    tooltipContent={translate(tooltipText, tooltipParams)}
                    placement="bottom"
                >
                    <ButtonWrapper>
                        <IconButton
                            isDisabled={props.isDisabled}
                            type="flat"
                            iconName={iconName}
                            onClick={props.onClick}
                        >
                            {translate(buttonText)}
                        </IconButton>
                    </ButtonWrapper>
                </PlainTooltip>
            );
        }}
    </WithTranslation>
);
