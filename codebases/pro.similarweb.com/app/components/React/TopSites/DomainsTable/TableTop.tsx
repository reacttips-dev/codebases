import { SearchContainer } from "pages/workspace/StyledComponent";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import React, { useState } from "react";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { i18nFilter } from "filters/ngFilters";
import { ColumnsPickerLite } from "@similarweb/ui-components/dist/columns-picker";
import { getColumnsPickerLiteProps } from "pages/keyword-analysis/common/UtilityFunctions";
import { ExcelDownload } from "UtilitiesAndConstants/UtilitiesComponents/ExcelDownload";
import capitalize from "lodash/capitalize";
import { ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { websiteTypeItems } from "pages/keyword-analysis/Organic";
import { FiltersContainer, Right } from "./Styled";
import { AddToDashboard } from "components/React/TopSites/DomainsTable/AddToDashboard";
import { DefaultFetchService } from "services/fetchService";

export const TableTop = ({
    tableColumns,
    onClickToggleColumns,
    onFilterChange,
    params,
    excelEndpoint,
    filtersStateObject,
}) => {
    const i18n = i18nFilter();
    const [search, setSearch] = useState<string>();
    const [websiteType, setWebsiteType] = useState<string>();

    const onSearchChange = (search) => {
        setSearch(search);
        onFilterChange({ filter: `domain;contains;"${search?.trim()}"` });
    };
    const onWebsiteTypeItemClick = (websiteType) => {
        setWebsiteType(websiteType.text);
        onFilterChange({ funcFlag: parseInt(websiteType.id) }, false);
    };

    const onCloseWebsiteTypeItem = () => {
        setWebsiteType(undefined);
        onFilterChange({ funcFlag: null }, false);
    };
    const fetcherService = DefaultFetchService.getInstance();
    const excelLink = `${excelEndpoint}?${fetcherService.requestParams(filtersStateObject)}`;
    return (
        <>
            <div>
                <FiltersContainer>
                    <ChipDownContainer
                        width={280}
                        hasSearch={false}
                        selectedIds={websiteType && { [websiteType]: true }}
                        selectedText={websiteType && capitalize(websiteType)}
                        buttonText={i18n("analysis.source.search.keywords.filters.websitetype")}
                        onClick={onWebsiteTypeItemClick}
                        onCloseItem={onCloseWebsiteTypeItem}
                    >
                        {websiteTypeItems}
                    </ChipDownContainer>
                </FiltersContainer>
                <SearchContainer>
                    <SearchInput
                        clearValue={false}
                        defaultValue={search}
                        debounce={400}
                        onChange={onSearchChange}
                        placeholder={i18n("forms.search.placeholder")}
                    />
                    <Right>
                        <FlexRow>
                            <ExcelDownload excelLink={excelLink} />
                            <div>
                                <ColumnsPickerLite
                                    {...getColumnsPickerLiteProps(
                                        tableColumns,
                                        onClickToggleColumns,
                                    )}
                                    withTooltip={true}
                                />
                            </div>
                            <div>
                                <AddToDashboard
                                    filtersStateObject={filtersStateObject}
                                    params={params}
                                />
                            </div>
                        </FlexRow>
                    </Right>
                </SearchContainer>
            </div>
        </>
    );
};
