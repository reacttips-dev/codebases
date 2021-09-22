import React from "react";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { IconButton } from "@similarweb/ui-components/dist/button/src/IconButton";
import { PrimaryBoxTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { categoryIconFilter } from "filters/ngFilters";
import { ArrowIcon } from "pages/workspace/sales/components/ArrowIcon/ArrowIcon";
import {
    StyledBenchmarkSummaryContainer,
    StyledBenchmarkSummary,
} from "../../../../../benchmarks/components/BenchmarkSummary/styles";
import BenchmarkSummaryItem from "../../../../../benchmarks/components/BenchmarkSummary/BenchmarkSummaryItem";
import {
    SITE_INFO_NETWORKS_TITLE,
    SITE_INFO_NETWORKS_ITEM1_TEXT,
    SITE_INFO_NETWORKS_ITEM2_TEXT,
    SITE_INFO_NETWORKS_ITEM3_TEXT,
    SITE_INFO_NETWORKS_ITEM1_TOOLTIP,
    SITE_INFO_NETWORKS_ITEM2_TOOLTIP,
    SITE_INFO_NETWORKS_ITEM3_TOOLTIP,
    SITE_INFO_NETWORKS_BADGE_RANK_TOOLTIP,
    SIDEBAR_TAB_ABOUT_LINK_TO_SITE_TRENDS,
} from "../../../../constants";
import {
    TitleContainer,
    BadgeContainer,
    Badge,
    StyledDescription,
    IconContainer,
    StyledLink,
    CategoryContainer,
} from "./styles";
import { TSiteInfoProps } from "../../../../types/siteInfo";
import { CardContainer } from "../../styles";
import { replaceUnderscores } from "../../../../helpers";
import { formatWithAbbrNumbers, formatWithPercents, calcColorFromValue } from "../../utils";
import { NO_DATA } from "../../consts";
import { withCalcTooltip } from "../../../../utils/withCalcTooltip";

export const SiteInfo = ({
    info: { category, description, functionality, monthlyVisits, rank, visitsMoM, visitsYoY },
    linkToTrends,
    isSales,
}: TSiteInfoProps): JSX.Element => {
    const translate = useTranslation();

    const formatSiteInfo = (value: number) => formatWithPercents(value, 1);

    const colorMom = calcColorFromValue(visitsMoM);
    const colorYoy = calcColorFromValue(visitsYoY);

    const valueYoy = formatSiteInfo(Math.abs(visitsYoY));
    const yoyLabel = visitsYoY ? `${valueYoy}%` : NO_DATA;

    const valueMom = formatSiteInfo(Math.abs(visitsMoM));
    const momLabel = visitsMoM ? `${valueMom}%` : NO_DATA;

    const visitsLabel = monthlyVisits ? formatWithAbbrNumbers(monthlyVisits) : NO_DATA;
    const rankLabel = rank ? `#${rank}` : NO_DATA;

    return (
        <>
            <CardContainer className="siteInfo">
                <TitleContainer>
                    <PrimaryBoxTitle>{translate(SITE_INFO_NETWORKS_TITLE)}</PrimaryBoxTitle>
                </TitleContainer>
                <BadgeContainer>
                    {category && (
                        <Badge>
                            <IconContainer>
                                <i
                                    className={`sprite-category u-right-padding-6 ${categoryIconFilter()(
                                        category,
                                    )}`}
                                />
                            </IconContainer>
                            {withCalcTooltip(category, CategoryContainer, 4, 200, {
                                isBreak: !isSales,
                            })}
                        </Badge>
                    )}
                    {rankLabel && (
                        <PlainTooltip
                            placement="top"
                            tooltipContent={translate(SITE_INFO_NETWORKS_BADGE_RANK_TOOLTIP)}
                        >
                            <Badge>{rankLabel}</Badge>
                        </PlainTooltip>
                    )}
                    {functionality && <Badge>{replaceUnderscores(functionality)}</Badge>}
                </BadgeContainer>
                <StyledDescription>{description}</StyledDescription>
                <StyledBenchmarkSummaryContainer>
                    <StyledBenchmarkSummary>
                        <BenchmarkSummaryItem
                            align="flex-start"
                            text={translate(SITE_INFO_NETWORKS_ITEM1_TEXT)}
                            value={visitsLabel}
                            dataAutomation="about-tab-Monthly-visits"
                            infoTooltipText={translate(SITE_INFO_NETWORKS_ITEM1_TOOLTIP)}
                        />
                        <BenchmarkSummaryItem
                            customIcon={<ArrowIcon value={visitsYoY} />}
                            align="center"
                            valueColor={colorYoy}
                            text={translate(SITE_INFO_NETWORKS_ITEM2_TEXT)}
                            value={yoyLabel}
                            dataAutomation="about-tab-YoY-visits"
                            infoTooltipText={translate(SITE_INFO_NETWORKS_ITEM2_TOOLTIP)}
                        />
                        <BenchmarkSummaryItem
                            customIcon={<ArrowIcon value={visitsMoM} />}
                            align="flex-end"
                            valueColor={colorMom}
                            text={translate(SITE_INFO_NETWORKS_ITEM3_TEXT)}
                            dataAutomation="about-tab-YoY-visits"
                            value={momLabel}
                            infoTooltipText={translate(SITE_INFO_NETWORKS_ITEM3_TOOLTIP)}
                        />
                    </StyledBenchmarkSummary>
                </StyledBenchmarkSummaryContainer>
                <StyledLink>
                    <IconButton
                        type="flat"
                        iconName="arrow-right"
                        placement="right"
                        onClick={linkToTrends}
                    >
                        {translate(`${SIDEBAR_TAB_ABOUT_LINK_TO_SITE_TRENDS}`)}
                    </IconButton>
                </StyledLink>
            </CardContainer>
        </>
    );
};
