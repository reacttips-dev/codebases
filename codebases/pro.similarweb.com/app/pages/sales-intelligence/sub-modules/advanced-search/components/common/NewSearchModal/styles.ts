import styled from "styled-components";
import { colorsPalettes, fonts, mixins, rgba } from "@similarweb/styles";

export const CUSTOM_MODAL_STYLES = {
    content: { padding: 0, marginTop: 140, maxWidth: 998, width: "78%" },
    overlay: {
        backgroundColor: rgba(colorsPalettes.midnight["300"], 0.7),
    },
};

export const StyledSearchItemsContainer = styled.div`
    display: grid;
    gap: 22px;
    grid-template-columns: repeat(auto-fill, minmax(212px, 1fr));
    margin-top: 24px;
    padding: 0 24px 24px;
`;

export const StyledSubTitle = styled.p`
    ${mixins.setFont({
        $size: 14,
        $color: colorsPalettes.carbon["400"],
    })};
    line-height: normal;
    margin: 8px 0 0;
`;

export const StyledTitle = styled.h2`
    ${mixins.setFont({
        $size: 20,
        $weight: 500,
        $family: fonts.$dmSansFontFamily,
        $color: colorsPalettes.carbon["500"],
    })};
    line-height: normal;
    margin: 0;
`;

export const StyledTitleContainer = styled.div`
    padding: 20px 24px 0;
`;

export const StyledModalContent = styled.div``;
