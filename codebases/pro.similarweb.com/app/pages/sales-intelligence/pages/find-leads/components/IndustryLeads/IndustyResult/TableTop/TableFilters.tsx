import React from "react";
import { ChipWrap } from "pages/sales-intelligence/pages/find-leads/components/styles";
import { WebsiteTypeFilter } from "../Filters/WebsiteTypeFilter/WebsiteTypeFilter";
import { SearchSelect } from "../Filters/SearchSelect/SearchSelect";
import { TableTypeSelect } from "../Filters/TableTypeSelect/TableTypeSelect";
import { CategoryFilter } from "../Filters/CategoryFilter/CategoryFilter";
import { TrafficTypeSelect } from "../Filters/TrafficTypeSelect/TrafficTypeSelect";

const TableFilters = ({ availableFilters }) => {
    const {
        showWebsiteFilter,
        showCategoryFilter,
        showSearchSelectFilter,
        showTrafficType,
    } = availableFilters;

    return (
        <>
            <ChipWrap>
                <TableTypeSelect />
            </ChipWrap>
            {showWebsiteFilter && (
                <ChipWrap>
                    <WebsiteTypeFilter />
                </ChipWrap>
            )}
            {showCategoryFilter && (
                <ChipWrap>
                    <CategoryFilter />
                </ChipWrap>
            )}
            {showSearchSelectFilter && (
                <ChipWrap>
                    <SearchSelect />
                </ChipWrap>
            )}
            {showTrafficType && (
                <ChipWrap>
                    <TrafficTypeSelect />
                </ChipWrap>
            )}
        </>
    );
};

export default TableFilters;
