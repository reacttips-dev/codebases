import styled from "styled-components";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { IRightBarProps } from "pages/workspace/common components/RightBar/src/RightBar";
import { colorsPalettes } from "@similarweb/styles";
import { OverviewPageHeaderWrapper } from "pages/workspace/common components/OverviewPage/StyledComponents";

export const SalesWorkspaceWrapper = styled(FlexRow)`
    ${OverviewPageHeaderWrapper} {
        padding-top: 10px;
    }
`;

export const StyledFlexRow = styled(FlexRow)`
    height: 100%;
`;

export const StyledRecommendationContainer = styled.div<Partial<IRightBarProps>>`
    position: fixed;
    top: 0;
    right: 0;
    width: 440px;
    height: 100%;
    transform: translateX(${({ isOpen }) => (isOpen ? 0 : "100%")});
    transition: transform 300ms ease-in-out;
    z-index: 10;
    background-color: ${colorsPalettes.bluegrey[100]};
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
`;
