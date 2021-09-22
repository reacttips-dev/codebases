import React from "react";
import { TableTrafficSelect } from "./Filters/TrafficFilter/View";
import { SourceTypeFilter } from "./Filters/SearchSelect/View";
import { SearchTypeFilter } from "./Filters/SearchTypeFilter/View";
import { CategoryFilter } from "./Filters/CategoryFilter/View";
import { WebsiteTypeFilter } from "./Filters/WebsiteTypeFilter/View";
import { TopStyledLeft, ChipWrap, TopStyled } from "./styles";
import { TableFilterPropsType } from "../../types";

export function TableFilters({
    tableTypeProps,
    sourceTypeProps,
    searchTypeProps,
    categoryProps,
    websiteFilterProps,
}: TableFilterPropsType) {
    return (
        <TopStyled>
            <TopStyledLeft>
                <ChipWrap>
                    <TableTrafficSelect {...tableTypeProps} />
                </ChipWrap>
                <ChipWrap>
                    <SourceTypeFilter {...sourceTypeProps} />
                </ChipWrap>
                <ChipWrap>
                    <SearchTypeFilter {...searchTypeProps} />
                </ChipWrap>
                <ChipWrap>
                    <CategoryFilter {...categoryProps} />
                </ChipWrap>
                <ChipWrap>
                    <WebsiteTypeFilter {...websiteFilterProps} />
                </ChipWrap>
            </TopStyledLeft>
        </TopStyled>
    );
}
