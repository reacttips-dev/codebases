import { BetaLabel } from "components/BetaLabel/BetaLabel";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { i18nFilter } from "filters/ngFilters";
import {
    Link,
    NoInsightsSubTitle,
    StyledInfoIcon,
    Title,
    TitlesWrapper,
} from "pages/website-analysis/traffic-sources/mmx/components/InsightsAssistant/StyledComponents";
import * as React from "react";

export const InsightsTitle = (props) => {
    const {
        isExpandDisabled = false,
        showSmallRangeTitle = false,
        changeDatePickerRange,
        keys,
    } = props;
    const { title, titleTooltip, noInsights, noInsightsSubtitle, datePickLink } = keys;
    const i18n = i18nFilter();
    return (
        <TitlesWrapper>
            <Title>{i18n(title)}</Title>
            <PlainTooltip placement="top" text={i18n(titleTooltip)}>
                <span>
                    <StyledInfoIcon iconName="info" />
                </span>
            </PlainTooltip>
            <BetaLabel />
            {isExpandDisabled &&
                (showSmallRangeTitle ? (
                    <>
                        <NoInsightsSubTitle>{i18n(noInsights)}</NoInsightsSubTitle>
                        &nbsp;
                        <Link onClick={changeDatePickerRange}>{i18n(datePickLink)}</Link>
                    </>
                ) : (
                    <NoInsightsSubTitle>{i18n(noInsightsSubtitle)}</NoInsightsSubTitle>
                ))}
        </TitlesWrapper>
    );
};
