import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledWebsitesSectionTitle = styled.div`
    margin-bottom: 4px;

    span {
        ${mixins.setFont({ $color: colorsPalettes.carbon["400"], $size: 14 })};
        color: ${colorsPalettes.carbon[400]};
    }
`;

export const StyledWebsitesSection = styled.div``;

export const StyledSubmitSection = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 25px;
`;

export const StyledListNameContainer = styled.div``;
