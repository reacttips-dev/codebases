import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import * as _ from "lodash";
import React, { Component, useCallback, useMemo, useState } from "react";
import { connect } from "react-redux";
import {
    ICustomSegment,
    ICustomSegmentAccount,
    SEGMENT_TYPES,
} from "services/segments/segmentsApiService";
import MultiColorSelectionTable from "../../../components/React/Table/MultiColorSelectionTable";
import { defaultGetStableKey } from "../../../components/React/Table/SWReactTable";
import { i18nFilter } from "../../../filters/ngFilters";
import { SearchContainer, TableWrapper } from "./styledComponents";
import { SegmentsGroupMMXTableColumnsConfig } from "./SegmentsGroupMMXTableConfig";
import { SegmentsUtils } from "services/segments/SegmentsUtils";
import { ChannelsObj } from "./SegmentsGroupMMXGraph";
import { EngagementVerticals } from "pages/segments/mmx/SegmentsSingleMarketingGraphChart";
import { SegmentsTableStyles } from "pages/segments/styleComponents";

export interface ISegmentsGroupMMXTableProps {
    selectedRows?: any[];
    selectedDisplayTypeIndex?: number;
    data: any;
    isLoading?: boolean;
    tableSelectionKey: string;
    allSegments?: any;
    groups?: any;
    params?: any;
    selectedMetric: string;
}

const sortedColumn: { field: string; sortDirection: "desc" | "asc" } = {
    field: "GroupVisitsShare",
    sortDirection: "desc",
};

export const SegmentsGroupMMXTable: React.FC<ISegmentsGroupMMXTableProps> = (props) => {
    const {
        isLoading,
        data,
        selectedDisplayTypeIndex,
        allSegments,
        groups,
        params,
        selectedMetric,
    } = props;
    const [searchString, setSearchString] = useState("");
    const isPercentage = useMemo(() => selectedDisplayTypeIndex === 1, [selectedDisplayTypeIndex]);
    const onSearch = useCallback((val) => {
        setSearchString(val.trim());
    }, []);

    const getStableKey = useCallback((index, col, row) => {
        if (row) {
            const { id } = row;
            return `${id}`;
        }
        return defaultGetStableKey(index, col);
    }, []);

    const manipulatedData = useMemo(() => {
        if (!isLoading) {
            const tableData = data;
            let groupVisitsTotal = 0;
            return Object.keys(tableData)
                ?.map((segId) => {
                    const segmentTotalVisit = Object.entries(
                        tableData[segId]["Monthly"]["Visits"],
                    ).reduce(
                        (
                            acc,
                            [
                                _,
                                {
                                    Total: { Value: val },
                                },
                            ]: any,
                        ) => acc + val,
                        0,
                    );
                    groupVisitsTotal += segmentTotalVisit;
                    const [segmentObj, segmentType] = SegmentsUtils.getSegmentObjectByKey(segId, {
                        segments: allSegments,
                        websites: groups.find((group) => group.id === params.id)?.websites,
                    });
                    const displayKey = selectedDisplayTypeIndex === 1 ? "Percentage" : "Value";
                    const multiplierValue =
                        selectedMetric === EngagementVerticals.Visits.name &&
                        selectedDisplayTypeIndex === 1
                            ? 100
                            : 1;
                    return {
                        ...segmentObj,
                        SegmentType: segmentType,
                        Direct:
                            tableData[segId]["Monthly"][selectedMetric]["Direct"]["Total"][
                                displayKey
                            ] * multiplierValue,
                        Mail:
                            tableData[segId]["Monthly"][selectedMetric]["Email"]["Total"][
                                displayKey
                            ] * multiplierValue,
                        OrganicSearch:
                            tableData[segId]["Monthly"][selectedMetric]["Organic Search"]["Total"][
                                displayKey
                            ] * multiplierValue,
                        InternalReferrals:
                            segmentType === SEGMENT_TYPES.WEBSITE
                                ? NaN
                                : tableData[segId]["Monthly"][selectedMetric]["Internal Referrals"][
                                      "Total"
                                  ][displayKey] * multiplierValue,
                        Referrals:
                            tableData[segId]["Monthly"][selectedMetric]["Referrals"]["Total"][
                                displayKey
                            ] * multiplierValue,
                        PaidReferrals:
                            tableData[segId]["Monthly"][selectedMetric]["Display Ads"]["Total"][
                                displayKey
                            ] * multiplierValue, //Display ads
                        PaidSearch:
                            tableData[segId]["Monthly"][selectedMetric]["Paid Search"]["Total"][
                                displayKey
                            ] * multiplierValue,
                        Social:
                            tableData[segId]["Monthly"][selectedMetric]["Social"]["Total"][
                                displayKey
                            ] * multiplierValue,
                        SegmentShare: tableData[segId]["Meta"]["SegmentShare"],
                        Visits: segmentTotalVisit,
                    };
                })
                .map((segObj) => ({
                    ...segObj,
                    GroupVisitsShare: segObj.Visits / groupVisitsTotal,
                }));
        }
    }, [isLoading, selectedDisplayTypeIndex, allSegments, groups, selectedMetric]);

    const filteredData = useMemo(() => {
        if (manipulatedData) {
            let filteredData: any[] =
                searchString !== ""
                    ? _.filter(manipulatedData, (dataItem: any) => {
                          const segmentData = SegmentsUtils.getSegmentById(
                              {
                                  segments: allSegments,
                              },
                              dataItem.id,
                          );
                          return (
                              dataItem.domain.indexOf(searchString) !== -1 ||
                              (segmentData &&
                                  dataItem.domain
                                      .concat(" " + segmentData.segmentName)
                                      .toLowerCase()
                                      .indexOf(searchString.toLowerCase()) !== -1)
                          );
                      })
                    : manipulatedData;
            const currentGroup = groups.find((group) => group.id === params.id);
            if (currentGroup?.members.length > filteredData.length) {
                currentGroup?.members.map((memberId) => {
                    if (filteredData.every((segment) => segment.id !== memberId)) {
                        const [segmentObj, segmentType] = SegmentsUtils.getSegmentObjectByKey(
                            memberId,
                            {
                                segments: allSegments,
                                websites: currentGroup?.websites,
                            },
                        );
                        filteredData.push({
                            ...segmentObj,
                            SegmentType: segmentType,
                            id: memberId,
                            isDisabled: true, // do not show data cells
                            HasGraphData: false, // to disable row selection
                            GroupVisitsShare: 0, // sort this row to the end of table
                            rowClass: "segmentRowDisabled",
                        });
                    }
                });
            }
            return _.orderBy(filteredData, sortedColumn?.field, sortedColumn?.sortDirection);
        }
        return [];
    }, [searchString, manipulatedData, allSegments, sortedColumn]);

    const [minCellTable, maxCellTable] = useMemo(() => {
        return filteredData.reduce(
            ([min, max], rowData) => {
                Object.keys(ChannelsObj).forEach((key) => {
                    if (rowData[key] < min) {
                        min = rowData[key];
                    } else if (rowData[key] > max) {
                        max = rowData[key];
                    }
                });
                return [min, max];
            },
            [0, 0],
        );
    }, [filteredData]);

    const tableProps = useMemo(() => {
        return {
            isLoading,
            tableData: {
                Data: filteredData,
                maxCellValue: maxCellTable,
                minCellValue: minCellTable,
            },
            tableColumns: SegmentsGroupMMXTableColumnsConfig(isPercentage, selectedMetric),
            getStableKey: getStableKey,
        };
    }, [getStableKey, isLoading, filteredData, maxCellTable, minCellTable, isPercentage]);

    return (
        <TableWrapper loading={isLoading}>
            <SegmentsTableStyles />
            <SearchContainer>
                <SearchInput
                    defaultValue={searchString}
                    debounce={100}
                    onChange={onSearch}
                    placeholder={i18nFilter()(
                        "segment.analysis.marketingChannels.group.table.search.place.holder",
                    )}
                />
            </SearchContainer>
            <MultiColorSelectionTable {...props} tableProps={tableProps} tableData={filteredData} />
        </TableWrapper>
    );
};

export default SegmentsGroupMMXTable;
