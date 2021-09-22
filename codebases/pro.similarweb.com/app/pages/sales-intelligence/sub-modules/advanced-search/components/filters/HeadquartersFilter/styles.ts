import styled from "styled-components";
import { RadioButton } from "@similarweb/ui-components/dist/radio-button";
import CommonRadioSelect from "../../common/CommonRadioSelect/CommonRadioSelect";

export const StyledZipCodeContainer = styled.div`
    margin-top: 12px;
`;

export const StyledZipCodeChipsContainer = styled.div`
    padding-top: 8px;
    margin-bottom: 12px;
`;

export const StyledChipsContainer = styled.div`
    margin-bottom: 12px;
`;

export const StyledMainDDContainer = styled.div`
    margin-top: 16px;
    position: relative;
`;

export const StyledInclusionDDContainer = styled.div`
    min-width: 150px;
    position: relative;
    width: 212px;
`;

export const StyledRadioButton = styled(RadioButton)`
    padding: 0;
`;

export const StyledRadio = styled.div`
    &:not(:last-child) {
        margin-right: 32px;
    }
`;

export const StyledRadioContainer = styled(CommonRadioSelect)`
    align-items: center;
    display: flex;
    flex-grow: 1;
    margin-right: 12px;
`;

export const StyledTopContainer = styled.div`
    display: flex;
`;
