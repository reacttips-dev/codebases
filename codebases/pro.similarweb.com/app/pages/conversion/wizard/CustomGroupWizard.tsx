import { IconButton } from "@similarweb/ui-components/dist/button";
import { Title } from "@similarweb/ui-components/dist/title";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import {
    SWReactTableWrapperContextConsumer,
    SWReactTableWrapperWithSelection,
} from "components/React/Table/SWReactTableWrapperSelectionContext";
import * as _ from "lodash";
import { IStartupSegment } from "pages/conversion/wizard/CustomGroupWizardContainer";
import React, { useMemo, useState } from "react";
import { connect } from "react-redux";
import UIComponentStateService from "services/UIComponentStateService";
import styled from "styled-components";
import { TableSelection } from "../../../../.pro-features/components/TableSelection/src/TableSelection";
import { CustomGroupConfirmation } from "../../../../.pro-features/pages/conversion/CustomGroupWizard/src/CustomGroupConfirmation";
import { CustomGroupWizardFiltersBar } from "../../../../.pro-features/pages/conversion/CustomGroupWizard/src/CustomGroupWizardFiltersBar";
import {
    RowElement,
    WizardLayout,
} from "../../../../.pro-features/pages/conversion/CustomGroupWizard/src/StyledComponents";
import StyledBoxSubtitle from "../../../../.pro-features/styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import DurationService, { IDurationData } from "../../../services/DurationService";
import { getColumns } from "./getColumns";
import { ISegmentsData } from "services/conversion/ConversionSegmentsService";
import { ConversionSegmentsUtils } from "pages/conversion/ConversionSegmentsUtils";

const DEFAULT_SELECTED_MARKET_CODE: string = "all";
const TABLE_SELECTION_KEY: string = "CustomGroupWizardTable";
const DEFAULT_WEBSOURCE: string = "Desktop";
const ROWS_PER_PAGE_COUNT: number = 50;
const DEFAULT_SORTED_COLUMN: string = "Visits";
const DEFAULT_SORT_DIRECTION: string = "desc";
const LOCAL_STORAGE_KEY = "FA_WIZARD_CUSTOM_GROUPS_BUBBLE_STATE";
const DEFAULT_DURATION_COSTUM_GRUOP_WIZARD = "1m";

const StyledBoxSubtitleMargin: any = styled(StyledBoxSubtitle)`
    margin-top: 5px;
`;
StyledBoxSubtitle.displayName = "StyledBoxSubtitleMargin";

export interface IWizardMarkets {
    [id: string]: {
        text: string;
        id: string;
        countries: IWizardCountries;

        creationType?: string;
        iid?: string;
        gid?: string;
    };
}

export interface IWizardCountries {
    [id: string]: IWizardCountry;
}

export interface IWizardCountry {
    text: string;
    id: string;
    markets: string[];
}

export interface IWizardSelectedGroup {
    name: string;
    id: string;
    creationType: string;
    segments: IWizardSelectedSegment[];
}

export interface IWizardSelectedSegment {
    Domain: string;
    domain: string;
    id: string;
    isSingleLob: boolean;
    segmentName: string;
    countries: number[];
}

export interface ICustomGroupWizardProps {
    title: string;
    subtitle: string;
    trackingKey: string;
    isFetching: boolean; // shows if currently fetching create/update to block actions
    pageFilters: {
        gid?: string;
        country?: string;
        from?: string;
        to?: string;
    };
    markets: IWizardMarkets;
    countries: IWizardCountries;
    segments: IStartupSegment;
    segmentsData: ISegmentsData;
    tableSelection: any; // anton: real any, or those we had from startup or table
    selectedGroup?: IWizardSelectedGroup;
    onConfirm: (groupData: { name: string; segmentIds: string[]; groupId?: string }) => void;
    translate: (key: string, params?) => string;
    track: (a?, b?, c?, d?) => void;
}

export interface ISortedColumn {
    field: string;
    sortDirection: string;
}

export const CustomGroupWizardComponent: React.FunctionComponent<ICustomGroupWizardProps> = ({
    title,
    subtitle,
    translate,
    track,
    selectedGroup,
    pageFilters,
    markets,
    countries,
    segments,
    segmentsData,
    tableSelection,
    onConfirm,
    trackingKey,
    isFetching,
}) => {
    const tableApi = "/api/conversion/segments/segment/Table";
    const getSelectedSegments = (selectedSegments: IWizardSelectedSegment[]): string => {
        return selectedSegments.map((item) => `"${item.id}"`).join(",");
    };
    const bubbleState = UIComponentStateService.getItem(LOCAL_STORAGE_KEY, "localStorage");
    const [showBubble, setShowBubble] = useState<boolean>(bubbleState === null || bubbleState);
    const onCloseBubble = () => {
        setShowBubble(false);
        UIComponentStateService.setItem(LOCAL_STORAGE_KEY, "localStorage", false);
    };
    const selectedRecords = _.get(tableSelection, TABLE_SELECTION_KEY, []);
    const initialSelectedRows = _.get(selectedGroup, "segments", []);
    const defaultUserCountry = useMemo(() => {
        return ConversionSegmentsUtils.getSegmentsDefaultUserCountry(
            Object.values(segmentsData.segments),
        );
    }, [segmentsData]);
    const filters = {
        sort: DEFAULT_SORTED_COLUMN,
        asc: DEFAULT_SORT_DIRECTION === "asc",
        orderBy: `${DEFAULT_SORTED_COLUMN} ${DEFAULT_SORT_DIRECTION}`,
        webSource: DEFAULT_WEBSOURCE,
        DomainFilter: "",
        country: pageFilters.country || defaultUserCountry,
        market: DEFAULT_SELECTED_MARKET_CODE,
        from: pageFilters.from,
        to: pageFilters.to,
        segments: !!pageFilters.gid ? getSelectedSegments(initialSelectedRows) : "",
        PageSize: ROWS_PER_PAGE_COUNT, // save this case because of backend support it
    };
    const [sortedColumn, setSortedColumn] = useState<ISortedColumn>({
        field: DEFAULT_SORTED_COLUMN,
        sortDirection: DEFAULT_SORT_DIRECTION,
    });
    const onBackButtonClick = () => {
        window.history.back();
    };
    const onSort = ({ field, sortDirection }) => {
        setSortedColumn({
            field,
            sortDirection,
        });
    };
    const onConfirmClick = (name) => {
        const segmentIds = _.get(tableSelection, TABLE_SELECTION_KEY, []).map((segment) => {
            return segment.SegmentId || segment.id; // because of inconsistency of data in startup and table
        });

        onConfirm({
            name,
            segmentIds,
            groupId: pageFilters.gid,
        });
    };
    const updateQueryParams = (params) => {
        const result = { ...params };

        if (params.sort) {
            result.orderBy = `${params.sort} ${params.asc ? "asc" : "desc"}`;
        }

        return result;
    };
    const getTableSelectionComponent = (groupSelectorElement) => {
        return (
            <SWReactTableWrapperContextConsumer>
                {({ selectedRows, clearAllSelectedRows }) => {
                    const text = translate("conversion.wizard.table.segmentsSelected", {
                        number: selectedRows.length.toString(),
                    });
                    return (
                        <TableSelection
                            key="1"
                            selectedText={text}
                            onCloseClick={clearAllSelectedRows}
                            addToGroupLabel=""
                            isVisible={selectedRows.length > 0}
                            groupSelectorElement={groupSelectorElement}
                        />
                    );
                }}
            </SWReactTableWrapperContextConsumer>
        );
    };
    const tableOptions = {
        metric: "CustomGroupsDataTable",
        tableSelectionTrackingParam: "SegmentId",
        aboveHeaderComponents: [
            getTableSelectionComponent(
                <CustomGroupConfirmation
                    isEdit={!!pageFilters.gid}
                    translate={translate}
                    track={track}
                    onConfirm={onConfirmClick}
                    isFetching={isFetching}
                    groupName={_.get(selectedGroup, "name", "")}
                />,
            ),
        ],
    };
    const tableColumns = getColumns(
        sortedColumn,
        segments,
        countries,
        translate,
        showBubble,
        onCloseBubble,
    );

    const durationData: IDurationData = DurationService.getDurationData(
        DEFAULT_DURATION_COSTUM_GRUOP_WIZARD,
        undefined,
        swSettings.getCurrentComponent().componentId,
    );
    const subtitleFilters = [
        {
            filter: "date",
            value: {
                from: durationData.forAPI.from,
                to: durationData.forAPI.to,
            },
        },
        {
            filter: "webSource",
            value: "Desktop",
        },
    ];
    return (
        <WizardLayout>
            <RowElement>
                <IconButton type="flat" iconName="arrow-left" onClick={onBackButtonClick}>
                    {translate("conversion.wizard.back")}
                </IconButton>
            </RowElement>
            <RowElement>
                <Title>{title}</Title>
                <StyledBoxSubtitleMargin>
                    <BoxSubtitle filters={subtitleFilters} />
                </StyledBoxSubtitleMargin>
            </RowElement>
            <RowElement>
                <StyledBoxSubtitle>{subtitle}</StyledBoxSubtitle>
            </RowElement>
            <RowElement>
                <SWReactTableWrapperWithSelection
                    tableSelectionKey={TABLE_SELECTION_KEY}
                    tableSelectionProperty={"SegmentId"}
                    recordsField={"Data"}
                    totalRecordsField={"TotalCount"}
                    serverApi={tableApi}
                    initialFilters={filters}
                    tableColumns={tableColumns}
                    rowsPerPage={ROWS_PER_PAGE_COUNT}
                    onSort={onSort}
                    pageIndent={1}
                    dataParamsAdapter={updateQueryParams}
                    tableOptions={tableOptions}
                    initialSelectedRows={initialSelectedRows}
                >
                    {(topComponentProps) => (
                        <CustomGroupWizardFiltersBar
                            {...topComponentProps}
                            markets={markets}
                            selectedGroup={selectedGroup}
                            countries={countries}
                            trackingKey={trackingKey}
                            isEdit={!!pageFilters.gid}
                            initialFilters={filters}
                            translate={translate}
                            track={track}
                            selectedRecords={selectedRecords}
                        />
                    )}
                </SWReactTableWrapperWithSelection>
            </RowElement>
        </WizardLayout>
    );
};

const mapStateToPropsBase = ({ tableSelection }) => {
    return {
        tableSelection,
    };
};

export const CustomGroupWizard = connect(mapStateToPropsBase, null)(CustomGroupWizardComponent);
