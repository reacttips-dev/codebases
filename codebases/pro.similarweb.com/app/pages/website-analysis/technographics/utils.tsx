/* eslint-disable react/display-name */
import React from "react";
import { i18nFilter } from "filters/ngFilters";
import { tableMockData } from "pages/website-analysis/technographics/mock";
import { DefaultFetchService } from "services/fetchService";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import { DefaultCell } from "components/React/Table/cells";
import { DefaultCellHeader } from "components/React/Table/headerCells";
import { DomainNameAndIcon } from "pages/workspace/common/tableAdditionalColumns";
import { CheckMark } from "./components/CheckMark";
import { DomainFaviconHeader } from "./components/DomainFaviconHeader";
import { TECHNOLOGIES_TABLE_URL } from "./constants";
import { ITableCellProps } from "components/React/Table/interfaces/ITableCellProps";
import { categoryClassIconFilter, i18nCategoryFilter } from "filters/ngFilters";

const i18nCategory = i18nCategoryFilter();
const categoryClassIcon = categoryClassIconFilter();
const fetchService = DefaultFetchService.getInstance();

export const technologiesExcelUrl = (keys: string[]) =>
    `/api/technographics/excel?keys=${keys.map(encodeURIComponent)}`;

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchSiteTechnologies(keys: string[]) {
    const Records: any[] = await fetchService.get(
        `${TECHNOLOGIES_TABLE_URL}?keys=${keys.map(encodeURIComponent)}`,
    );
    return {
        Records,
        TotalCount: Records.length,
    };
}

export async function fetchTechnologiesMock(keys: string[]) {
    await 250;
    return { Records: tableMockData, TotalCount: tableMockData.length };
}

export const domainCheckedColumn = (site: string, icon: string) => ({
    field: site,
    sortable: false,
    isSorted: false,
    cellComponent: ({ value }: { value: boolean }) => <CheckMark isChecked={value} />,
    headerComponent: ({ field }: { field: string }) => (
        <DomainFaviconHeader domain={field} icon={icon} />
    ),
    visible: true,
    cellClass: "u-no-padding",
    isResizable: false,
    width: 48,
});

export function getTableColumns(
    keys: string[],
    order: Record<string, string>,
    getSiteImage: (key: string) => string,
) {
    const [[sortField, sortDirection]] = Object.entries(order);

    function isSortedBy(field: string) {
        return field === sortField;
    }

    function getSortDirection(field: string) {
        return isSortedBy(field) ? sortDirection : "asc";
    }

    const singleColumns = [
        {
            field: "technologyName",
            fixed: true,
            displayName: i18nFilter()("analysis.overview.technographics.table.technology_name"),
            showTotalCount: true,
            isSorted: isSortedBy("technologyName"),
            sortDirection: getSortDirection("technologyName"),
            sortable: true,
            visible: true,
            headerComponent: DefaultCellHeader,
            cellComponent: ({ value, row }: ITableCellProps) => (
                <DomainNameAndIcon
                    domain={value}
                    icon={`https://www.similartech.com/images/technology?id=${row.technologyId}`}
                />
            ),
            width: 261,
        },
        {
            field: "category",
            displayName: i18nFilter()("analysis.overview.technographics.table.category"),
            sortable: true,
            isSorted: isSortedBy("category"),
            cellComponent: DefaultCell,
            headerComponent: DefaultCellHeader,
            sortDirection: getSortDirection("category"),
            width: 185,
            visible: true,
        },
        {
            field: "subCategory",
            displayName: i18nFilter()("analysis.overview.technographics.table.sub_category"),
            sortable: true,
            isSorted: isSortedBy("subCategory"),
            sortDirection: getSortDirection("subCategory"),
            cellComponent: DefaultCell,
            headerComponent: DefaultCellHeader,
            width: 156,
            visible: true,
        },
        {
            field: "freePaid",
            displayName: i18nFilter()("analysis.overview.technographics.table.free.or.paid"),
            sortable: true,
            isSorted: isSortedBy("freePaid"),
            cellComponent: DefaultCell,
            headerComponent: DefaultCellHeader,
            sortDirection: getSortDirection("freePaid"),
            width: 151,
            visible: true,
        },
        {
            field: "description",
            displayName: i18nFilter()("analysis.overview.technographics.table.description"),
            cellClass: "line-clamp-2",
            cellComponent: (props: ITableCellProps) => (
                <PopupHoverContainer
                    content={() => <span>{props.row.description}</span>}
                    config={{
                        placement: "top",
                        width: 360,
                        cssClassContainer:
                            "Popup-element-wrapper-triangle sidebar-website-header-popup-triangle",
                    }}
                >
                    <div>
                        <DefaultCell {...props} />
                    </div>
                </PopupHoverContainer>
            ),
            headerComponent: DefaultCellHeader,
            isSorted: false,
            minWidth: 300,
            visible: true,
            sortable: false,
        },
    ];
    if (keys.length === 1) {
        return singleColumns;
    }
    // compare mode
    const [technologyColumn, ...other] = singleColumns;
    const hasTechnologyCollection = keys.map((key) => domainCheckedColumn(key, getSiteImage(key)));
    return [technologyColumn, ...hasTechnologyCollection, ...other];
}

export const convertCategory = (
    category: string,
    isSub: boolean,
    number: number,
    parent: string,
): {
    text: string;
    id: string;
    isCustomCategory: boolean;
    isChild: boolean;
    icon: string;
    forApi: string;
    parent: string;
} => {
    const text = `${i18nCategory(category)}`;
    return {
        parent,
        text: `${text} (${number})`,
        id: category,
        isCustomCategory: false,
        isChild: isSub,
        icon: !isSub && categoryClassIcon(category),
        forApi: `${category}`,
    };
};
