import { colorsPalettes, rgba } from "@similarweb/styles";
import styled from "styled-components";
import { StyledFlexWrapper } from "../../../../components/Chart/src/components/PointValueAndChange";
import { StyledPrimaryTitle } from "../../../../styled components/StyledBoxTitle/src/StyledBoxTitle";
import { BoxContainer } from "../../../app performance/src/page/single/usage section/styledComponents";

export const SidebarGraphWrapper = styled.div`
    ${BoxContainer} {
        height: 272px;
        width: 392px;
        box-shadow: none;
        border: 1px solid ${rgba(colorsPalettes.midnight[600], 0.08)};
        border-radius: 6px;
        margin-top: 8px;
        ${StyledFlexWrapper} {
            margin: 8px 0;
        }
    }
    ${StyledPrimaryTitle} {
        font-weight: 500;
    }
`;
SidebarGraphWrapper.displayName = "SidebarGraphWrapper";
