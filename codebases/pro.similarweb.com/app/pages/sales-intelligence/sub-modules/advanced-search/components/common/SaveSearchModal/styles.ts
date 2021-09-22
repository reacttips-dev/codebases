import styled from "styled-components";
import { colorsPalettes, fonts, mixins } from "@similarweb/styles";

export const CUSTOM_MODAL_STYLES = {
    content: { padding: 0, width: 460 },
};

export const StyledButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 0 16px 16px;

    & > *:not(:first-child) {
        margin-left: 4px;
    }
`;

export const StyledNameInputLabel = styled.div`
    line-height: 20px;
    margin-bottom: 4px;

    span {
        ${mixins.setFont({ $color: colorsPalettes.carbon["300"], $size: 12 })};
    }
`;

export const StyledNameInputContainer = styled.div`
    margin-bottom: 24px;
    margin-top: 16px;
    padding: 0 24px;
`;

export const StyledSubtitle = styled.p`
    ${mixins.setFont({ $size: 13, $color: colorsPalettes.carbon["400"] })};
    line-height: 16px;
    margin: 8px 0 0;
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

export const StyledModalContent = styled.div``;
