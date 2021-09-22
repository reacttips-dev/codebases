import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import I18n from "components/React/Filters/I18n";
import React from "react";
import styled from "styled-components";
import { SfCardWrapperStyle } from "./SfCardWrapper";

const SfEmptyStateWrapper = styled(SfCardWrapperStyle)`
    height: 288px;
    justify-content: center;
    align-items: center;

    div:nth-child(1) {
        margin-bottom: 26px;
    }

    div:nth-child(2) {
        margin-bottom: 16px;
    }
`;

const SfEmptyStateTitleStyle = styled.div`
    font-size: 24px;
    color: ${rgba(colorsPalettes.carbon[500], 0.6)};
`;

const SfEmptyStateSubtitleStyle = styled.div`
    font-size: 14px;
    color: ${rgba(colorsPalettes.carbon[500], 0.6)};
`;

export const SFEmptyState = () => {
    return (
        <SfEmptyStateWrapper>
            <SWReactIcons iconName="no-search-results" size="xl" />
            <SfEmptyStateTitleStyle>
                <I18n>salesforce.empty-state.title</I18n>
            </SfEmptyStateTitleStyle>
            <SfEmptyStateSubtitleStyle>
                <I18n>salesforce.empty-state.subtitle</I18n>
            </SfEmptyStateSubtitleStyle>
        </SfEmptyStateWrapper>
    );
};
