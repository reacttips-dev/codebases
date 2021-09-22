import { SWReactIcons } from "@similarweb/icons";
import { swSettings } from "common/services/swSettings";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import styled from "styled-components";
import { BetaLabel } from "../../../.pro-features/components/BetaLabel/BetaLabel";
import TranslationProvider from "../../../.pro-features/components/WithTranslation/src/TranslationProvider";

export const canViewKeywordsGraph = (diff) => {
    const diffNumber = parseInt(diff.replace("m", ""));
    return diffNumber > 1 || !swSettings.components.WeeklyKeywords.isDisabled;
};

export const canViewDailyKeywordsData = (diff) => {
    const diffNumber = parseInt(diff.replace("m", ""));
    return !swSettings.components.WeeklyKeywords.isDisabled && diffNumber <= 3;
};

export const isDailyKeywordsDataAvailable = (apiStartDate) => {
    const startDate = new Date(apiStartDate.replace(/\|/g, "-") + "T00:00:00");
    const dailyKeywordsInitialDate = new Date(swSettings.getDataIndicators("KEYWORDS_ALGO_CHANGE"));
    return dailyKeywordsInitialDate <= startDate;
};

const TooltipContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: center;
    max-width: 145px;
`;

const TooltipContentText = styled.div`
    text-align: center;
`;

const TooltipContentBeta = styled.div`
    margin-bottom: 5px;
`;

const WidgetUtilityBetaLabelContainer = styled.div`
    position: relative;
    right: -88px;
    bottom: 2px;
`;

const Icon = styled(SWReactIcons)`
    svg {
        path {
            fill: #ffffff;
        }
    }
`;

export const DailyGranularityTooltipContent = ({
    isDailyKeywordsAvailable = true,
    mainContentKey = "keywordAnalysis.granularity.daily.tooltip",
}) => {
    return (
        <GranularityTooltipContent
            isAvailable={isDailyKeywordsAvailable}
            mainContentKey={mainContentKey}
        />
    );
};

export const WeeklyGranularityTooltipContent = ({
    isWeeklyKeywordsAvailable = true,
    mainContentKey = "keywordAnalysis.granularity.weekly.tooltip",
}) => {
    return (
        <GranularityTooltipContent
            isAvailable={isWeeklyKeywordsAvailable}
            mainContentKey={mainContentKey}
        />
    );
};

export const GranularityTooltipContent = ({
    isAvailable,
    mainContentKey,
    lockedContentKey = "keyword.analysis.granularity.weekly.tooltip.disable",
}) => {
    const contentKey = isAvailable ? mainContentKey : lockedContentKey;
    return (
        <TranslationProvider translate={i18nFilter()}>
            <TooltipContentWrapper>
                <TooltipContentBeta>
                    {isAvailable ? (
                        <BetaLabel text="keywordAnalysis.granularity.tooltip.beta" />
                    ) : (
                        <Icon iconName={"locked"} size={"sm"} />
                    )}
                </TooltipContentBeta>
                <TooltipContentText>{i18nFilter()(contentKey)}</TooltipContentText>
            </TooltipContentWrapper>
        </TranslationProvider>
    );
};

export const KeywordsGraphWidgetBetaLabel: React.StatelessComponent<any> = ({ timeGranularity }) =>
    timeGranularity !== "Monthly" && (
        <WidgetUtilityBetaLabelContainer>
            <BetaLabel text="keywordAnalysis.granularity.general.beta" />
        </WidgetUtilityBetaLabelContainer>
    );
