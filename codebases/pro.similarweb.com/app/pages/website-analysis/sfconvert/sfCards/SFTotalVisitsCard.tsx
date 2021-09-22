/* eslint-disable react/display-name */
import PointValueAndChange, {
    ChangeValueWrapper,
    StyledFlexWrapper,
    Title,
} from "components/Chart/src/components/PointValueAndChange";
import { StyledItemIcon } from "components/core cells/src/CoreRecentCell/StyledComponents";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { i18nFilter, minVisitsAbbrFilter } from "filters/ngFilters";
import _ from "lodash";
import dayjs from "dayjs";
import numeral from "numeral";
import SmallAreaGradientChartWithInfo from "pages/app performance/src/common components/SmallAreaGradientChartWithInfo";
import { SfCardWrapper } from "pages/website-analysis/sfconvert/sfCards/SfCardWrapper";
import { sfConvertPageContext } from "pages/website-analysis/sfconvert/SfConvertPage";
import { SfCardLoader } from "pages/website-analysis/sfconvert/components/SfCardLoader";
import React, { useContext, useEffect, useState } from "react";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled from "styled-components";

export const TitleContainer = styled.div`
    box-sizing: border-box;
    padding-left: 25px;
    height: 83px;
    ${StyledPrimaryTitle} {
        padding-top: 25px;
        font-size: 16px;
        font-weight: normal;
        color: #2a3e52;
    }
`;
TitleContainer.displayName = "TitleContainer";

const ChartContainer = styled.div`
height: 140px;
  box-sizing: border-box;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  width: 210px;
  ${ChangeValueWrapper}, ${ChangeValueWrapper} .ChangeValue,${Title}{
    font-size: 20px;
    line-height: normal;
    .ChangeValue-arrow {
      width:9px;
      height:14px;
      transform: initial;
    }
  }
  ${Title}{
    font-weight: 500;
  }
  ${StyledFlexWrapper}{
    margin-top:17px;
  }
`;
ChartContainer.displayName = "ChartContainer";

const ContentContainer = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    height: 192px;
    width: 100%;
    padding-top: 22px;
    padding-bottom: 27px;
`;
const CompetitorsContainer = styled.div`
    width: 170px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 121px;
`;
const Competitor = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;
const CompetitorDomain = styled.div`
    margin-left: 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: rgba(42, 62, 82, 0.8);
    font-size: 14px;
    margin-right: 10px;
    width: 90px;
`;
const CompetitorsVisits = styled.span`
    color: #2a3e52;
    font-size: 16px;
    white-space: nowrap;
    text-overflow: ellipsis;
`;
const SiteIcon = styled(StyledItemIcon)`
    margin-top: 17px;
    margin-right: 8px;
`;
const PointAndValueWrapper = styled.div`
    display: flex;
    max-width: 176px;
`;

export const SFTotalVisitsCard: React.FunctionComponent<any> = () => {
    const { webSource, country, competitors, webAnalysisComponent, site, siteInfo } = useContext(
        sfConvertPageContext,
    );
    const [competitorsData, setCompetitorsData] = useState(null);
    const [siteData, setSiteData] = useState(null);

    const fetchService = DefaultFetchService.getInstance();
    const duration = "25m";
    const {
        forAPI: { from, to },
    } = DurationService.getDurationData(duration, null, webAnalysisComponent.componentId);
    useEffect(() => {
        async function fetchData() {
            setCompetitorsData(null);
            const response = await fetchService.get<{
                Data: { [key: string]: any };
            }>("/widgetApi/TrafficAndEngagement/EngagementVisits/Table", {
                country,
                from,
                to,
                webSource,
                includeSubDomains: true,
                ShouldGetVerifiedData: false,
                isWindow: false,
                keys:
                    competitors[0].Domain +
                    "," +
                    competitors[1].Domain +
                    "," +
                    competitors[2].Domain,
                timeGranularity: "Monthly",
            });
            const data = response.Data;
            setCompetitorsData(data);
        }
        if (competitors.length > 0) {
            fetchData();
        }
    }, [country, from, to, webSource, competitors]);
    useEffect(() => {
        async function fetchData() {
            setSiteData(null);
            const response = await fetchService.get<{
                Data: { [key: string]: any };
            }>("/widgetApi/WebsiteOverview/EngagementVisits/Graph", {
                country,
                from,
                to,
                webSource,
                includeSubDomains: true,
                ShouldGetVerifiedData: false,
                isWindow: false,
                keys: site,
                timeGranularity: "Monthly",
            });
            const data = response.Data[site];
            data.avg =
                data[webSource][0].reduce((acc, current) => acc + current.Value, 0) /
                data[webSource][0].length;
            setSiteData(data);
        }
        fetchData();
    }, [country, from, to, webSource, site]);
    const formatNumber = ({ value }) => minVisitsAbbrFilter()(value);
    function SidebarGraphFallback() {
        return (
            <PointAndValueWrapper>
                <SiteIcon iconName={siteInfo.mainDomainName} iconSrc={siteInfo.icon} />
                <PointValueAndChange
                    value={formatNumber({ value: siteData.avg })}
                    valueSubtitle={i18nFilter()("salesforce.visits.monthly_avg")}
                />
            </PointAndValueWrapper>
        );
    }
    const CustomPointStyle = styled.div``;
    const CustomPoint = ({ point }) => <CustomPointStyle>{point}</CustomPointStyle>;
    const formatChange = (point1, point2) => {
        if (_.isNumber(point1.value) && _.isNumber(point2.value)) {
            const change = point2.value !== 0 ? (point1.value - point2.value) / point2.value : 0;
            return change !== 0
                ? numeral(change).format("0.[00]%")
                : () => <CustomPoint point="-" />;
        } else {
            return () => <CustomPoint point="NA" />;
        }
    };
    const isDecrease = (point1, point2) => point1.value > point2.value;
    const getValueSubtitle = (point) =>
        point.date && `in ${dayjs.utc(point.date).format("MMM YY")}`;
    const getChangeSubtitle = (point) =>
        point.date && `vs. ${dayjs.utc(point.date).format("MMM YY")}`;
    const gradient = {
        fillColor: "#4f8df9",
        stop1Color: "rgba(79,141,249,0.20)",
        stop2Color: "rgba(79,141,249,0.05)",
    };

    const ChartComponent = () => {
        const data = siteData[webSource][0].map((item) => ({
            key: new Date(item.Key).getTime(),
            value: item.Value,
            date: item.Key,
        }));
        return (
            <SmallAreaGradientChartWithInfo
                graphConfig={{
                    chart: {
                        margin: [10, 10, 10, 10],
                    },
                }}
                data={data.slice(1)}
                gradientProps={gradient}
                initialSelectedPoint={null}
                xAxisTickLabelFormat={"MMM YY"}
            >
                {(point, pointIndex) => {
                    if (!point && !pointIndex) {
                        return SidebarGraphFallback();
                    }
                    const previousPoint = data[pointIndex] || {}; // we compare to the previous data point from
                    // the original 'data' which its size is always larger by 1.
                    return (
                        <PointAndValueWrapper>
                            <SiteIcon iconName={siteInfo.mainDomainName} iconSrc={siteInfo.icon} />
                            <PointValueAndChange
                                value={formatNumber(point)}
                                valueSubtitle={getValueSubtitle(point)}
                                change={formatChange(point, previousPoint)}
                                changeSubtitle={getChangeSubtitle(previousPoint)}
                                isDecrease={isDecrease(previousPoint, point)}
                            />
                        </PointAndValueWrapper>
                    );
                }}
            </SmallAreaGradientChartWithInfo>
        );
    };
    function getProLink() {
        const keys = [site, ...competitors.map(({ Domain }) => Domain)].slice(0, 4);
        return `https://pro.similarweb.com/#/website/audience-overview/${keys.join(
            ",",
        )}/*/${country}/${duration}/?webSource=${webSource}`;
    }

    return (
        <SfCardWrapper
            webSource={webSource}
            country={country}
            duration={duration}
            title={i18nFilter()("salesforce.visits.title")}
            tooltip={i18nFilter()("salesforce.visits.tooltip")}
            footerLink={getProLink()}
            footerText={i18nFilter()("salesforce.visits.footer")}
            dataAutomation={"total-visits"}
        >
            {siteData ? (
                <ContentContainer>
                    <ChartContainer>
                        <ChartComponent />
                    </ChartContainer>
                    {competitorsData && (
                        <CompetitorsContainer>
                            <div>{i18nFilter()("salesforce.visits.top_competitors")}</div>
                            {competitorsData.map((competitor) => (
                                <Competitor key={competitor.Domain}>
                                    <StyledItemIcon
                                        iconName={competitor.Domain}
                                        iconSrc={competitor.Favicon}
                                    />
                                    <PlainTooltip variation={"white"} text={competitor.Domain}>
                                        <CompetitorDomain>{competitor.Domain}</CompetitorDomain>
                                    </PlainTooltip>
                                    <CompetitorsVisits>
                                        {minVisitsAbbrFilter()(competitor.TotalVisits / 25)}
                                    </CompetitorsVisits>
                                </Competitor>
                            ))}
                        </CompetitorsContainer>
                    )}
                </ContentContainer>
            ) : (
                <SfCardLoader height="192px" />
            )}
        </SfCardWrapper>
    );
};
