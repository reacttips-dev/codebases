import styled from "styled-components";
import { Box } from "@similarweb/ui-components/dist/box";
import { BooleanSearchInputWrap, Input } from "@similarweb/ui-components/dist/boolean-search";
import { colorsPalettes } from "@similarweb/styles";
import { TextContainer } from "components/core cells/src/CoreWebsiteCell/StyledComponents";
import { EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { CategoryItem } from "components/React/CategoriesDropdown/CategoryDropdown";

export const PageContent = styled(Box)`
    width: auto;
    height: auto;
`;

export const PaginationWrapper = styled.div`
    padding-top: 18px;
    padding-bottom: 18px;
`;

export const SubDomainSelectionContainer = styled.div`
    padding-left: 16px;
    height: 72px;
    display: flex;
    align-items: center;
`;

export const CategorySelectionContainer = styled.div`
    height: 72px;
    display: flex;
    align-items: center;
`;

export const SearchContainer = styled.div`
    display: flex;
    height: 56px;
    box-sizing: border-box;
    border: 1px solid #e5e7ea;
    border-bottom: 0;
    border-width: 1px 0;
    align-items: center;
    padding: 0 24px;
    cursor: text;
    ${BooleanSearchInputWrap} {
        display: flex;
    }
    ${Input} {
        width: 0;
        flex-grow: 1;
    }
`;

export const TooltipCellHeaderContentWrapper = styled.div`
    ${TextContainer} {
        margin-left: 11px;
    }
`;

export const AlignCenterContainer = styled.div`
    display: flex;
    justify-content: center;
`;

export const CheckMarkContainer = styled(AlignCenterContainer)`
    height: 100%;
    svg path {
        fill: ${colorsPalettes.blue[400]};
    }
    align-items: center;
`;

export const TableContainer = styled.div`
    display: flex;
    flex-direction: column;

    & .swReactTable-container.swReactTable-header {
        width: auto !important;
    }
    & > :last-child {
        align-self: flex-end;
    }

    .swReactTable-column:last-child {
        border-right: 0;
    }
    .u-no-padding {
        padding: 0;
    }
`;

export const StyledFiltersWrapper = styled.div`
    display: flex;
    align-items: center;
`;

export const StyledFilter = styled.div`
    display: flex;
    min-width: 60px;

    &.SubDomainWrapper {
        position: relative;
    }
    &.CategoryWrapper {
        position: relative;
    }
`;

export const StyledCheckboxContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;
export const StyledTextContainer = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 18ch;
    flex: 1;
    flex-basis: 33%;
`;
export const StyledTrafficContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-right: 10px;
`;
export const StyledItemInnerWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
`;

export const StyledEllipsisDropdownItem = styled(EllipsisDropdownItem)`
    width: 100%;
    & > div {
        min-width: 95%;
        & > div {
            min-width: 95%;
        }
    }
`;

export const StyledCategoryWrapper = styled.div`
    padding-left: 16px;
`;

export const CategoryItemContainer = styled(CategoryItem)`
    font-weight: ${({ isChild }) => (isChild ? "400" : "800")};
`;

export const StyledCategoryItem = styled.div`
    display: flex;
`;
