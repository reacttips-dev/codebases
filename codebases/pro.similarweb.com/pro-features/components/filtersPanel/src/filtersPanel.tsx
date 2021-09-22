import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { NoBorderButton, TextWrapper } from "@similarweb/ui-components/dist/dropdown";
import { PillStyled } from "../../Pill/Pill";
import * as React from "react";
import styled from "styled-components";

export const AdvancedFilterButton = styled(NoBorderButton)`
    background-color: ${rgba(colorsPalettes.carbon[500], 0.1)};
    border-radius: 40px;
    padding: 4px 12px;
    height: 32px;
    box-sizing: border-box;
    ${TextWrapper} {
        display: flex;
        align-items: center;
        &,
        * {
            font-size: 13px;
        }
    }
    ${PillStyled} {
        margin-left: 10px;
        background-color: ${colorsPalettes.orange["400"]};
        font-size: 10px;
    }
    &:hover {
        background-color: ${rgba(colorsPalettes.carbon[500], 0.16)};
    }
`;
