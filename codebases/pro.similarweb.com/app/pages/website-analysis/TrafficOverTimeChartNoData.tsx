import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { connect } from "react-redux";
import { AssetsService } from "services/AssetsService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { LeftIcon } from "styled components/Workspace/src/StyledQuickLink";
import styled from "styled-components";
import { OPEN_DURATION_FILTER } from "../../action_types/website_analysis_action-types";

const TrafficOverTimeChartNoDataWrapper = styled.div`
    height: 330px;
`;

const BackgroundWrapper = styled.div`
    position: relative;
    height: 100%;
    width: 100%;
    background: url(${AssetsService.assetUrl("/images/trafficOverTime-noData.svg")}) top no-repeat;
    background-size: cover;
    background-position: bottom;
    @media (max-width: 1460px) {
        background-position: top left;
        background-size: contain;
    }
`;

const Title = styled.div`
    position: absolute;
    top: 129px;
    left: 155px;
    color: ${colorsPalettes.midnight[500]};
    line-height: 24px;
    font-size: 20px;
    font-weight: 500;
`;

const NoDataLeftIcon = styled(LeftIcon)`
    position: absolute;
    top: 125px;
    left: 51px;
`;

const SubTitle = styled.div`
    position: absolute;
    top: 161px;
    left: 155px;
    color: ${colorsPalettes.carbon[500]};
    font-size: 14px;
`;

const NoDataButton = styled(Button)`
    position: absolute;
    top: 147px;
    right: 35px;
`;

const NoDataButtonIcon = styled.div`
    width: 16px;
    height: 16px;
    margin-right: 4px;
`;

const ButtonText = styled.div`
    color: ${colorsPalettes.carbon[0]};
    font-weight: bold;
    font-family: Roboto;
    font-size: 14px;
`;

const TrafficOverTimeChartNoData = (props) => {
    const onClick = () => {
        TrackWithGuidService.trackWithGuid("traffic_over_time_chart_no_data.button", "click");
        props.open({ type: OPEN_DURATION_FILTER });
        document.body.click();
    };

    return (
        <TrafficOverTimeChartNoDataWrapper>
            <BackgroundWrapper />
            <NoDataLeftIcon>
                <SWReactIcons iconName={"TrafficOverTime-NoData"} />
            </NoDataLeftIcon>
            <Title>{i18nFilter()("TrafficOverTimeChartNoData.title")}</Title>
            <SubTitle>{i18nFilter()("TrafficOverTimeChartNoData.text")}</SubTitle>
            <NoDataButton type="primary" onClick={onClick}>
                <NoDataButtonIcon>
                    <SWReactIcons iconName={"daily-ranking"} size={"sx"} />
                </NoDataButtonIcon>
                <ButtonText>{i18nFilter()("TrafficOverTimeChartNoData.button")}</ButtonText>
            </NoDataButton>
        </TrafficOverTimeChartNoDataWrapper>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        open: (action) => {
            dispatch(action);
        },
    };
};

export default connect(null, mapDispatchToProps)(TrafficOverTimeChartNoData);
