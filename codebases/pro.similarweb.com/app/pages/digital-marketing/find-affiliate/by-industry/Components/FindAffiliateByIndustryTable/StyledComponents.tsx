import * as React from "react";
import styled from "styled-components";
import { CategoryItem } from "components/React/CategoriesDropdown/CategoryDropdown";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const TopStyled = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px;
`;
export const TopStyledLeft = styled.div`
    display: flex;
    align-items: center;
`;
export const ChipWrapper = styled.div`
    padding-left: 8px;
`;
export const StyledLabel = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon[500], $weight: 300, $size: 16 })};
`;
export const CategoryItemWrapper = styled(CategoryItem)`
    font-weight: 400;
`;
export const RightWrapper = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;
export const NewChangeWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;
