import styled from "styled-components";
import { SearchContainer } from "pages/workspace/StyledComponent";
import { colorsPalettes } from "@similarweb/styles";

export const SearchTableContainer = styled(SearchContainer)`
    position: relative;
    z-index: 3;
    background-color: ${colorsPalettes.carbon[0]};
`;
