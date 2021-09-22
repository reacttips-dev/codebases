import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StyledSeparator = styled.div`
    background-color: ${colorsPalettes.blue["400"]};
    bottom: 1px;
    height: 1px;
    left: 0;
    margin-left: 8px;
    margin-right: 8px;
    position: absolute;
    width: calc(100% - 16px);
    z-index: 2;
`;

export const StyledDropdownSearch = styled.div`
    position: relative;

    .input-container {
        height: auto;

        input {
            padding: 22px 16px 22px 0;
        }
    }
`;
