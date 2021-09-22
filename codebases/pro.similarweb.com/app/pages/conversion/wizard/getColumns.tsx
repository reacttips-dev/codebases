import {
    BounceRate,
    ChangePercentage,
    DefaultCellRightAlign,
    IndexCell,
} from "components/React/Table/cells";
import { CheckCell } from "components/React/Table/cells/CheckCell";
import { WebsiteTooltip } from "components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import * as _ from "lodash";
import * as React from "react";
import { CoreCountriesCell } from "../../../../.pro-features/components/core cells/src/CoreCountriesCell/CoreCountriesCell";
import { CoreWebsiteCell } from "../../../../.pro-features/components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import ComponentsProvider from "../../../../.pro-features/components/WithComponent/src/ComponentsProvider";
import { RowSelectionConsumer } from "../../../components/React/Table/cells/RowSelection";
import {
    DefaultCellHeader,
    DefaultCellHeaderRightAlign,
    HeaderCellBlank,
} from "../../../components/React/Table/headerCells";
import { SelectAllRowsHeaderCellConsumer } from "../../../components/React/Table/headerCells/SelectAllRowsHeaderCell";
import { AddSegmentBubble } from "./AddSegmentBubble";
import { SegmentCellContainer } from "./StyledComponents";

const DEFAULT_SORT_DIRECTION = "desc";

export const getColumns = (
    sortedColumn,
    segments,
    countries,
    translate,
    showBubble,
    onCloseBuble,
) => {
    return [
        {
            fixed: true,
            cellComponent: RowSelectionConsumer,
            sortable: false,
            headerComponent: SelectAllRowsHeaderCellConsumer,
            isResizable: false,
            width: 48,
        },
        {
            fixed: true,
            cellComponent: IndexCell,
            headerComponent: HeaderCellBlank,
            disableHeaderCellHover: true,
            sortable: false,
            isResizable: false,
            width: 65,
        },
        {
            field: "Domain",
            sortable: true,
            displayName: translate("conversion.wizard.table.cells.domain"),
            showTotalCount: true,
            cellComponent: ({ value, row }) => {
                const segmentData = _.get(segments, [row.SegmentId], {});
                const subtitleFilters = [];
                if (!segmentData.isSingleLob) {
                    subtitleFilters.push({
                        filter: "text",
                        value: segmentData.segmentName,
                    });
                }
                return (
                    <SegmentCellContainer withSegments={!segmentData.isSingleLob}>
                        <ComponentsProvider components={{ WebsiteTooltip }}>
                            <CoreWebsiteCell
                                icon={row.Favicon}
                                domain={value}
                                subtitleFilters={
                                    subtitleFilters.length > 0 ? subtitleFilters : null
                                }
                                internalLink={null} // you don't need to go out from wizard occasionally
                            />
                        </ComponentsProvider>
                    </SegmentCellContainer>
                );
            },
        },
        {
            field: "Visits",
            cellComponent: DefaultCellRightAlign,
            headerComponent: DefaultCellHeaderRightAlign,
            sortable: true,
            format: "minVisitsAbbr",
            displayName: translate("conversion.wizard.table.cells.totalVisits"),
            tooltip: translate("conversion.wizard.table.tooltips.totalVisits"),
        },
        {
            field: "ConvertedVisits",
            cellComponent: DefaultCellRightAlign,
            headerComponent: DefaultCellHeaderRightAlign,
            sortable: true,
            format: "minVisitsAbbr",
            displayName: translate("conversion.wizard.table.cells.convertedVisits"),
            tooltip: translate("conversion.wizard.table.tooltips.convertedVisits"),
        },
        {
            field: "ConversionRate",
            cellComponent: BounceRate,
            headerComponent: DefaultCellHeaderRightAlign,
            sortable: true,
            format: "minVisitsAbbr",
            displayName: translate("conversion.wizard.table.cells.conversionRate"),
            tooltip: translate("conversion.wizard.table.tooltips.conversionRate"),
        },
        {
            field: "ChangeYoY",
            cellComponent: ({ props, row }) => {
                const { Value } = row.ChangeYoY;
                return <ChangePercentage {...props} value={Value} />;
            },
            headerComponent: DefaultCellHeaderRightAlign,
            sortable: true,
            displayName: translate("conversion.wizard.table.cells.changeYoY"),
            tooltip: translate("conversion.wizard.table.tooltips.changeYoY"),
        },
        {
            field: "IsOSS",
            cellComponent: ({ row }) => {
                const segmentId = row.SegmentId;
                const ossCountries = _.get(segments, [segmentId, "ossCountries"], []);
                return <CheckCell value={ossCountries.length > 0} />;
            },
            headerComponent: DefaultCellHeader,
            sortable: false,
            displayName: translate("conversion.wizard.table.cells.oss"),
            tooltip: translate("conversion.wizard.table.tooltips.oss"),
        },
        {
            cellComponent: ({ row }) => {
                const segmentId = row.SegmentId;
                const availableCountries = _.get(segments, [segmentId, "countries"], []).map(
                    (countryId) => {
                        return {
                            code: countryId,
                            text: _.get(countries, [countryId, "text"], ""),
                        };
                    },
                );

                return <CoreCountriesCell countries={availableCountries} />;
            },
            sortable: false,
            width: 120,
            displayName: translate("conversion.wizard.table.cells.availableCountries"),
            tooltip: translate("conversion.wizard.table.tooltips.availableCountries"),
        },
    ].map((col: any) => {
        return {
            ...col,
            visible: true,
            isResizable: col.hasOwnProperty("isResizable") ? col.isResizable : true,
            isSorted: sortedColumn.field === col.field,
            sortDirection:
                sortedColumn.field === col.field
                    ? sortedColumn.sortDirection
                    : DEFAULT_SORT_DIRECTION,
            headerComponent: col.headerComponent || DefaultCellHeader,
        };
    });
};
