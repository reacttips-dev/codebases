import {
    BoldText,
    CardContent,
    CardContentBody,
    CardHeader,
    ChangeValueWrapper,
    CompareDomainIconWrapper,
    CTA,
    DomainWrapper,
    IconWrapper,
    InsightCardContainer,
    StyledClosableItemColorMarker,
    StyledIcon,
    StyledMarker,
    TypeWrapper,
} from "./StyledComponents";
import * as React from "react";
import { FC } from "react";
import { IInsightProps } from "pages/website-analysis/traffic-sources/mmx/components/InsightsAssistant/InsightsContainer";
import { InsightsTypesNames, InsightType } from "insights-assistant/insights-types";
import { REQUIRED_POINTS } from "pages/website-analysis/traffic-sources/mmx/components/InsightsAssistant/data-parser";
import { colorsPalettes } from "@similarweb/styles";
import { i18nFilter } from "filters/ngFilters";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import { FlexRow } from "pages/website-analysis/website-content/leading-folders/components/Tab";
import I18n from "components/WithTranslation/src/I18n";

interface IProps extends IInsightProps {
    granularity: string;
    index: number;
    markerColor?: string;
    isCompare: boolean;
    onInsightClick: (
        chosenChannel: string,
        type: string,
        index: number,
        domain?: { icon: string; name: string; color: string },
    ) => void;
}

export const InsightCard: FC<IProps> = (props) => {
    const {
        channel,
        period,
        domain,
        value,
        isDecrease,
        type,
        onInsightClick,
        granularity,
        markerColor,
        isClicked,
        index,
        isCompare,
        isVisited,
    } = props;

    const i18n = i18nFilter();

    const getIconByType = () => {
        switch (type) {
            case InsightType.TREND:
                return (
                    <StyledIcon
                        isRotate={true}
                        size="xs"
                        isDecrease={isDecrease}
                        iconName={isDecrease ? "trend-down" : "trend-up"}
                        fill={isDecrease && colorsPalettes.red["s100"]}
                    />
                );
            case InsightType.SPIKE:
                return (
                    <StyledIcon
                        size="xs"
                        iconName={isDecrease ? "arrow-down-grey" : "arrow-up-grey"}
                        fill={isDecrease && colorsPalettes.red["s100"]}
                    />
                );
            default:
                return <StyledIcon size="xs" iconName="new" />;
        }
    };

    const getTypeI18nValue = () => {
        switch (type) {
            case InsightType.TREND:
                return isDecrease
                    ? "mmx.insights.type.trend.trending-down"
                    : "mmx.insights.type.trend.trending-up";
            case InsightType.SPIKE:
                return isDecrease ? "mmx.insights.type.spike.drop" : "mmx.insights.type.spike.jump";
            default:
                return "mmx.insights.type.new.title";
        }
    };

    const getCta = () => {
        switch (type) {
            case InsightType.TREND:
                return "mmx.insights.type.trend.cta";
            case InsightType.SPIKE:
                return isDecrease
                    ? "mmx.insights.type.spike.drop.cta"
                    : "mmx.insights.type.spike.jump.cta";
            default:
                return "mmx.insights.type.new.cta";
        }
    };

    const getBody = () => {
        switch (type) {
            case InsightType.TREND:
                return (
                    <>
                        {isDecrease
                            ? i18n("mmx.insights.type.trend.down")
                            : i18n("mmx.insights.type.trend.up")}
                        &nbsp;
                        {granularity === "Monthly"
                            ? i18n("mmx.insights.type.trend.monthly.body.granularity", {
                                  points: REQUIRED_POINTS,
                              })
                            : i18n("mmx.insights.type.trend.weekly.body.granularity", {
                                  points: REQUIRED_POINTS,
                              })}
                    </>
                );
            case InsightType.SPIKE:
                return (
                    <>
                        {isDecrease
                            ? i18n("mmx.insights.type.spike.fell")
                            : i18n("mmx.insights.type.spike.grew")}
                        &nbsp;
                        <ChangeValueWrapper isDecrease={isDecrease}>{value}</ChangeValueWrapper>
                        {granularity === "Monthly"
                            ? i18n("mmx.insights.type.spike.monthly.body", { period: period })
                            : i18n("mmx.insights.type.spike.weekly.body", { period: period })}
                    </>
                );
            default:
                return i18n("mmx.insights.type.new.body");
        }
    };

    const SingleCard = () => (
        <>
            <CardContent>
                <CardHeader>
                    <IconWrapper>{getIconByType()}</IconWrapper>
                    <TypeWrapper isDecrease={isDecrease}>{i18n(getTypeI18nValue())}</TypeWrapper>
                </CardHeader>
                <CardContentBody>
                    <StyledMarker color={markerColor} />
                    <BoldText>{channel}&nbsp;</BoldText>
                    {getBody()}
                </CardContentBody>
            </CardContent>
            <CTA>
                <I18n>{getCta()}</I18n>
            </CTA>
        </>
    );

    const CompareCard = () => (
        <>
            <CardContent>
                <CardHeader>
                    <CompareDomainIconWrapper>
                        {domain.icon && <img src={domain.icon} />}
                        {domain.color && (
                            <StyledClosableItemColorMarker backgroundColor={domain.color} />
                        )}
                    </CompareDomainIconWrapper>
                    <FlexColumn>
                        <DomainWrapper>{domain.name}</DomainWrapper>
                        <FlexRow>
                            <IconWrapper>{getIconByType()}</IconWrapper>
                            <TypeWrapper isDecrease={isDecrease}>
                                {i18n(getTypeI18nValue())}
                            </TypeWrapper>
                        </FlexRow>
                    </FlexColumn>
                </CardHeader>
                <CardContentBody>
                    <BoldText>{channel}&nbsp;</BoldText>
                    {getBody()}
                </CardContentBody>
            </CardContent>
            <CTA>
                <I18n>{getCta()}</I18n>
            </CTA>
        </>
    );

    return (
        <InsightCardContainer
            onClick={() =>
                onInsightClick(channel, InsightsTypesNames[type], index, isCompare && domain)
            }
            isClicked={isClicked}
            className="insightcard"
            isCompare={isCompare}
            isVisited={isVisited}
        >
            {isCompare ? <CompareCard /> : <SingleCard />}
        </InsightCardContainer>
    );
};
