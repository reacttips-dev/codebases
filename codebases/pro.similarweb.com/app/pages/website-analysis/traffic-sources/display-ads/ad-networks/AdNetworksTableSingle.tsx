import { swSettings } from "common/services/swSettings";
import { DefaultCell, IndexCell, TrafficShare } from "components/React/Table/cells";
import { DefaultCellHeader } from "components/React/Table/headerCells";
import SWReactTableWrapper from "components/React/Table/SWReactTableWrapper";
import { i18nFilter } from "filters/ngFilters";
import * as queryString from "query-string";
import * as React from "react";
import { FC, useEffect } from "react";
import { AdNetworksTableTop } from "pages/website-analysis/traffic-sources/display-ads/ad-networks/AdNetworksTableTop";
import { apiHelper } from "common/services/apiHelper";
import { IAdNetworksTableProps } from "pages/website-analysis/traffic-sources/display-ads/ad-networks/AdNetworksContainer";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

export const AdNetworksTableSingle: FC<IAdNetworksTableProps> = (props) => {
    const {
        i18n,
        applyUpdateParams,
        rootScopeNew,
        openModal,
        widgetModelAdapterServiceFromWebsite,
    } = props;
    const { webSource, sort, adNetwork } = props.params;
    let addToDashboardModal = { dismiss: () => null };

    useEffect(() => {
        return () => {
            addToDashboardModal.dismiss();
        };
    }, [addToDashboardModal]);

    let field = "Share";
    let sortDirection = "desc";
    if (sort) {
        [field, sortDirection] = sort.split(" ");
    }
    const columns = [
        {
            fixed: true,
            cellComponent: IndexCell,
            disableHeaderCellHover: true,
            sortable: false,
            width: 46,
            isResizable: false,
        },
        {
            field: "Name",
            fixed: true,
            displayName: i18nFilter()("analysis.source.ad.networks.table.columns.network.title"),
            sortable: true,
            cellComponent: DefaultCell,
            showTotalCount: true,
            width: 400,
        },
        {
            field: "Share",
            displayName: i18n("analysis.source.ad.networks.table.columns.share.title"),
            cellComponent: TrafficShare,
            sortable: true,
            isResizable: false,
        },
    ].map((col: any) => {
        const isSorted = col.field === field;
        return {
            ...col,
            visible: col.visible !== false,
            headerComponent: col.headerComponent || DefaultCellHeader,
            isSorted,
            sortDirection,
            isResizable: col.isResizable !== false,
        };
    });

    const onSort = ({ field, sortDirection }) => {
        applyUpdateParams({
            sort: `${field} ${sortDirection}`,
        });
    };

    const downloadExcelPermitted = swSettings.current.resources.IsExcelAllowed;

    const getExcelUrl = () => {
        const queryStringParams = queryString.stringify(getInitialFilters(props.params));
        return `/export/analysis/GetTrafficDisplayAdvertisingAdsTsv?${queryStringParams}`;
    };

    const a2d = () => {
        addToDashboardModal = openModal({
            animation: true,
            controller: "widgetAddToDashboardController as ctrl",
            templateUrl: "/app/components/widget/widget-add-to-dashboard-modal.html",
            windowClass: "add-to-dashboard-modal",
            resolve: {
                widget: () => null,
                customModel: () => getCustomModel("DashboardAdNetworks", "Table", webSource),
            },
            scope: rootScopeNew(true),
        });
    };

    const getCustomModel = (metric, type, webSource) =>
        widgetModelAdapterServiceFromWebsite(metric, type, webSource);

    const onSearch = (value) => {
        TrackWithGuidService.trackWithGuid("display_ads.ad_networks.table.search", "click", {
            term: value,
        });

        applyUpdateParams({
            adNetwork: value,
        });
    };

    const getInitialFilters = (params) => {
        const transformedParams = { ...params };
        // orderBy
        if (transformedParams.sort) {
            transformedParams.orderby = transformedParams.sort;
        } else {
            transformedParams.orderby = "Share desc";
        }

        const filters = [];
        if (transformedParams.adNetwork) {
            filters.push(`Name;contains;"${decodeURIComponent(transformedParams.adNetwork)}"`);
            delete transformedParams.adNetwork;
        }
        if (filters.length > 0) {
            transformedParams.filter = filters.join(",");
        }

        return apiHelper.transformParamsForAPI(transformedParams);
    };

    return (
        <div data-automation="ad-networks-single">
            <SWReactTableWrapper
                tableOptions={{
                    metric: "TrafficSourcesDisplayNetworks",
                    defaultSorted: "Share",
                }}
                serverApi={`/api/websiteanalysis/GetTrafficDisplayAdvertisingAdsTable`}
                tableColumns={columns}
                initialFilters={getInitialFilters(props.params)}
                recordsField="Records"
                totalRecordsField="TotalCount"
                onSort={onSort}
                pageIndent={1}
            >
                {(topComponentProps) => (
                    <AdNetworksTableTop
                        downloadExcelPermitted={downloadExcelPermitted}
                        excelLink={getExcelUrl()}
                        a2d={a2d}
                        searchValue={adNetwork}
                        onChange={onSearch}
                        isCompare={false}
                        i18n={i18n}
                        {...topComponentProps}
                    />
                )}
            </SWReactTableWrapper>{" "}
        </div>
    );
};
