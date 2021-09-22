import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { i18nFilter } from "filters/ngFilters";
import { CenteredFlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import { NoDataLandscape } from "components/NoData/src/NoData";
import { Button } from "@similarweb/ui-components/dist/button";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { OPEN_DURATION_FILTER } from "action_types/website_analysis_action-types";
import { EErrorTypes } from "pages/website-analysis/traffic-sources/paid-search/components/paid-search-graph/helpers/PaidSearchGraphConstants";

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

const NoDataButtonIcon = styled.div`
    width: 16px;
    height: 16px;
    margin-right: 4px;
`;

const NoDataButton = styled(Button)`
    width: 200px;
    margin-top: 16px;
`;

const ButtonText = styled.div`
    color: ${colorsPalettes.carbon[0]};
    font-weight: bold;
    font-size: 14px;
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
            <CenteredFlexColumn>{children}</CenteredFlexColumn>
            <PrimaryText>{i18nFilter()(primaryText)}</PrimaryText>
            {secondaryText && <SecondaryText>{i18nFilter()(secondaryText)}</SecondaryText>}
        </StyledCenteredFlexColumn>
    );
};

const ErrorComponentInner = (props) => {
    const { type, open } = props;
    let primaryText = i18nFilter()("analysis.chart.error.load.primary");
    let secondaryText = i18nFilter()("analysis.chart.error.load.secondary");
    if (type === EErrorTypes.TIMEFRAME) {
        primaryText = i18nFilter()(
            "website-analysis.traffic-sources.paid-search.ppc.no-data-date-frame.title",
        );
        secondaryText = i18nFilter()(
            "website-analysis.traffic-sources.paid-search.ppc.no-data-date-frame.sub-title",
        );
    }

    if (type === EErrorTypes.USSTATEֹ) {
        primaryText = i18nFilter()(
            "website-analysis.traffic-sources.paid-search.ppc.no-data-usstate.title",
        );
        secondaryText = i18nFilter()(
            "website-analysis.traffic-sources.paid-search.ppc.no-data-usstate.sub-title",
        );
    }

    const onClick = () => {
        TrackWithGuidService.trackWithGuid("traffic_over_time_chart_no_data.button", "click");
        open({ type: OPEN_DURATION_FILTER });
        document.body.click();
    };

    return (
        <StyledCenteredFlexColumn>
            <EmptyState primaryText={primaryText} secondaryText={secondaryText}>
                {type === EErrorTypes.ERROR && <StyledIcon iconName={"no-data"} />}
                {type === EErrorTypes.TIMEFRAME && <StyledIcon iconName={"no-data-lab-2"} />}
                {type === EErrorTypes.USSTATEֹ && (
                    <StyledIcon iconName={"no-data-lab"} height={96} width={190} />
                )}
            </EmptyState>
            {type === EErrorTypes.TIMEFRAME && (
                <NoDataButton type="primary" onClick={onClick}>
                    <NoDataButtonIcon>
                        <SWReactIcons iconName={"daily-ranking"} size={"xs"} />
                    </NoDataButtonIcon>
                    <ButtonText>
                        {i18nFilter()(
                            "website-analysis.traffic-sources.paid-search.ppc-graph.no-data-time-frame.button",
                        )}
                    </ButtonText>
                </NoDataButton>
            )}
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
    <NoDataLandscape title="website-analysis.traffic-sources.paid-search.no-data" subtitle="" />
);
