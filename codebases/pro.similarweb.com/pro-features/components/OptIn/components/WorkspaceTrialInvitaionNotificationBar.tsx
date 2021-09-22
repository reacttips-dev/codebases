import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { NotificationBar } from "@similarweb/ui-components/dist/notification-bar";
import { default as React, StatelessComponent } from "react";
import styled from "styled-components";
import I18n from "../../../../app/components/React/Filters/I18n";
import { INotificationItem } from "../../../../app/components/React/NotificationBarContainer/NotificationBarContainer";
import { BoldSpan } from "../../../pages/Leading Folders/src/LeadingFoldersInProgressInfoPanel";

export interface IWorkspaceTrialNotificationBar extends INotificationItem {
    tryWorkspacesClick: () => {};
}

export const WorkspaceTrialInvitationNotificationBar: StatelessComponent<IWorkspaceTrialNotificationBar> = (
    props,
) => {
    return (
        <NotificationBar onClose={props.onClose}>
            <div>
                <BoldSpan>
                    <I18n>workspace.invitation.trial.notification.bar.title.1</I18n>
                </BoldSpan>
                <MarginLeft>
                    <I18n>workspace.invitation.trial.notification.bar.title.2</I18n>
                </MarginLeft>
                <MarginSpan>
                    <Button type="primary" onClick={props.tryWorkspacesClick}>
                        <ButtonLabel>
                            <I18n>workspace.invitation.trial.notification.bar.button</I18n>
                        </ButtonLabel>
                    </Button>
                </MarginSpan>
            </div>
        </NotificationBar>
    );
};

export const MarginSpan = styled.span`
    margin: 0px 10px;
`;

export const MarginLeft = styled.span`
    margin-left: 5px;
`;
