import styled from "styled-components";
import { ChipItemWrapper } from "@similarweb/ui-components/dist/chip/src/elements";
import { CategoryItem } from "components/React/CategoriesDropdown/CategoryDropdown";
import { colorsPalettes } from "@similarweb/styles";

export const TopStyled = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    display: flex;
    justify-content: space-between;
    padding: 12px;
    padding-bottom: 2px;
    background-color: ${colorsPalettes.carbon["0"]};
`;
export const TopStyledLeft = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
`;
export const ChipWrap = styled.div`
    padding-left: 8px;
    margin-bottom: 10px;
    &:first-child {
        padding-left: 0;
    }
    ${ChipItemWrapper} {
        margin-right: 0;
    }
`;

export const CategoryItemContainer = styled(CategoryItem)`
    font-weight: 400;
`;
