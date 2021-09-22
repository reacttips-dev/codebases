import React, { useMemo, useState } from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { SERPSnapshotBanner } from "pages/keyword-analysis/serp-snapshot/SERPSnapshotBanner";
import { useSelector } from "react-redux";
import SWReactTableWrapper from "components/React/Table/SWReactTableWrapper";
import { SERPSnapshotTableTop } from "pages/keyword-analysis/serp-snapshot/SERPSnapshotTableTop";
import { tableColumns } from "pages/keyword-analysis/serp-snapshot/SERPSnapshotColumns";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { allTrackers } from "services/track/track";
import { SERPSnapshotEnrichedRowComponent } from "./SERPSnapshotEnrichedRowComponent";
import { SERPSnapshotPageTableWrapper } from "pages/keyword-analysis/serp-snapshot/StyledComponents";
import {
    ESERPMetaType,
    IRecord,
    IRecordWithType,
    ISERPRecord,
    ISERPRecordWithType,
} from "pages/keyword-analysis/serp-snapshot/types";
import { SERPSnapshotEmptyState } from "pages/keyword-analysis/serp-snapshot/SERPSnapshotEmptyState";

const SERVER_API = "/api/SerpSnapshot/Table";
const EXCEL_URL = `${SERVER_API}/Excel`;
const DEFAULT_SORT = "position";

export const SERPSnapshotPage: React.FC<any> = (props) => {
    const {
        keyword,
        country,
        duration,
        webSource,
        ExcludeUrls,
        IncludeUrls,
        sort = DEFAULT_SORT,
        asc = false,
    } = useSelector((state) => {
        const {
            routing: { params },
        } = state;
        return params;
    });
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const { to, from } = swNavigator.getApiParams();
    const [serpRecords, setSerpRecords] = useState({});
    const [noSerpRecords, setNoSerpRecords] = useState(false);
    const [lastScrapeDate, setLastScrapeDate] = useState("");

    const apiParams = {
        keys: keyword,
        to,
        from,
        webSource,
        country,
        sort,
        asc,
        ExcludeUrls,
        IncludeUrls,
    };

    if (ExcludeUrls) {
        apiParams["ExcludeUrls"] = ExcludeUrls;
    } else {
        delete apiParams["ExcludeUrls"];
    }
    if (IncludeUrls) {
        apiParams["IncludeUrls"] = IncludeUrls;
    } else {
        delete apiParams["IncludeUrls"];
    }

    const getCombinedResults = (organicResults, featureResults) => {
        featureResults.forEach((feature) => {
            const index = organicResults.findIndex(
                (el) => el.currentPosition === feature.currentPosition,
            );
            organicResults.splice(index, 1, feature);
        });
        return organicResults;
    };

    const transformData = (data) => {
        if (!(data && data.records)) {
            return data;
        }
        if (Object.keys(data.serpRecords).length) {
            setSerpRecords(data.serpRecords);
        } else if (data.records.length) {
            setNoSerpRecords(true);
        }
        setLastScrapeDate(data.lastScrapeDate);

        const transformedPositionedSerpRecords: ISERPRecordWithType[] = Object.values(
            data.serpRecords as Record<string, ISERPRecord>,
        ).reduce((acc: ISERPRecordWithType[], record: ISERPRecord) => {
            if (Boolean(record.currentPosition)) {
                acc.push({
                    ...record,
                    type: ESERPMetaType.FEATURE,
                });
            }
            return acc;
        }, []);

        // for mark the organic serps
        // to have indication where to put the serp features in the table
        const transformedOrganicRecords: IRecordWithType[] = data.records.map((result: IRecord) => {
            if (result.serpFeature === ESERPMetaType.ORGANIC) {
                return {
                    ...result,
                    type: ESERPMetaType.ORGANIC,
                };
            }
            return result;
        });

        // for future use
        // to add the serp features to the table

        // const mergedRecords = getCombinedResults(
        //     transformedOrganicRecords,
        //     transformedPositionedSerpRecords,
        // );
        // const finalRecords = mergedRecords.filter(
        //     (r) => r.type === ESERPMetaType.ORGANIC || r.type === ESERPMetaType.FEATURE,
        // );

        return {
            records: transformedOrganicRecords,
            totalRecords: transformedOrganicRecords.length,
        };
    };

    const onSort = ({ field, sortDirection }) => {
        swNavigator.applyUpdateParams({
            sort: `${field}`,
            asc: `${sortDirection === "asc"}`,
        });
    };

    const columns = useMemo(
        () =>
            tableColumns.getColumnsConfig({
                sortedColumn: DEFAULT_SORT,
                sortDirection: asc ? "asc" : "desc",
                currentMonth: duration.split("-")[0],
            }),
        [],
    );

    const isKeywordGroup = keyword.startsWith("*");

    if (isKeywordGroup) {
        return <SERPSnapshotEmptyState />;
    }

    return (
        <>
            <SERPSnapshotBanner />
            <SERPSnapshotPageTableWrapper>
                <SWReactTableWrapper
                    serverApi={SERVER_API}
                    tableColumns={columns}
                    initialFilters={{ ...apiParams }}
                    onSort={onSort}
                    transformData={transformData}
                    totalRecordsField={"totalRecords"}
                    paginationProps={{
                        showPagination: false,
                    }}
                    tableOptions={{
                        get EnrichedRowComponent() {
                            return (props) => <SERPSnapshotEnrichedRowComponent {...props} />;
                        },
                        get enrichedRowComponentAppendTo() {
                            return ".serp-snapshot-table";
                        },
                        get enrichedRowComponentHeight() {
                            return 580;
                        },
                        shouldApplyEnrichedRowHeightToCell: false,
                        shouldEnrichRow: (props, index, e) => {
                            const openEnrich = e?.currentTarget?.classList?.contains("enrich");
                            if (openEnrich) {
                                allTrackers.trackEvent("Open", "Click", "SERP Snapshot/Expand");
                            }
                            return openEnrich;
                        },
                        onEnrichedRowClick: () => {},
                        customTableClass: "serp-snapshot-table",
                    }}
                >
                    {(topComponentProps) => (
                        <SERPSnapshotTableTop
                            {...topComponentProps}
                            serpRecords={serpRecords}
                            noSerpRecords={noSerpRecords}
                            lastScrapeDate={lastScrapeDate}
                            excelAllowed={true}
                            excelDownloadUrl={EXCEL_URL}
                        />
                    )}
                </SWReactTableWrapper>
            </SERPSnapshotPageTableWrapper>
        </>
    );
};

SWReactRootComponent(SERPSnapshotPage, "SERPSnapshot");
