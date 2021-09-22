import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";
import CommonRadioSelect from "../../common/CommonRadioSelect/CommonRadioSelect";
import InteractiveTextInput from "../../common/InteractiveTextInput/InteractiveTextInput";

export const StyledInputTip = styled.p`
    ${mixins.setFont({ $color: colorsPalettes.carbon["300"], $size: 12 })};
    line-height: 16px;
    margin: 4px 0 0;
`;

export const StyledTextInput = styled(InteractiveTextInput)<{ hasChips: boolean }>`
    margin-top: ${({ hasChips }) => (hasChips ? 8 : 12)}px;
`;

export const StyledChipsContainer = styled.div`
    margin-top: 16px;
`;

export const StyledDomainsContainer = styled.div``;

export const StyledRadioContainer = styled(CommonRadioSelect)`
    align-items: center;
    display: flex;
    padding-bottom: 4px;
`;
