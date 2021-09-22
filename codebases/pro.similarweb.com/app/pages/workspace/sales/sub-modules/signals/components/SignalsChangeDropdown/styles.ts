import styled from "styled-components";
import SignalsChangeDropdown from "./SignalsChangeDropdown";
import { NoBorderButtonWrap } from "@similarweb/ui-components/dist/dropdown/src/chipdown/ChipdownStyles";

export const StyledChangeDropdown = styled(SignalsChangeDropdown)`
    min-width: 118px;
    margin-left: 16px;

    ${NoBorderButtonWrap} {
        justify-content: space-between;
        width: 100%;
    }
`;
