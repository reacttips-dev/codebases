import styled from "styled-components";
import { StyledCategoriesDescription } from "../CategoriesHelperText/styles";

export const StyledCategoriesSection = styled.div`
    padding-bottom: 16px;

    ${StyledCategoriesDescription} {
        margin-bottom: 20px;
        margin-top: 15px;
    }
`;
