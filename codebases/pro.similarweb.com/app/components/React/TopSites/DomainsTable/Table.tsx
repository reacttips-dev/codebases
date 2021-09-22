import SWReactRootComponent from "decorators/SWReactRootComponent";
import { connect } from "react-redux";
import { SWReactTableWrapperWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { TableTop } from "components/React/TopSites/DomainsTable/TableTop";
import { i18nFilter } from "filters/ngFilters";
import {
    DesktopMobileShare,
    getColumns as defaultGetColumns,
    getBonusCountryColumns,
} from "components/React/TopSites/DomainsTable/getColumns";
import React, { useState } from "react";
import { getInitialFilters } from "components/React/TopSites/DomainsTable/getInitialFilters";
import { transformData } from "components/React/TopSites/DomainsTable/transformData";
import { tableActionsCreator } from "actions/tableActions";
import { onDataCallback } from "components/React/TopSites/DomainsTable/onDataCallback";
import { TopSitesScatterChartWrapper } from "components/React/TopSites/TopSitesScatterChartWrapper";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { swSettings } from "common/services/swSettings";

export const TABLE_SELECTION_KEY = "INDUSTRY_LEADERS_TABLE";
const TABLE_SELECTION_PROPERTY = "Domain";
const INITIAL_SELECTED_ROWS = 10;
const MAX_SELECTED_ROWS = 15;
const TABLE_ENDPOINT = "/widgetApi/TopSitesExtended/TopSitesExtended/Table";
const EXCEL_ENDPOINT = "widgetApi/TopSitesExtended/TopSitesExtended/Excel";
const BONUS_COUNTRY_TABLE_ENDPOINT = "/widgetApi/TopSitesNew/TopSites/Table";
const BONUS_COUNTRY_EXCEL_ENDPOINT = "widgetApi/TopSitesNew/TopSites/Excel";

const getIsBonusCountry = (country) => {
    const availableCountries = swSettings.components.Home.resources.Countries;
    const isBonusCountry = !availableCountries.includes(Number(country));
    return isBonusCountry;
};

export const Table = ({ params, selectRows }) => {
    const { webSource, country } = params;
    const [sort, setSort] = useState<{ field; sortDirection }>({
        field: "Share",
        sortDirection: "desc",
    });
    const [tableData, setTableData] = useState<{ records?: any[]; Data: object }>();
    const [isBonusCountry, setIsBonusCountry] = useState<boolean>(getIsBonusCountry(country));
    const onSort = ({ field, sortDirection }) => {
        setSort({ field, sortDirection });
    };

    const columns = React.useMemo(() => {
        const excludeFields = [webSource !== devicesTypes.TOTAL && DesktopMobileShare];
        const getColumns = isBonusCountry ? getBonusCountryColumns : defaultGetColumns;
        const columns = getColumns(excludeFields, sort);
        return columns;
    }, [sort, webSource]);

    const onDataError = () => {
        setTableData({ Data: {} });
    };
    React.useEffect(() => {
        setIsBonusCountry(getIsBonusCountry(country));
    }, [country]);
    const initialFilters = getInitialFilters(params, sort);
    const i18n = i18nFilter();

    return (
        <>
            {!isBonusCountry && tableData?.records && (
                <TopSitesScatterChartWrapper tableData={tableData.records} />
            )}
            <br />
            <SWReactTableWrapperWithSelection
                tableSelectionKey={TABLE_SELECTION_KEY}
                tableSelectionProperty={TABLE_SELECTION_PROPERTY}
                getDataCallback={onDataCallback(selectRows, INITIAL_SELECTED_ROWS, setTableData)}
                onDataError={onDataError}
                initialFilters={initialFilters}
                transformData={transformData}
                onSort={onSort}
                serverApi={isBonusCountry ? BONUS_COUNTRY_TABLE_ENDPOINT : TABLE_ENDPOINT}
                tableColumns={columns}
                maxSelectedRows={MAX_SELECTED_ROWS}
                tableOptions={{
                    noDataTitle: i18n("industry.leaders.table.no.data.title"),
                    noDataSubtitle: i18n("industry.leaders.table.no.data.subtitle"),
                    tableSelectionTrackingParam: "keyword",
                    showCompanySidebar: true,
                }}
                recordsField="records"
                totalRecordsField="TotalCount"
                pageIndent={1}
                cleanOnUnMount={true}
            >
                {(topComponentProps) => (
                    <TableTop
                        {...topComponentProps}
                        initialFilters={initialFilters}
                        params={params}
                        excelEndpoint={
                            isBonusCountry ? BONUS_COUNTRY_EXCEL_ENDPOINT : EXCEL_ENDPOINT
                        }
                    />
                )}
            </SWReactTableWrapperWithSelection>
        </>
    );
};

const mapStateToProps = (state) => {
    const { tableSelection, routing } = state;
    const { params } = routing;
    return {
        params,
        tableSelection,
    };
};

const mapDispatchToProps = (dispatch) => {
    const tableAction = tableActionsCreator(TABLE_SELECTION_KEY, TABLE_SELECTION_PROPERTY);
    return {
        selectRows: (rows) => {
            dispatch(tableAction.clearAllSelectedRows());
            dispatch(tableAction.selectRows(rows));
        },
    };
};

export const IndustryLeadersTable = connect(mapStateToProps, mapDispatchToProps)(Table);
SWReactRootComponent(IndustryLeadersTable, "IndustryLeadersTable");
