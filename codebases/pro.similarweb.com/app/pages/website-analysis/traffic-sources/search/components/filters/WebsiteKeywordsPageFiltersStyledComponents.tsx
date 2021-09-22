import styled from "styled-components";
import * as React from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { colorsPalettes } from "@similarweb/styles";

export const FiltersNewContainer = styled.div`
    padding-bottom: 8px;
`;
export const FiltersNewContent = styled.div`
    display: flex;
    flex-wrap: wrap;
`;

export const FiltersNewFilters = styled.div`
    flex-grow: 1;
    flex-wrap: wrap;
    max-width: 872px;
    display: flex;
    align-items: center;
    @media (max-width: 1291px) {
        max-width: 761px;
    }
`;

export const FiltersNewFiltersRow = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    > div {
        width: auto;
    }
`;
export const FiltersNewButtons = styled.div`
    flex-grow: 1;
    min-width: 180px;
    display: flex;
    align-items: flex-end;
    padding-bottom: 33px;
    flex-direction: row-reverse;
`;
export const ClearAllButton = styled(Button)`
    margin-right: 4px;
`;
export const FilterItem = styled.div`
    // override inline style
    width: auto !important;
    display: inline-flex;
`;
export const FilterItemChipdown = styled(FilterItem)`
    margin: 0 8px 8px 0;
`;
export const FilterItemCheckbox = styled(FilterItem)`
    margin: 0 14px 8px 0;
`;

export const WebsiteKeywordsPageForFindKeywordsByCompetitorsFiltersContainer = styled.div`
    padding: 10px 16px;
    height: 40px;
    border: 1px solid ${colorsPalettes.carbon[50]};
    border-top: none;
    @media (max-width: 1364px) {
        height: 100px;
    }
`;

export const FilterItemButton = styled(FilterItemChipdown)``;
