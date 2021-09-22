import styled from "styled-components";
import CommonRadioSelect from "../../common/CommonRadioSelect/CommonRadioSelect";
import { StyledRadioContainer } from "../../common/CommonRadioSelect/styles";

export const StyledRadioSelect = styled(CommonRadioSelect)`
    ${StyledRadioContainer}:not(:first-child) {
        margin-top: 16px;
    }
`;
