import {
    abbrNumberVisitsFilter,
    i18nFilter,
    minVisitsAbbrFilter,
    percentageSignFilter,
    roundNumberFilter,
} from "filters/ngFilters";
import * as React from "react";
import frameStates from "components/React/widgetFrames/frameStates";
import { FC } from "react";
import SimpleFrame from "components/React/widgetFrames/simpleFrame";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import styled, { css } from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";

const i18n = i18nFilter();
const percentageFilter = percentageSignFilter();
const abbrNumberVisits = abbrNumberVisitsFilter();
const minVisitsAbbr = minVisitsAbbrFilter();

const Container = styled.div<{ dashboard?: boolean }>`
    background: ${rgba(colorsPalettes.carbon[25], 0.5)};
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0 0 24px;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
    ${({ dashboard }) =>
        dashboard &&
        css`
            height: auto;
            margin-top: 40px;
            background: transparent;
            padding: 0;
            justify-content: space-between;
            ${Item} {
                padding: 0;
                margin-right: 0;
            }
        `}
`;

const Item = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
    padding: 0;
    margin-right: 160px;
    @media (max-width: 1480px) {
        margin-right: 100px;
    }
    @media (max-width: 1280px) {
        margin-right: 80px;
    }
`;

const NumberComponent = (props) => {
    const { loading, children } = props;
    if (loading) {
        return <PixelPlaceholderLoader width={70} height={20} />;
    } else {
        return <Number>{children}</Number>;
    }
};

const Number = styled.span`
    ${setFont({ $size: 20, $color: colorsPalettes.carbon[500] })}
`;

const Text = styled.div`
    ${setFont({ $size: 14, $color: rgba(colorsPalettes.carbon[500], 0.6) })};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
`;

const Loader = styled(PixelPlaceholderLoader)`
    height: 44px;
    width: 100%;
`;

export const OnLoaded: React.FC<any> = ({
    organic,
    paid,
    total,
    percentage,
    webSource,
    isLoading,
    dashboard = false,
    filters,
}) => {
    // SIM-29829: only show the "percentage from desktop visits" if there is at least 1 filter applied
    const {
        ExcludeTerms,
        IncludeTerms,
        IncludeOrganic,
        IncludePaid,
        IncludeBranded,
        IncludeNoneBranded,
        IncludeNewKeywords,
        IncludeTrendingKeywords,
        IncludeQuestions,
        source,
        family,
        limits,
    } = filters;
    const showPercentageFromDesktopVisits =
        ExcludeTerms ||
        IncludeTerms ||
        IncludeOrganic ||
        IncludePaid ||
        IncludeBranded ||
        IncludeNoneBranded ||
        IncludeNewKeywords ||
        IncludeTrendingKeywords ||
        IncludeQuestions ||
        source ||
        family ||
        limits ||
        dashboard;
    return (
        <>
            <Container dashboard={dashboard} data-automation="search-keywords-overview">
                <PlainTooltip
                    tooltipContent={i18nFilter()("keyword.overview.total.tooltip")}
                    enabled={!total}
                >
                    <Item data-automation="search-visits">
                        <NumberComponent loading={isLoading}>
                            {roundNumberFilter()(total)}
                        </NumberComponent>
                        <Text>
                            {i18n(
                                webSource === "Desktop"
                                    ? "analysis.source.search.keywords.header.searchvisits"
                                    : "analysis.source.search.keywords.header.searchvisits.mobile",
                            )}
                        </Text>
                    </Item>
                </PlainTooltip>
                {showPercentageFromDesktopVisits && (
                    <PlainTooltip
                        tooltipContent={i18nFilter()("keyword.overview.mobile.search.tooltip")}
                        enabled={!percentage}
                    >
                        <Item data-automation="percents-from-total-searches">
                            <NumberComponent loading={isLoading}>
                                {percentageFilter(percentage)}
                            </NumberComponent>
                            <Text>
                                {i18n(
                                    webSource === "Desktop"
                                        ? "analysis.source.search.keywords.header.searchvisitsprecentage"
                                        : "analysis.source.search.keywords.header.searchvisitsprecentage.mobile",
                                )}
                            </Text>
                        </Item>
                    </PlainTooltip>
                )}
                {webSource === "Desktop" ? (
                    <Item data-automation="organic-search-keywords">
                        <NumberComponent loading={isLoading}>
                            {abbrNumberVisits(organic)}
                        </NumberComponent>
                        <Text
                            dangerouslySetInnerHTML={{
                                __html: i18n("analysis.source.search.keywords.header.organic"),
                            }}
                        />
                    </Item>
                ) : null}
                {webSource === "Desktop" ? (
                    <Item data-automation="paid-search-keywords">
                        <NumberComponent loading={isLoading}>
                            {abbrNumberVisits(paid)}
                        </NumberComponent>
                        <Text
                            dangerouslySetInnerHTML={{
                                __html: i18n("analysis.source.search.keywords.header.paid"),
                            }}
                        />
                    </Item>
                ) : null}
            </Container>
        </>
    );
};
OnLoaded.defaultProps = {
    filters: {},
};

export const KeywordsOverviewHeader: FC<any> = (props) => {
    const { isFetching, noData, dashboard, filters } = props;
    const isLoading = isFetching;
    const state = frameStates.Loaded;
    if (noData) {
        return null;
    }
    return (
        <>
            <SimpleFrame
                state={state}
                onError={false}
                className="keywords-table-overview-single"
                onLoaded={<OnLoaded {...{ ...props, isLoading, dashboard, filters }} />}
            />
        </>
    );
};

SWReactRootComponent(KeywordsOverviewHeader, "KeywordsOverviewHeader");
