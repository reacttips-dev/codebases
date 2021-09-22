import React, { useCallback, useMemo } from "react";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import {
    SearchContainer,
    ButtonsContainer,
    DownloadExcelContainer,
} from "pages/industry-analysis/category-share/CategoryShareTable/CategoryShareTableTop/CategoryShareTableTopStyles";
import { ColumnsPickerLite } from "@similarweb/ui-components/dist/columns-picker";
import { createTableFilter, getColumnsPickerLiteProps } from "./CategoryShareTableTopUtils";
import { ICategoryShareTableTopProps } from "./CategoryShareTableTopTypes";
import { CategoryShareTableTopContainer } from "pages/industry-analysis/category-share/CategoryShareTable/CategoryShareTableTop/CategoryShareTableTopStyles";

const TABLE_FILTER_KEY = "Domain";
const TABLE_EXCEL_API = "/widgetApi/CategoryShare/CategoryShareIndex/Excel";

export const CategoryShareTableTop: React.FunctionComponent<ICategoryShareTableTopProps> = (
    props,
) => {
    const {
        onFilterChange,
        tableColumns,
        onClickToggleColumns,
        services,
        tableApiQueryParams,
    } = props;

    const onSearch = useCallback(
        (search: string) => {
            const filterValue = search
                ? { filter: createTableFilter(TABLE_FILTER_KEY, search) }
                : { filter: "" };

            onFilterChange(filterValue, false);
        },
        [onFilterChange],
    );

    const columnPickerProps = useMemo(() => {
        return getColumnsPickerLiteProps(tableColumns, onClickToggleColumns);
    }, [tableColumns, onClickToggleColumns]);

    const excelApiParams = services.fetchService.requestParams(tableApiQueryParams);
    const excelApiURL = `${TABLE_EXCEL_API}?${excelApiParams}`;
    const isExcelEnabled = services.swSettings.current.resources.IsExcelAllowed;

    return (
        <CategoryShareTableTopContainer>
            <SearchContainer>
                <SearchInput
                    defaultValue={""}
                    debounce={250}
                    onChange={onSearch}
                    placeholder={services.translate("table.search.placeholder.default")}
                />
            </SearchContainer>
            <ButtonsContainer>
                <DownloadExcelContainer href={excelApiURL}>
                    <DownloadButtonMenu
                        Excel={true}
                        downloadUrl={excelApiURL}
                        exportFunction={() => {
                            services.tracker.trackEvent("Download", "submit-ok", "Table/Excel");
                        }}
                        excelLocked={!isExcelEnabled}
                    />
                </DownloadExcelContainer>
                <div>
                    <ColumnsPickerLite {...columnPickerProps} withTooltip={true} />
                </div>
            </ButtonsContainer>
        </CategoryShareTableTopContainer>
    );
};
