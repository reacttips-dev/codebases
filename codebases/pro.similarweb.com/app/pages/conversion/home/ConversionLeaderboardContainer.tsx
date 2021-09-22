import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { swSettings } from "common/services/swSettings";
import { ConversionSegmentsUtils } from "pages/conversion/ConversionSegmentsUtils";
import * as React from "react";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import BoxTitle from "../../../../.pro-features/components/BoxTitle/src/BoxTitle";
import { CheckboxContainer } from "../../../../.pro-features/pages/conversion/components/ConversionScatterChart/StyledComponents";
import { TilesContainer } from "../../../../.pro-features/pages/conversion/Homepage/src/StyledComponents";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { i18nFilter } from "../../../filters/ngFilters";
import ConversionApiService from "../../../services/conversion/conversionApiService";
import { ISegmentsData } from "../../../services/conversion/ConversionSegmentsService";
import DurationService, { IDurationData } from "../../../services/DurationService";
import {
    TopConversionConfig,
    TopGrowingConfig,
    TopStickynessConfig,
} from "./ConversionLeaderboardsTableConfig";
import ConversionLeaderboardTableContainer from "./ConversionLeaderboardTableContainer";
import { StyledLeaderboardsHeaderContainer, StyledPrimaryTitle } from "./StyledComponents";
import { allTrackers } from "../../../services/track/track";

export interface IConversionLeaderboardTableContainerProps {
    segments: ISegmentsData;
    industries: any;
}

export const ConversionLeaderboardContainer: FunctionComponent<IConversionLeaderboardTableContainerProps> = ({
    segments,
}) => {
    const conversionLeaderboardTableHeader = "conversion.home.leaderboard.tables.header";
    const conversionLeaderboardTableHeaderTooltip =
        "conversion.home.leaderboard.tables.header.tooltip";
    const conversionExcludeCheckboxLabel =
        "conversion.home.leaderboard.exclude.mega.retailers.label";
    const conversionApi = new ConversionApiService();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [excludeMegaRetailers, setExcludeMegaRetailers] = useState(false);
    const [topConversionTable, setTopConversionTable] = useState({});
    const [topGrowthYOYConversionTable, setTopGrowthYOYConversionTable] = useState({});
    const [topStickynessConversionTable, setTopStickynessConversionTable] = useState({});
    const durationData: IDurationData = DurationService.getDurationData(
        "1m",
        undefined,
        swSettings.getCurrentComponent().componentId,
    );
    const topCountryCode = useMemo(() => {
        const topCountryCode = ConversionSegmentsUtils.getSegmentsDefaultUserCountry(
            Object.values(segments.segments),
        );
        return Number.parseInt(topCountryCode);
    }, [segments]);
    const filters = {
        country: topCountryCode,
        webSource: "Desktop",
        from: durationData.forAPI.from,
        to: durationData.forAPI.to,
        excludedIndustry: excludeMegaRetailers ? "big box" : undefined,
    };
    const fetchTopConversionTable = async () => {
        try {
            const tableData = await conversionApi.getTopConversionTable(filters);
            setTopConversionTable(tableData);
        } catch (error) {
            setTopConversionTable({});
        }
    };

    const fetchTopGrowthYOYConversionTable = async () => {
        try {
            const tableData = await conversionApi.getTopGrowthYOYConversionTable(filters);
            setTopGrowthYOYConversionTable(tableData);
        } catch (error) {
            setTopGrowthYOYConversionTable({});
        }
    };

    const fetchTopStickynessConversionTable = async () => {
        try {
            const tableData = await conversionApi.getTopSticknessConversionTable(filters);
            setTopStickynessConversionTable(tableData);
        } catch (error) {
            setTopStickynessConversionTable({});
        }
    };
    const fetchData = async () => {
        setIsLoading(true);
        await Promise.all([
            fetchTopConversionTable(),
            fetchTopGrowthYOYConversionTable(),
            fetchTopStickynessConversionTable(),
        ]);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [excludeMegaRetailers]);

    const onExcludeMegaRetailers = () => {
        allTrackers.trackEvent(
            "check box",
            "click",
            `Top performing/Exclude mega retailers/${!excludeMegaRetailers ? "Check" : "Hide"}`,
        );
        setExcludeMegaRetailers(!excludeMegaRetailers);
    };

    const commonTableProps = { isLoading, filters };
    const yoyCommonTableProps = { isLoading, filters: { ...filters } };
    const render = () => {
        return (
            <>
                <StyledLeaderboardsHeaderContainer data-automation-conversion-leaderboards={true}>
                    <StyledPrimaryTitle>
                        <BoxTitle tooltip={i18nFilter()(conversionLeaderboardTableHeader)}>
                            {i18nFilter()(conversionLeaderboardTableHeaderTooltip)}
                        </BoxTitle>
                    </StyledPrimaryTitle>
                    {/*remove support for exclude big box industry*/}
                    {/*<CheckboxContainer>*/}
                    {/*    <Checkbox*/}
                    {/*        selected={excludeMegaRetailers}*/}
                    {/*        label={i18nFilter()(conversionExcludeCheckboxLabel)}*/}
                    {/*        onClick={onExcludeMegaRetailers}/>*/}
                    {/*</CheckboxContainer>*/}
                </StyledLeaderboardsHeaderContainer>
                <TilesContainer>
                    <ConversionLeaderboardTableContainer
                        {...commonTableProps}
                        tableHeader={"conversion.home.leaderboard.top.conversion.table.header"}
                        tableHeaderTooltip={
                            "conversion.home.leaderboard.top.conversion.table.tooltip"
                        }
                        tableData={topConversionTable}
                        tableBaseConfig={TopConversionConfig}
                        sortedColumn={{ field: "ConversionRate" }}
                    />
                    <ConversionLeaderboardTableContainer
                        {...yoyCommonTableProps}
                        tableHeader={"conversion.home.leaderboard.most.improving.table.header"}
                        tableHeaderTooltip={
                            "conversion.home.leaderboard.most.improving.table.tooltip"
                        }
                        tableData={topGrowthYOYConversionTable}
                        tableBaseConfig={TopGrowingConfig}
                        sortedColumn={{ field: "Growth" }}
                    />
                    <ConversionLeaderboardTableContainer
                        {...commonTableProps}
                        tableHeader={"conversion.home.leaderboard.highest.stickiness.table.header"}
                        tableHeaderTooltip={
                            "conversion.home.leaderboard.highest.stickiness.table.tooltip"
                        }
                        tableData={topStickynessConversionTable}
                        tableBaseConfig={TopStickynessConfig}
                        sortedColumn={{ field: "Stickiness" }}
                    />
                </TilesContainer>
            </>
        );
    };

    return render();
};
