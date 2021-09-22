import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { i18nFilter } from "filters/ngFilters";
import { CenteredFlexColumn, CenteredFlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { NoDataLandscape } from "components/NoData/src/NoData";

const PrimaryText = styled.div`
    font-size: 16px;
    color: ${colorsPalettes.carbon["500"]};
    text-align: center;
    margin-top: 20px;
`;

const SecondaryText = styled.div`
    font-size: 12px;
    color: ${rgba(colorsPalettes.carbon["500"], 0.6)};
`;

const StyledCenteredFlexColumn = styled(CenteredFlexColumn)`
    height: 100%;
`;

const StyledIcon = styled(SWReactIcons)<{ height?: number; width?: number }>`
    ${({ width = 150 }) => `width:${width}px`};
    ${({ height = 105 }) => `height:${height}px`};
`;

const EmptyState: React.FunctionComponent<{
    primaryText: string;
    secondaryText: string;
}> = (props) => {
    const { primaryText, secondaryText, children } = props;
    return (
        <StyledCenteredFlexColumn>
            <CenteredFlexRow>{children}</CenteredFlexRow>
            <PrimaryText>{i18nFilter()(primaryText)}</PrimaryText>
            {secondaryText && <SecondaryText>{i18nFilter()(secondaryText)}</SecondaryText>}
        </StyledCenteredFlexColumn>
    );
};

const ErrorComponentInner = () => {
    const i18n = i18nFilter();
    const primaryText = i18n("analysis.chart.error.load.primary");
    const secondaryText = i18n("analysis.chart.error.load.secondary");

    return (
        <StyledCenteredFlexColumn>
            <EmptyState primaryText={primaryText} secondaryText={secondaryText}>
                <StyledIcon iconName={"no-data"} />
            </EmptyState>
        </StyledCenteredFlexColumn>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        open: (action) => {
            dispatch(action);
        },
    };
};

export const ErrorComponent = connect(null, mapDispatchToProps)(ErrorComponentInner);

export const NoDataComponent: React.FunctionComponent = () => (
    <NoDataLandscape title="global.graph.no-data" subtitle="" />
);
