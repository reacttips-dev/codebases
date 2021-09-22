import * as React from "react";
import styled from "styled-components";

import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { i18nFilter } from "filters/ngFilters";
import {
    FlexContainerCentered,
    PrimaryText,
    SecondaryText,
} from "pages/conversion/oss/ConversionSegmentOSSStyles";
import { NoDataSegmentsSVG } from "pages/website-analysis/website-content/leading-folders/components/NoDataSegments";
import { CenteredFlexColumn } from "styled components/StyledFlex/src/StyledFlex";

export const ErrorComponentContainer = styled(CenteredFlexColumn)<{ width: string }>`
    height: 393px;
    margin: 0 auto;
    text-align: center;
    width: ${(p) => p.width};
    ${SecondaryText} {
        color: ${rgba(colorsPalettes.carbon["500"], 0.6)};
        font-weight: 400;
        margin-top: 8px;
    }
    ${PrimaryText} {
        color: ${rgba(colorsPalettes.carbon["500"], 0.6)};
        color: ${colorsPalettes.carbon["500"]};
        font-weight: 500;
    }
`;
export const EmptyState: React.FunctionComponent<{
    primaryText: string;
    secondaryText: string;
    width: string;
}> = (props) => {
    const { primaryText, width, secondaryText, children } = props;
    return (
        <ErrorComponentContainer width={width}>
            <FlexContainerCentered>{children}</FlexContainerCentered>
            <PrimaryText>{i18nFilter()(primaryText)}</PrimaryText>
            {secondaryText && <SecondaryText>{i18nFilter()(secondaryText)}</SecondaryText>}
        </ErrorComponentContainer>
    );
};

export const NoDataComponent: React.FunctionComponent<{ isSingle: boolean }> = ({ isSingle }) => {
    const primaryText = isSingle
        ? i18nFilter()("analysis.chart.single.empty-state.primary")
        : i18nFilter()("analysis.chart.compare.empty-state.primary");
    const secondaryText = isSingle
        ? i18nFilter()("analysis.chart.single.empty-state.secondary")
        : i18nFilter()("analysis.chart.compare.empty-state.secondary");
    return (
        <EmptyState primaryText={primaryText} secondaryText={secondaryText} width="310px">
            <NoDataSegmentsSVG />
        </EmptyState>
    );
};

export const ErrorComponent: React.FunctionComponent = () => {
    const primaryText = i18nFilter()("analysis.chart.error.load.primary");
    const secondaryText = i18nFilter()("analysis.chart.error.load.secondary");
    return (
        <EmptyState primaryText={primaryText} secondaryText={secondaryText} width="250px">
            <SWReactIcons iconName={"no-data-lab"} />
        </EmptyState>
    );
};
