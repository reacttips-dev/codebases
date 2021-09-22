import { Button } from "@similarweb/ui-components/dist/button";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import * as _ from "lodash";
import { MarketingWorkspaceOverviewKWTableLegend } from "pages/workspace/marketing/shared/styledComponents";
import * as React from "react";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import BoxSubtitle from "../../../../.pro-features/components/BoxSubtitle/src/BoxSubtitle";
import "../../../../.pro-features/components/Chart/styles/sharedTooltip.scss";
import { StyledHeader } from "../../../../.pro-features/pages/app performance/src/page/StyledComponents";
import StyledBoxSubtitle from "../../../../.pro-features/styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { PrimaryBoxTitle } from "../../../../.pro-features/styled components/StyledBoxTitle/src/StyledBoxTitle";
import { granularities } from "../../../../.pro-features/utils";
import {
    abbrNumberVisitsFilter,
    i18nFilter,
    percentageSignFilter,
} from "../../../filters/ngFilters";
import ArenaApiService from "../../../services/arena/arenaApiService";
import { BoxFooter, StyledBox } from "../../StyledComponents";
import { ArenaLineChart } from "./ArenaLineChart";
import { ArenaVisitsTableContainer } from "./ArenaVisitsTableContainer";
import { ContentContainer } from "./StyledComponents";
import { UtilitiesContainer } from "./UtilitiesContainer";
import { allTrackers } from "../../../services/track/track";

export interface IArenaVisitsContainerProps {
    title: string;
    titleTooltip: string;
    filters: any;
    isPreferencesLoading: boolean;
    isPdf: boolean;
    country: number;
    getCountryById: any;
    sitesForLegend: any;
}

export interface IArenaVisitsContainerState {
    unbounceVisitsOnly: boolean;
    selectedGranularityIndex: number;
    selectedVisualizationIndex: number;
    isLoading: boolean;
}

export interface IArenaVisitsContainerHooksState {
    unbounceVisitsOnly: boolean;
    selectedGranularityIndex: number;
    selectedVisualizationIndex: number;
    isLoading: boolean;
    tableData: any;
    graphData: any;
}

export function usePrevious(value) {
    const ref = useRef({});
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}
export const ArenaVisitsContainer: FunctionComponent<IArenaVisitsContainerProps> = ({
    ...props
}) => {
    const unbounceVisitsTitle = "arena.visits.unbounce.checkbox.label";
    const unbounceVisitsTitleTooltip = "arena.visits.unbounce.checkbox.label.tooltip";
    const arenaApi = new ArenaApiService();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [unbounceVisitsOnly, setUnbouncedVisitsFlag] = useState(false);
    const [selectedGranularityIndex, setGranularity] = useState(2);
    const [selectedVisualizationIndex, setVisual] = useState(1);
    const [tableData, setTableData] = useState({});
    const [graphData, setGraphData] = useState({});

    const fetchDomainsHeader = async () => {
        const domains = props.filters.domains.map((d) => d.domain);
        const headers = await arenaApi.getDomainsHeader({ domains });
        return headers;
    };

    const fetchTableData = async (headers) => {
        try {
            const tableData = await arenaApi.getEngagementVisitsTable({ ...props.filters });
            const data = tableData.Data.map((item) => {
                return {
                    ...item,
                    country: props.filters.country,
                    duration: props.filters.duration,
                    webSource: props.filters.webSource,
                    includeSubDomains: props.filters.includeSubDomains,
                    showGAIcon:
                        props.filters.ShouldGetVerifiedData && headers[item.Site].hasGaToken,
                    isGAPrivate: headers[item.Site].privacyStatus === "private",
                };
            });

            setTableData({ ...tableData, Data: data });
        } catch (error) {
            setTableData({});
        }
    };

    const fetchGraphData = async () => {
        const { webSource } = props.filters;
        try {
            const graphData = await arenaApi.getEngagementVisitsGraph({
                ...props.filters,
                timeGranularity: granularities[selectedGranularityIndex],
            });
            const formattedData = Object.keys(graphData.Data).reduce((acc, domain) => {
                acc[domain] = graphData.Data[domain][webSource];
                return acc;
            }, {});
            setGraphData(formattedData);
        } catch (error) {
            setGraphData({});
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        const headers = await fetchDomainsHeader();
        await Promise.all([fetchGraphData(), fetchTableData(headers)]);
        setIsLoading(false);
    };

    const previous: any = usePrevious({ props, selectedGranularityIndex });

    useEffect(() => {
        if (
            !_.isEqual(props.filters, previous.props ? previous.props.filters : undefined) ||
            selectedGranularityIndex !== previous.selectedGranularityIndex
        ) {
            fetchData();
        }
    }, [selectedGranularityIndex, props.filters]);

    const onBounceVisitsOnlyChange = () => {
        allTrackers.trackEvent(
            "Checkbox",
            unbounceVisitsOnly ? "remove" : "add",
            "visits over time/only unbounced visits",
        );
        setUnbouncedVisitsFlag(!unbounceVisitsOnly);
    };

    const onGranularitiesClick = (selectedGranularityIndex) => {
        allTrackers.trackEvent(
            "Granularity Button",
            granularities[selectedGranularityIndex],
            "visits over time/granularity",
        );
        setGranularity(selectedGranularityIndex);
    };

    const onVisualizationClick = (selectedVisualizationIndex) => {
        allTrackers.trackEvent(
            "Visual Button",
            selectedVisualizationIndex === 0 ? "percentage" : "number",
            "visits over time/visual",
        );
        setVisual(selectedVisualizationIndex);
    };

    const render = () => {
        const {
            title,
            titleTooltip,
            filters,
            isPreferencesLoading,
            isPdf,
            country,
            getCountryById,
            sitesForLegend,
        } = props;
        const { from, to, webSource } = filters;
        const subtitleFilters = [
            {
                filter: "date",
                value: {
                    from,
                    to,
                },
            },
            {
                filter: "webSource",
                value: webSource || "Desktop", // values: available: 'Total' / 'MobileWeb'
            },
            {
                filter: "country",
                countryCode: country,
                value: getCountryById(country).text,
            },
        ];
        const learnMoreLink = Injector.get<SwNavigator>("swNavigator").href(
            "websites-worldwideOverview",
            {
                ...filters,
                key: filters.keys,
            },
        );
        const utilitiesProps = {
            unbounceVisitsOnly,
            onBounceVisitsOnlyChange,
            unbounceVisitsTitle,
            unbounceVisitsTitleTooltip,
            selectedGranularityIndex,
            selectedVisualizationIndex,
            onGranularitiesClick,
            onVisualizationClick,
        };
        const selectedData = Object.keys(graphData).reduce((acc, domain) => {
            acc[domain] = graphData[domain][unbounceVisitsOnly ? 1 : 0];
            return acc;
        }, {});

        return (
            <StyledBox data-automation-arena-visits={true}>
                <StyledHeader>
                    <PrimaryBoxTitle tooltip={i18nFilter()(titleTooltip)}>
                        {i18nFilter()(title)}
                    </PrimaryBoxTitle>
                    <StyledBoxSubtitle>
                        <BoxSubtitle filters={subtitleFilters} />
                    </StyledBoxSubtitle>
                    {isPdf && <MarketingWorkspaceOverviewKWTableLegend sites={sitesForLegend} />}
                </StyledHeader>
                <ContentContainer>
                    <UtilitiesContainer {...utilitiesProps} />
                    <ArenaLineChart
                        {...{
                            isLoading: isLoading || isPreferencesLoading,
                            selectedVisualizationIndex,
                            selectedGranularity: granularities[selectedGranularityIndex],
                            graphData: selectedData,
                            filter: [
                                selectedVisualizationIndex === 0
                                    ? percentageSignFilter
                                    : abbrNumberVisitsFilter,
                                1,
                            ],
                        }}
                    />
                    <ArenaVisitsTableContainer {...{ isLoading, tableData, unbounceVisitsOnly }} />
                </ContentContainer>
                <BoxFooter>
                    <a href={learnMoreLink}>
                        <Button type="flat">
                            {i18nFilter()("workspace.arena.visits_over_time.learn_more.button")}
                        </Button>
                    </a>
                </BoxFooter>
            </StyledBox>
        );
    };

    return render();
};
