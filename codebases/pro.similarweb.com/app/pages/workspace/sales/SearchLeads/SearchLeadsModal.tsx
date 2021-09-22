/** @similarweb IMPORT */
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "filters/ngFilters";

import { SWReactTableOptimizedWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";

/** NPM IMPORT */
import React, { FC } from "react";

import {
    ButtonBox,
    CustomTitle,
    MainBox,
    SearchLeadsTableContainer,
    Subtitle,
} from "./StyledSearchLeadsModal";

interface IDataTableItem {
    name: string;
    totalResults: number;
    newResults: number;
    addedToLists: number;
}

interface ISearchLeadsPopUpProps {
    onClickCancel: VoidFunction;
    onClickDone: VoidFunction;
    data: IDataTableItem[];
    onRowSelected(event, row);
}

const tableColumns = [
    {
        field: "name",
        displayName: i18nFilter()(
            "workspace.common_components.searchLeadsCard.popup.table.displayName.name",
        ),
        width: 235,
        showTotalCount: true,
        fixed: true,
        type: "string",
        visible: true,
    },
    {
        field: "totalResults",
        displayName: i18nFilter()(
            "workspace.common_components.searchLeadsCard.popup.table.displayName.totalResults",
        ),
        width: 130,
        fixed: true,
        type: "double",
        visible: true,
        headerCellClass: "u-justifyFlexEnd",
        cellClass: "u-alignRight",
    },
    {
        field: "newResults",
        displayName: i18nFilter()(
            "workspace.common_components.searchLeadsCard.popup.table.displayName.newResults",
        ),
        width: 130,
        fixed: true,
        type: "double",
        visible: true,
        headerCellClass: "u-justifyFlexEnd",
        cellClass: "u-alignRight",
    },
    {
        field: "addedToLists",
        displayName: i18nFilter()(
            "workspace.common_components.searchLeadsCard.popup.table.displayName.addedToLists",
        ),
        width: 130,
        fixed: true,
        type: "double",
        visible: true,
        headerCellClass: "u-justifyFlexEnd",
        cellClass: "u-alignRight",
    },
];

const metric = `Sales_Workspace_Search_Leads_Modal`;

const getTableOptions = (onRowSelected) => {
    return {
        shouldEnrichRow: () => false,
        onCellClick: (isOpen, rowIdx, rowData, columnConfig) =>
            !columnConfig.isCheckBox && onRowSelected(null, rowData),
        customTableClass: "sales-workspace-table-search-leads-modal",
        metric,
        noDataTitle: i18nFilter()("workspaces.sales.table.search.leads.modal.nodata"),
        addPaddingRightCell: false,
        highlightClickedRow: true,
    };
};

export const SearchLeadsModal: FC<ISearchLeadsPopUpProps> = ({
    onClickCancel,
    onClickDone,
    data,
    onRowSelected,
}) => (
    <MainBox>
        <CustomTitle>
            {i18nFilter()("workspace.common_components.searchLeadsCard.popup.title")}
        </CustomTitle>
        <Subtitle>
            {i18nFilter()("workspace.common_components.searchLeadsCard.popup.subtitle")}
        </Subtitle>
        <SearchLeadsTableContainer>
            <SWReactTableOptimizedWithSelection
                tableSelectionProperty="site"
                tableData={data}
                clearAllSelectedRows={() => {}}
                tableColumns={tableColumns}
                tableOptions={getTableOptions(onRowSelected)}
            />
        </SearchLeadsTableContainer>
        <ButtonBox>
            <Button type="flat" onClick={onClickCancel}>
                <ButtonLabel>
                    {i18nFilter()("workspace.common_components.searchLeadsCard.popup.btn.cancel")}
                </ButtonLabel>
            </Button>
            <Button type="primary" buttonHtmlType={"button"} onClick={onClickDone}>
                <ButtonLabel>
                    {i18nFilter()("workspace.common_components.searchLeadsCard.popup.btn.run")}
                </ButtonLabel>
            </Button>
        </ButtonBox>
    </MainBox>
);
