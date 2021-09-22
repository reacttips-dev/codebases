import styled from "styled-components";
import { RadioButton } from "@similarweb/ui-components/dist/radio-button";

export const StyledInfoIcon = styled.div`
    margin-left: 8px;
`;

export const StyledRadioButton = styled(RadioButton)`
    padding: 0;
`;

export const StyledRadioContainer = styled.div`
    align-items: center;
    display: flex;

    &:not(:last-child) {
        margin-right: 32px;
    }
`;

export const StyledRadioSelectContainer = styled.div``;
