import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { i18nFilter } from "filters/ngFilters";
import {
    FlexContainerCentered,
    PrimaryText,
    SecondaryText,
} from "pages/conversion/oss/ConversionSegmentOSSStyles";
import { NoDataSegmentsSVG } from "pages/website-analysis/website-content/leading-folders/components/NoDataSegments";
import * as React from "react";
import styled from "styled-components";
import { CenteredFlexColumn } from "styled components/StyledFlex/src/StyledFlex";

export const ErrorComponentContainer = styled(CenteredFlexColumn)<{ width: string }>`
    height: 393px;
    margin: 0 auto;
    text-align: center;
    width: ${(p) => p.width};
    ${SecondaryText} {
        opacity: 0.6;
        color: ${colorsPalettes.carbon["500"]};
        font-weight: 400;
        margin-top: 8px;
    }
    ${PrimaryText} {
        opacity: 0.6;
        color: ${colorsPalettes.carbon["500"]};
        font-weight: 500;
    }
`;
export const EmptyState = (props) => {
    const { primaryText, width, secondaryText, children } = props;
    return (
        <ErrorComponentContainer width={width}>
            <FlexContainerCentered>{children}</FlexContainerCentered>
            <PrimaryText>{i18nFilter()(primaryText)}</PrimaryText>
            {secondaryText && <SecondaryText>{i18nFilter()(secondaryText)}</SecondaryText>}
        </ErrorComponentContainer>
    );
};

export const NoDataComponent = ({ isSingle }) => {
    let primaryText = i18nFilter()("analysis.chart.single.empty-state.primary");
    let secondaryText = i18nFilter()("analysis.chart.single.empty-state.secondary");
    if (!isSingle) {
        primaryText = i18nFilter()("analysis.chart.compare.empty-state.primary");
        secondaryText = i18nFilter()("analysis.chart.compare.empty-state.secondary");
    }
    return (
        <EmptyState primaryText={primaryText} secondaryText={secondaryText} width="310">
            <NoDataSegmentsSVG />
        </EmptyState>
    );
};

export const ErrorComponent = () => {
    const primaryText = i18nFilter()("analysis.chart.error.load.primary");
    const secondaryText = i18nFilter()("analysis.chart.error.load.secondary");
    return (
        <EmptyState primaryText={primaryText} secondaryText={secondaryText} width="250px">
            <SWReactIcons iconName={"no-data-lab"} />
        </EmptyState>
    );
};
