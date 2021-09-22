import styled from "styled-components";
import { colorsPalettes, fonts, mixins } from "@similarweb/styles";

export const CUSTOM_MODAL_STYLES = {
    content: { padding: 0, width: 460 },
};

export const StyledButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 4px 16px 16px;
`;

export const StyledImageContainer = styled.div`
    width: 132px;
`;

export const StyledMainContainer = styled.div`
    align-items: center;
    display: flex;
    flex-grow: 1;
    justify-content: center;
`;

export const StyledSubtitle = styled.p`
    ${mixins.setFont({ $size: 13, $color: colorsPalettes.carbon["400"] })};
    line-height: 16px;
    margin: 16px 0 0;
`;

export const StyledTitle = styled.h2`
    ${mixins.setFont({
        $size: 20,
        $color: colorsPalettes.carbon["500"],
        $family: fonts.$dmSansFontFamily,
        $weight: 500,
    })};
    line-height: 24px;
    margin: 0;
`;

export const StyledHeader = styled.div`
    padding: 20px 24px 0;
`;

export const StyledModalContent = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 288px;
`;
