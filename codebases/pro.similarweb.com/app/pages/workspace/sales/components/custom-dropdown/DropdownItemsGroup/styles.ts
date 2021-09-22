import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const StyledGroupTitle = styled(FlexRow)`
    align-items: center;
    margin-bottom: 9px;
    margin-top: 17px;
    padding: 0 15px;

    > ${SWReactIcons} {
        margin-right: 8px;
    }

    > span {
        color: ${colorsPalettes.carbon["500"]};
        font-size: 14px;
        font-weight: 500;
    }
`;
