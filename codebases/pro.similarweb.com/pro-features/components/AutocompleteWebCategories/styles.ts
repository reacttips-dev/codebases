import styled from "styled-components";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import { colorsPalettes } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import { setFont } from "@similarweb/styles/src/mixins";

export const AutocompleteStyled = styled(Autocomplete)`
    width: 100%;
`;

export const EmptyStateContainer = styled.div`
    height: 258px;
`;

export const IconWrapper = styled.div`
    margin: 56px 138px 16px 137px;
    svg {
        width: 96px;
        height: 71px;
    }
`;

export const Text = styled.div`
    ${setFont({ $size: 16, $weight: 400, $color: colorsPalettes.carbon[500] })};
    margin: 0 40px 16px 40px;
    line-height: 20px;
    text-align: center;
`;

export const ButtonWrapper = styled(Button)`
    display: flex;
    justify-content: center;
    margin: auto;
`;
