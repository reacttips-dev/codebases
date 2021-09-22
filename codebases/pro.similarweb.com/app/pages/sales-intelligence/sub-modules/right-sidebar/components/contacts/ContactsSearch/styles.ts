import styled from "styled-components";
import {
    Input,
    BooleanSearchActionListStyled,
} from "@similarweb/ui-components/dist/boolean-search";
import { colorsPalettes } from "@similarweb/styles";

export const BooleanSearchWrapper = styled.div`
    padding: 5px 20px;
    display: flex;
    min-height: 52px;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
    background: ${colorsPalettes.carbon[0]};

    .boolean-search {
        width: 100%;
    }

    ${BooleanSearchActionListStyled} {
        background-color: ${colorsPalettes.carbon[0]};
    }

    ${Input} {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 38px;
    }
`;
