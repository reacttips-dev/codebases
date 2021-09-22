import { colorsPalettes } from "@similarweb/styles";
import { NotificationBar } from "@similarweb/ui-components/dist/notification-bar";
import { BoldSpan } from "pages/Leading Folders/src/LeadingFoldersInProgressInfoPanel";
import { default as React } from "react";
import styled from "styled-components";
import I18n from "../../../../app/components/React/Filters/I18n";

export const LoyaltyMultipleCategoriesNotificationBar = (props) => {
    return (
        <StyledNotificationBar>
            <TextContainer>
                <BoldSpan>
                    <I18n>websites.analysis.loyalty.notification.part.a</I18n>
                </BoldSpan>
                <MarginLeft>
                    <I18n>websites.analysis.loyalty.notification.part.b</I18n>
                </MarginLeft>
            </TextContainer>
        </StyledNotificationBar>
    );
};

export const MarginLeft = styled.span`
    margin-left: 5px;
`;

const TextContainer = styled.div`
    width: 100%;
    margin-left: 46px;
    max-width: 1366px;
`;

export const StyledNotificationBar = styled(NotificationBar)`
    background-color: ${colorsPalettes.blue["100"]};
`;
