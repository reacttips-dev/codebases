import React from "react";
import { ColumnsPickerLite } from "@similarweb/ui-components/dist/columns-picker";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { Right, TopStyledLeft, TopStyled } from "../../../styles";
import { getColumnsPickerLiteProps } from "../../../utils";
import { TableContextProvider } from "../TableContextProvider";
import { SearchFilter } from "../Filters/SearchFilter/SearchFilter";
import { SearchTableContainer } from "./styles";
import TableFilters from "./TableFilters";
import { useIndustryTableContext } from "pages/sales-intelligence/sub-modules/industries/hooks/useIndustryTableContext";
import { IndustryParamsRequest } from "pages/sales-intelligence/sub-modules/industries/types";
import {
    IndustryUnionFilters,
    OptionsConfigType,
    TrafficTypes,
} from "pages/sales-intelligence/pages/find-leads/components/IndustryLeads/IndustyResult/types";

type TableTopIndustryProps = {
    onClickToggleColumns(index: number): void;
    onFilterChange(value: Record<string, string>): void;
    isLoading: boolean;
    searchTypeFilterPlaceholder: string;
    filtersStateObject: Partial<IndustryParamsRequest>;
    selectedTableType: string;
    trafficTypes: TrafficTypes[];
    sourceTypes: unknown[];
    allCategories: unknown[];
    tableColumns: Record<string, any>[];
    tableTypeOptions: OptionsConfigType[];
    filters: IndustryUnionFilters;
};

export const TableTop: React.FC<TableTopIndustryProps> = ({
    tableColumns,
    onClickToggleColumns,
    filtersStateObject,
    onFilterChange,
    trafficTypes,
    allCategories,
    isLoading,
    sourceTypes,
    filters,
    selectedTableType,
    searchTypeFilterPlaceholder,
    tableTypeOptions,
}) => {
    const onColumnToggle = (key) => {
        onClickToggleColumns(parseInt(key));
    };

    const industryTableContext = useIndustryTableContext({
        filtersStateObject,
        onFilterChange,
        allCategories,
        sourceTypes,
        isLoading,
        selectedTableType,
        searchTypeFilterPlaceholder,
        tableTypeOptions,
        trafficTypes,
    });

    return (
        <TableContextProvider value={industryTableContext}>
            <TopStyled>
                <TopStyledLeft>
                    <TableFilters availableFilters={filters} />
                </TopStyledLeft>
            </TopStyled>
            <SearchTableContainer>
                <SearchFilter />
                <Right>
                    <FlexRow>
                        <div>
                            <ColumnsPickerLite
                                {...getColumnsPickerLiteProps(tableColumns, onColumnToggle)}
                            />
                        </div>
                    </FlexRow>
                </Right>
            </SearchTableContainer>
        </TableContextProvider>
    );
};
