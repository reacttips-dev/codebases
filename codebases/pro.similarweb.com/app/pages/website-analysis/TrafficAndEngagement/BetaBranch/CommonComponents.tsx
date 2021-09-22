import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { i18nFilter } from "filters/ngFilters";
import { StyledPill } from "styled components/StyledPill/src/StyledPill";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { SWReactIcons } from "@similarweb/icons";

const i18n = i18nFilter();

export const SINGLE_COMPARE_SIMILARITY_TRESHOLD = 0.001;
export const areValuesEqualAvgWithTreshold = (
    values,
    treshold = SINGLE_COMPARE_SIMILARITY_TRESHOLD,
) => {
    const avg = values.reduce((acc, v) => (Number.isFinite(v) ? acc + v : acc), 0) / values.length;
    return values.every((val) => Math.abs(avg - (Number.isFinite(val) ? val : 0)) / avg < treshold);
};

const BetaBranchLabelWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${colorsPalettes.carbon[25]};
    border-radius: 6px;
    padding: 4px 8px;

    ${StyledPill} {
        background-color: ${colorsPalettes.mint[400]};
        margin-left: 0.5em;
    }
`;

const BetaBranchLabelTitle = styled.div`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

export const BetaBranchLabel = () => (
    <BetaBranchLabelWrapper>
        <BetaBranchLabelTitle>{i18n("wa.traffic.engagement.beta.label.text")}</BetaBranchLabelTitle>
        <StyledPill>BETA</StyledPill>
    </BetaBranchLabelWrapper>
);

export const BetaMessageContainer = styled.div`
    background-color: ${colorsPalettes.bluegrey[200]};
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 12px;
    border-radius: 4px;
    grid-row: 2;
    grid-column: 1 / span 2;
    margin-top: 12px;

    .SWReactIcons {
        margin-right: 0.75em;
    }
`;

export const BetaMessage = ({ message = "", messageKey = "" }) => (
    <BetaMessageContainer>
        <SWReactIcons iconName="info" size="xs" />
        <span>{message || i18n(messageKey)}</span>
    </BetaMessageContainer>
);

export const WidgetBetaMessageWrapper = styled.div`
    margin-top: 0;

    ${BetaMessageContainer} {
        margin: 0;
        padding: 4px 8px;
    }
`;

const WidgetBetaBranchLabelWrapper = styled.div`
    position: absolute;
    z-index: 1;
    max-width: 35%;
`;

const WidgetBetaBranchLabelStyles = createGlobalStyle`
    .AudienceWidgetWrapper {
        position: relative;
        
        .addToDashboard {
            display: none;
        }
    }
`;

const WidgetBetaBranchLabel = (props) => {
    const { positionStyle = { top: "12px", right: "12px" } } = props;

    return (
        <>
            <WidgetBetaBranchLabelStyles />
            <WidgetBetaBranchLabelWrapper style={positionStyle}>
                <BetaBranchLabel />
            </WidgetBetaBranchLabelWrapper>
        </>
    );
};
SWReactRootComponent(WidgetBetaBranchLabel, "WidgetBetaBranchLabel");
