import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { FilterItem } from "pages/website-analysis/traffic-sources/search/components/filters/WebsiteKeywordsPageFiltersStyledComponents";

export const StyledContactsFilters = styled.div`
    padding: 24px 16px 16px 16px;
    margin-top: 21px;
    border-bottom: 1px solid #e6e9ec;
    background-color: ${colorsPalettes.carbon["0"]};
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;

    & > div {
        margin-right: 8px;
        margin-bottom: 8px;
    }

    & > div:last-child {
        margin-right: 0;
    }
`;

export const StyledContactsFilterItem = styled(FilterItem)`
    position: relative;
`;

export const StyledCheckboxContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-right: 4px;
`;
