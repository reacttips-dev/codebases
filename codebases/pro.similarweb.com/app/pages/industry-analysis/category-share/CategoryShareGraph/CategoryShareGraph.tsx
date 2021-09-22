import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import { buildCategoryShareGraphConfig } from "./utils/CategoryShareGraphConfig";
import {
    DataTypeSwitcherEnum,
    ICategoryShareGraphApiData,
    ICategoryShareGraphProps,
} from "./CategoryShareGraphTypes";
import {
    buildGraphLegend,
    fetchApiDataForGraph,
    updateLegendItemVisibility,
    resolveDataGranulairtyFromSwitcher,
    updateHiddenDomainsWithTableSelection,
} from "./utils/CategoryShareGraphUtils";
import { GraphContainer } from "pages/industry-analysis/category-share/CategoryShareGraph/CategoryShareGraphStyles";
import { GranularitySwitcherEnum } from "pages/industry-analysis/category-share/CategoryShareGraph/CategoryShareGraphTypes";
import { CategoryShareGraphHeader } from "./components/CategoryShareGraphHeader";
import { CategoryShareGraphBody } from "pages/industry-analysis/category-share/CategoryShareGraph/CategoryShareGraphBody";
import { adaptGraphData } from "./utils/CategoryShareGraphDataAdapter";

const CategoryShareGraph: FC<ICategoryShareGraphProps> = (props) => {
    const { params, services, selectedRows } = props;

    const graphRef = useRef<HTMLDivElement>();
    const setGraphRef = (ref) => (graphRef.current = ref);

    const [isLoading, setIsLoading] = useState(true);
    const [apiData, setApiData] = useState<ICategoryShareGraphApiData>();
    const [hiddenDomains, setHiddenDomains] = useState<string[]>([]);

    const togglesConfig = useMemo(() => {
        const duration = params.duration;
        return {
            // Disables / Enables monthly granularity button. when disabled - the user cannot
            // switch to monthly granularity, and the granularity defaults to daily
            isMonthlyGranularitySupported: duration !== "28d",

            // Disables / Enables month to date toggle. when disabled,
            // the user cannot interact with the MTD toggle and its value defaults to "false"
            isMTDSupported: services.durationService.isMonthToDateSupportedForDuration(duration),

            // MTD Toggle value, used to switch between Month-to-date view and regular view
            isMTDActive: params.mtd === "true",
        };
    }, [params]);

    const [selectedGranularity, setSelectedGranularity] = useState(() => {
        return togglesConfig.isMonthlyGranularitySupported
            ? GranularitySwitcherEnum.MONTHLY
            : GranularitySwitcherEnum.DAILY;
    });
    const [selectedDataType, setSelectedDataType] = useState(DataTypeSwitcherEnum.PERCENT);

    // In case the api data contains more than 10 domains, then we should add a new domain, called "Others"
    // which includes the other domains that can't be displayed on the graph. (the graph can show up to 10 domains at once)
    // NOTE: the others record should appear only when using percentage data.
    const shouldAddOthersRecord = useMemo(() => {
        const isPercent = selectedDataType === DataTypeSwitcherEnum.PERCENT;
        const hasSelectedRows = selectedRows && selectedRows.length > 0;
        const hasApiData = Object.entries(apiData?.Data ?? {}).length > 10;
        return isPercent && hasApiData && hasSelectedRows;
    }, [apiData, selectedDataType, selectedRows]);

    /**
     * Hook for loading graph data from the API
     */
    useEffect(() => {
        const getApiData = async () => {
            setIsLoading(true);
            const dataGranularity = resolveDataGranulairtyFromSwitcher(selectedGranularity);
            const isMTDEnabled = togglesConfig.isMTDSupported && togglesConfig.isMTDActive;

            const graphApiData = await fetchApiDataForGraph(
                params,
                dataGranularity,
                isMTDEnabled,
                services,
            );
            setApiData(graphApiData);
            setIsLoading(false);
        };

        getApiData();
    }, [params, services, selectedGranularity, togglesConfig]);

    /**
     * Hook for refreshing the graph legend, according to the selected table rows.
     * see updateHiddenDomainsWithTableSelection function documentation for more details.
     */
    useEffect(() => {
        const updatedHiddenDomains = updateHiddenDomainsWithTableSelection(
            selectedRows,
            hiddenDomains,
        );
        setHiddenDomains(updatedHiddenDomains);
    }, [selectedRows]);

    const graphConfig = useMemo(() => {
        const { duration, webSource } = params;
        const dataGranularity = resolveDataGranulairtyFromSwitcher(selectedGranularity);
        const isMTDEnabled = togglesConfig.isMTDSupported && togglesConfig.isMTDActive;

        const graphConfigProps = {
            webSource: webSource,
            granularity: dataGranularity,
            dataType: selectedDataType,
            isMonthToDateEnabled: isMTDEnabled,
            duration,
            services,
        };

        return buildCategoryShareGraphConfig(graphConfigProps);
    }, [params, services, selectedGranularity, selectedDataType, togglesConfig]);

    const graphData = useMemo(() => {
        const { webSource, duration } = params;
        const dataGranularity = resolveDataGranulairtyFromSwitcher(selectedGranularity);
        const isMTDEnabled = togglesConfig.isMTDSupported && togglesConfig.isMTDActive;

        const graphDataProps = {
            graphApiData: apiData,
            websource: webSource,
            duration: duration,
            dataGranularity: dataGranularity,
            selectedDataType: selectedDataType,
            selectedTableRows: selectedRows,
            hiddenDomains: hiddenDomains,
            services: services,
            shouldAddOthersRecord: shouldAddOthersRecord,
            isMonthToDateEnabled: isMTDEnabled,
        };

        return adaptGraphData(graphDataProps);
    }, [
        params,
        apiData,
        selectedRows,
        hiddenDomains,
        selectedDataType,
        shouldAddOthersRecord,
        togglesConfig,
    ]);

    const graphLegend = useMemo(() => {
        return buildGraphLegend(selectedRows, hiddenDomains, shouldAddOthersRecord);
    }, [selectedRows, hiddenDomains, shouldAddOthersRecord]);

    const toggleLegendItem = useCallback(
        (legendItem: { name: string }) => {
            const updatedHiddenDomains = updateLegendItemVisibility(hiddenDomains, legendItem);
            setHiddenDomains(updatedHiddenDomains);
        },
        [hiddenDomains, setHiddenDomains],
    );

    const handleMonthToDateToggle = useCallback(
        (isEnabled: boolean) => {
            services.swNavigator.applyUpdateParams({ mtd: isEnabled });
        },
        [services],
    );

    return (
        <GraphContainer>
            <CategoryShareGraphHeader
                selectedDataType={selectedDataType}
                selectedGranularity={selectedGranularity}
                onSelectDataType={(index) => setSelectedDataType(index)}
                onSelectGranularity={(index) => setSelectedGranularity(index)}
                onToggleMonthToDate={handleMonthToDateToggle}
                graphRef={graphRef}
                services={services}
                params={params}
                isMTDSupported={togglesConfig.isMTDSupported}
                isMTDActive={togglesConfig.isMTDActive}
                isMonthlyGranularitySupported={togglesConfig.isMonthlyGranularitySupported}
            />
            <CategoryShareGraphBody
                isLoading={isLoading}
                params={params}
                services={services}
                graphLegend={graphLegend}
                graphData={graphData}
                graphConfig={graphConfig}
                onSetGraphRef={setGraphRef}
                onToggleGraphLegend={toggleLegendItem}
            />
        </GraphContainer>
    );
};

const mapStateToProps = (state, ownProps) => {
    const {
        routing: { params },
        tableSelection,
    } = state;
    return {
        params,
        selectedRows: tableSelection[ownProps.tableStateKey],
    };
};

const connected = connect(mapStateToProps)(CategoryShareGraph);
export default connected;
