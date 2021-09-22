import styled from "styled-components";
import { colorsPalettes, fonts, mixins, rgba } from "@similarweb/styles";
import { StyledSalesListItemIcon } from "pages/sales-intelligence/common-components/sales-list-item/styles";

export const CUSTOM_MODAL_STYLES = {
    content: { padding: 0, marginTop: 140, minHeight: 222, maxWidth: 998, width: "78%" },
    overlay: {
        backgroundColor: rgba(colorsPalettes.midnight["300"], 0.7),
    },
};

export const StyledItemsContainer = styled.div`
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    margin-top: 25px;
    padding: 20px 24px 34px;

    ${StyledSalesListItemIcon} svg path {
        fill: ${colorsPalettes.carbon["250"]};
    }
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
