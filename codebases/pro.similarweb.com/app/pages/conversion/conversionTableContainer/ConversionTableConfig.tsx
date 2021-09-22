import { IconButton } from "@similarweb/ui-components/dist/button";
import React from "react";
import { CoreWebsiteCell } from "../../../../.pro-features/components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import ComponentsProvider from "../../../../.pro-features/components/WithComponent/src/ComponentsProvider";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { DefaultCellRightAlign } from "../../../components/React/Table/cells/DefaultCellRightAlign";
import { BounceRate, IndexCell } from "../../../components/React/Table/cells/index";
import { RowSelectionConsumer } from "../../../components/React/Table/cells/RowSelection";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
} from "../../../components/React/Table/headerCells/index";
import { WebsiteTooltip } from "../../../components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { i18nFilter } from "../../../filters/ngFilters";
import { ISegmentsData } from "../../../services/conversion/ConversionSegmentsService";
import { allTrackers } from "../../../services/track/track";
import { ConversionSegmentsUtils } from "../ConversionSegmentsUtils";
import { LinkRowContainer, SegmentCellContainer } from "./StyledComponents";

export const CategoryConversionTableColumnsConfig = (segments: ISegmentsData) => [
    {
        fixed: true,
        isCheckBox: true,
        cellComponent: RowSelectionConsumer,
        sortable: false,
        width: 33,
        headerComponent: DefaultCellHeader,
        visible: true,
        disableHeaderCellHover: true,
    },
    {
        fixed: true,
        cellComponent: IndexCell,
        headerComponent: DefaultCellHeader,
        disableHeaderCellHover: true,
        sortable: false,
        width: 65,
        visible: true,
    },
    {
        fixed: true,
        field: "Domain",
        displayName: i18nFilter()("category.converstion.table.column.domain"),
        type: "string",
        format: "None",
        isResizable: true,
        sortable: true,
        isSorted: false,
        cellComponent: ({ value, row }) => {
            const segmentData = ConversionSegmentsUtils.getSegmentById(segments, row.SegmentId);
            const subtitleFilters = [];
            if (!segmentData.isSingleLob) {
                subtitleFilters.push({
                    filter: "text",
                    value: segmentData.segmentName,
                });
            }
            return (
                <SegmentCellContainer withSegment={!segmentData.isSingleLob}>
                    <ComponentsProvider components={{ WebsiteTooltip }}>
                        <CoreWebsiteCell
                            icon={row.Favicon}
                            domain={value}
                            externalLink={`http://${value}`}
                            subtitleFilters={subtitleFilters.length > 0 ? subtitleFilters : null}
                            trackExternalLink={() =>
                                allTrackers.trackEvent(
                                    "external link",
                                    "click",
                                    `Conversion Category Overview`,
                                )
                            }
                        />
                    </ComponentsProvider>
                </SegmentCellContainer>
            );
        },
        headerComponent: DefaultCellHeader,
        sortDirection: "desc",
        totalCount: true,
        tooltip: i18nFilter()("category.converstion.table.tooltip.domain"),
        width: 300,
        showTotalCount: false,
        visible: true,
    },
    {
        field: "Visits",
        displayName: i18nFilter()("category.converstion.table.column.visits"),
        type: "double",
        format: "minVisitsAbbr",
        sortable: true,
        isSorted: true,
        isResizable: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("category.converstion.table.tooltip.visits"),
        visible: true,
    },
    // {
    //     field: "UniqueVisitors",
    //     displayName: i18nFilter()("category.converstion.table.column.unique.visitors"),
    //     type: "double",
    //     format: "minVisitsAbbr",
    //     sortable: true,
    //     isSorted: false,
    //     cellComponent: DefaultCellRightAlign,
    //     headerComponent: DefaultCellHeaderRightAlign,
    //     sortDirection: "desc",
    //     tooltip: i18nFilter()( "category.converstion.table.tooltip.unique.visitors"),
    //     visible: true
    // },
    {
        field: "ConvertedVisits",
        displayName: i18nFilter()("category.converstion.table.column.converted.visits"),
        type: "double",
        format: "minVisitsAbbr",
        sortable: true,
        isResizable: false,
        isSorted: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("category.converstion.table.tooltip.converted.visits"),
        visible: true,
    },
    {
        field: "ConversionRate",
        displayName: i18nFilter()("category.converstion.table.column.conversion.rate"),
        type: "double",
        format: "percentagesign",
        sortable: true,
        isResizable: false,
        isSorted: false,
        cellComponent: BounceRate,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("category.converstion.table.tooltip.conversion.rate"),
        visible: true,
    },
    {
        field: "Stickiness",
        displayName: i18nFilter()("category.converstion.table.column.purchases.per.customer"),
        type: "double",
        format: "number",
        sortable: true,
        isSorted: false,
        isResizable: false,
        cellComponent: DefaultCellRightAlign,
        headerComponent: DefaultCellHeaderRightAlign,
        sortDirection: "desc",
        tooltip: i18nFilter()("category.converstion.table.tooltip.purchases.per.customer"),
        visible: true,
    },
];

export const CategoryConversionTableColumnsConfigGen = (
    sortbyField: string,
    sortDirection: string,
    segments: ISegmentsData,
) => {
    return CategoryConversionTableColumnsConfig(segments).map((col, idx) => {
        if (!col.sortable) {
            return col;
        }
        return {
            ...col,
            isSorted: col.field === sortbyField,
            sortDirection: col.field === sortbyField ? sortDirection : col.sortDirection,
        };
    });
};

export const CategoryConversionTableOptions = () => {
    const onLinkRowClick: any = (componentProps, row) => {
        const swNavigator = Injector.get<any>("swNavigator");
        const { country, gid } = swNavigator.getParams();
        allTrackers.trackEvent(
            "Internal link",
            "click",
            `Performance trends/Analyze website/${row.Domain}`,
        );
        swNavigator.go("conversion-customsegement", {
            country,
            gid,
            sid: row.SegmentId,
            duration: "6m",
            comparedDuration: "12m",
        });
    };
    const drilldownLink = (
        <IconButton onClick={onLinkRowClick} iconName="arrow-right" type="flat" placement={"right"}>
            {i18nFilter()("category.conversion.table.action.analyse")}
        </IconButton>
    );

    return {
        rowActionsComponents: [drilldownLink],
        onCellClick: (isOpen, rowIdx, rowData, columnConfig) =>
            !columnConfig.isCheckBox && onLinkRowClick(null, rowData),
    };
};
