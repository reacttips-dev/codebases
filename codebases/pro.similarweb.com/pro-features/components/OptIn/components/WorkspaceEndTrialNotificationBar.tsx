import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import {
    NotificationBar,
    NotificationBarContainer,
} from "@similarweb/ui-components/dist/notification-bar";
import { default as React, StatelessComponent } from "react";
import styled from "styled-components";
import I18n from "../../../../app/components/React/Filters/I18n";
import { INotificationItem } from "../../../../app/components/React/NotificationBarContainer/NotificationBarContainer";
import { MarginLeft } from "./WorkspaceTrialInvitaionNotificationBar";

export interface IWorkspaceEndTrialNotificationBar extends INotificationItem {
    goBackClick: () => {};
}

export const WorkspaceEndTrialNotificationBar: StatelessComponent<IWorkspaceEndTrialNotificationBar> = (
    props,
) => {
    return (
        <EndTrialNotificationBar>
            <NotificationBar onClose={props.onClose}>
                <BoldSpan>
                    <I18n>workspace.end.trial.notification.bar.title.1</I18n>
                </BoldSpan>
                <MarginLeft>
                    <I18n>workspace.end.trial.notification.bar.title.2</I18n>
                </MarginLeft>
                <StyledLink onClick={props.goBackClick}>
                    <span>
                        <I18n>workspace.end.trial.notification.bar.go.back.link</I18n>
                    </span>
                    <SWReactIcons size={"xs"} iconName={"arrow-right"} />
                </StyledLink>
            </NotificationBar>
        </EndTrialNotificationBar>
    );
};

const EndTrialNotificationBar = styled.div`
    ${NotificationBarContainer} {
        font-size: 14px;
        line-height: initial;
    }
`;

export const BoldSpan = styled.span`
    font-weight: 700;
`;

export const StyledLink = styled.a`
    text-decoration: underline;
    color: ${colorsPalettes.carbon["500"]};
    margin-left: 5px;
    display: inline-flex;
    align-items: center;
    &:hover {
        cursor: pointer;
        font-weight: 700;
    }
    ${SWReactIcons} {
        margin-left: 4px;
        svg {
            path {
                fill: ${colorsPalettes.carbon["500"]};
            }
        }
    }
`;
