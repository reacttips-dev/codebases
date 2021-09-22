import {
    ShareBar,
    ShareBarChartValue,
    ShareBarContainer,
} from "@similarweb/ui-components/dist/share-bar";
import React from "react";
import styled from "styled-components";
import { DESKTOP_COLOR } from "../../../Arena/components/EngagementMetrics/tableUtils";
import { ChangePercentage, IndexCell } from "../../../components/React/Table/cells";
import { GoogleAppKeywordCell } from "../../../components/React/Table/cells/GoogleAppKeywordCell";
import { DefaultCellHeader } from "../../../components/React/Table/headerCells";
import { DefaultCellHeaderRightAlign } from "../../../components/React/Table/headerCells/DefaultCellHeaderRightAlign";
import { i18nFilter } from "../../../filters/ngFilters";

export const appCategoryTopKeywordsTableColumns = (i18nReplacements) => {
    return [
        {
            fixed: true,
            field: "", // SIM-27285
            cellComponent: IndexCell,
            headerComponent: DefaultCellHeader,
            disableHeaderCellHover: true,
            sortable: false,
            width: 65,
            visible: true,
        },
        {
            fixed: true,
            field: "Term",
            displayName: i18nFilter()("appstorekeywords.top.table.keyword"),
            type: "string",
            sortable: true,
            isSorted: false,
            sortDirection: "desc",
            cellComponent: GoogleAppKeywordCell,
            headerComponent: DefaultCellHeader,
            showTotalCount: true,
            tooltip: "appstorekeywords.top.table.keyword.tooltip",
            width: 260,
            visible: true,
        },
        {
            fixed: true,
            field: "Popularity",
            displayName: i18nFilter()("appstorekeywords.top.table.popularity"),
            type: "string",
            sortable: true,
            isSorted: false,
            sortDirection: "desc",
            cellComponent: ({ row }) => {
                return (
                    <BigShareBarColumn>
                        {row.Popularity}
                        <ShareBar
                            value={row.Popularity / 100}
                            primaryColor={DESKTOP_COLOR}
                            secondaryColor={"transparent"}
                            hideChangeValue={true}
                            hideValue={true}
                        />
                    </BigShareBarColumn>
                );
            },
            headerComponent: DefaultCellHeader,
            tooltip: "appstorekeywords.top.table.popularity.tooltip",
            width: 300,
            visible: true,
        },
        {
            fixed: true,
            field: "PopularityChange",
            displayName: i18nFilter()("appstorekeywords.top.table.change"),
            type: "double",
            sortable: true,
            isSorted: false,
            sortDirection: "desc",
            cellComponent: ChangePercentage,
            headerComponent: DefaultCellHeaderRightAlign,
            tooltip: i18nFilter()("appstorekeywords.top.table.change.tooltip", i18nReplacements),
            width: 130,
            visible: true,
        },
    ];
};

export const appCategoryTopKeywordsTableColumnsConfigGen = (
    sortbyField: string,
    sortDirection: string,
    i18nReplacements,
) => {
    return appCategoryTopKeywordsTableColumns(i18nReplacements).map((col, idx) => {
        if (!col.sortable) {
            return col;
        }
        return {
            ...col,
            isSorted: sortbyField ? col.field === sortbyField : col.isSorted,
            sortDirection:
                sortbyField && col.field === sortbyField ? sortDirection : col.sortDirection,
        };
    });
};

const BigShareBarColumn = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    ${ShareBarContainer} {
        width: 100%;
        margin-left: 8px;
    }

    ${ShareBarChartValue} {
        border-radius: 3px;
    }
`;
BigShareBarColumn.displayName = "BigShareBarColumn";
