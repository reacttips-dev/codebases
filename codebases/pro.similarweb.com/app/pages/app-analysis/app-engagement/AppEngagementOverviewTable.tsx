import React, { useEffect, useMemo } from "react";
import { chosenItems } from "common/services/chosenItems";
import AppEngagementServiceApi from "./AppEngagementServiceApi";
import { SwNavigator } from "common/services/swNavigator";
import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import { useLoading } from "custom-hooks/loadingHook";
import { useSelector } from "react-redux";
import { AppTooltipCell } from "components/React/Table/cells/AppTooltipCell";
import {
    TableWrapper,
    StyledTableHeader,
    StyledAddToDashboardButton,
    CustomStyledPrimaryTitle,
    CircleElement,
} from "./styledComponents";
import CountryService from "services/CountryService";
import DurationService from "services/DurationService";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import { MiniFlexTable } from "components/React/Table/FlexTable/Mini/MiniFlexTable";
import { options, column } from "components/React/Table/SWReactTableDefaults";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";
import { TableLoader } from "../../../components/React/Table/FlexTable/Big/FlexTableStatelessComponents";

export const getTableConfig = () => {
    return {
        columns: [
            column({
                field: "App",
                displayName: i18nFilter()("appanalysis.engagement.overview.table.compare.app"),
                cellComponent: AppTooltipCell,
                sortable: false,
                minWidth: 150,
                visible: true,
            }),
            column({
                field: "CurrentInstalls",
                displayName: i18nFilter()("apps.engagementoverview.tabs.currentinstalls.title"),
                cellTemplate: "leader-default-cell",
                format: "percentagesign:2",
                sortable: true,
                headerCellTemplate: "leader-default-header-cell",
                cellClass: "leaders-cell",
                tooltip: "apps.engagementoverview.tabs.currentinstalls.tooltip",
            }),
            column({
                field: "Downloads",
                displayName: "appanalysis.engagement.overview.table.compare.downloads",
                cellTemplate: "leader-default-cell",
                format: "abbrNumberVisits",
                sortable: true,
                headerCellTemplate: "leader-default-header-cell",
                inverted: true,
                cellClass: "leaders-cell",
                tooltip: "apps.engagementoverview.tabs.downloads.tooltip",
            }),
            column({
                field: "DailyActiveUsers",
                displayName: i18nFilter()("apps.engagementoverview.table.dau.title"),
                cellTemplate: "leader-default-cell",
                format: "abbrNumberVisits",
                sortable: true,
                headerCellTemplate: "leader-default-header-cell",
                cellClass: "leaders-cell",
                tooltip: "apps.engagementoverview.table.dau.tooltip.ud",
                minWidth: 80,
            }),
            column({
                field: "MonthlyActiveUsers",
                displayName: i18nFilter()("apps.engagementoverview.table.mau.title"),
                cellTemplate: "leader-default-cell",
                format: "abbrNumberVisits",
                sortable: true,
                headerCellTemplate: "leader-default-header-cell",
                cellClass: "leaders-cell",
                tooltip: "apps.engagementoverview.table.mau.tooltip.ud",
                minWidth: 80,
            }),
            column({
                field: "UniqueInstalls",
                displayName: i18nFilter()("apps.engagementoverview.table.unique.installs.title"),
                cellTemplate: "leader-default-cell",
                format: "abbrNumberVisits",
                sortable: true,
                headerCellTemplate: "leader-default-header-cell",
                cellClass: "leaders-cell",
                tooltip: "apps.engagementoverview.table.unique.installs.tooltip",
                minWidth: 80,
            }),
        ],
        options: options({
            tableType: "swTable--simple",
            showTitle: true,
            showTitleTooltip: true,
            titleType: "text",
            showSubtitle: true,
            showLegend: false,
            preserveLegendSpace: false,
            showSettings: false,
            showTopLine: false,
            showFrame: true,
            titleClass: "page-widget-title",
            emptyResults: false,
        }),
    };
};

export const AppEngagementOverviewTable = () => {
    // const { appId, country, duration, granularity, key, tab } = props;
    const dataConfig = getTableConfig();
    const { columns, options } = dataConfig;

    const services = React.useMemo(
        () => ({
            apiService: AppEngagementServiceApi.getInstance(),
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            i18n: i18nFilter(),
        }),
        [],
    );

    const params = useSelector((state) => {
        const {
            routing: { params },
        } = state;
        return params;
    });

    const [tableData, tableDataOps] = useLoading();
    const isCompare = chosenItems.length > 1;

    React.useEffect(() => {
        tableDataOps.load(() => {
            const apiParams = services.swNavigator.getApiParams({
                ...params,
                keys: chosenItems.map((ch) => ch.Id).join(","),
            });

            return services.apiService.fetchAppEngagementTableData(apiParams);
        });
    }, []);

    const { from, to } = DurationService.getDurationData(params.duration).forAPI;

    const subtitleFilters = [
        {
            filter: "date",
            value: {
                from,
                to,
            },
        },
        {
            filter: "country",
            countryCode: params.country,
            value: CountryService.getCountryById(params.country).text,
        },
    ];

    // Add To Dashboard:
    const AddToDashboard = ({ metric, type, webSource, filters, overrideParams = {} }) => {
        const getCustomModel = (metric, type, webSource, filters) => {
            const widget = Injector.get<any>("widgetModelAdapterService").fromMobile(
                metric,
                type,
                webSource,
                filters,
            );
            return { ...widget, ...overrideParams };
        };

        let addToDashboardModal = { dismiss: () => null };
        useEffect(() => () => addToDashboardModal.dismiss(), [addToDashboardModal]);

        const a2d = () => {
            const $modal = Injector.get<any>("$modal");
            addToDashboardModal = $modal.open({
                animation: true,
                controller: "widgetAddToDashboardController as ctrl",
                templateUrl: "/app/components/widget/widget-add-to-dashboard-modal.html",
                windowClass: "add-to-dashboard-modal",
                resolve: {
                    widget: () => null,
                    customModel: () => getCustomModel(metric, type, webSource, filters),
                },
                scope: Injector.get<any>("$rootScope").$new(true),
            });
        };
        return <StyledAddToDashboardButton onClick={() => a2d()} />;
    };

    const isLoading = [useLoading.STATES.INIT, useLoading.STATES.LOADING].includes(tableData.state);

    const isEmptyData = useMemo(() => {
        const { data } = tableData;
        let isEmptyDataFlag = true;

        if (isLoading) {
            return false;
        }
        if (!data) {
            return true;
        } else {
            const dataTotal = tableData.data?.Data;

            isEmptyDataFlag = dataTotal.every((dataElement) => {
                return !dataElement.Downloads.Value;
            });

            return isEmptyDataFlag;
        }
    }, [isLoading]);

    const records = React.useMemo(() => {
        return { Records: tableData?.data?.Data };
    }, [tableData.data]);

    return (
        <>
            {tableData.data && columns && isCompare && (
                <TableWrapper>
                    <StyledTableHeader>
                        <div>
                            <CustomStyledPrimaryTitle>
                                <BoxTitle tooltip={i18nFilter()("wa.ao.engagement.tooltip")}>
                                    {i18nFilter()("wa.ao.engagement.table.header")}
                                </BoxTitle>
                            </CustomStyledPrimaryTitle>
                            <StyledBoxSubtitle>
                                <BoxSubtitle filters={subtitleFilters} />
                            </StyledBoxSubtitle>
                        </div>

                        {isLoading ? (
                            <CircleElement>
                                <PixelPlaceholderLoader
                                    width={24}
                                    height={24}
                                    className="px-lod lod-100"
                                />
                            </CircleElement>
                        ) : (
                            !isEmptyData && (
                                <AddToDashboard
                                    metric={"AppEngagementOverviewRealNumbers"}
                                    type={"AppEngagementOverviewTable"}
                                    webSource={undefined}
                                    filters={{
                                        ShouldGetVerifiedData: undefined,
                                        filter: undefined,
                                        timeGranularity: params.granularity,
                                    }}
                                />
                            )
                        )}
                    </StyledTableHeader>
                    {isLoading ? (
                        <TableLoader rowNum={5} />
                    ) : isEmptyData ? (
                        <TableNoData
                            icon="no-data"
                            messageTitle={i18nFilter()("global.nodata.notavilable")}
                        />
                    ) : (
                        <MiniFlexTable
                            tableData={records}
                            tableColumns={columns}
                            tableOptions={options}
                        />
                    )}
                </TableWrapper>
            )}
        </>
    );
};
