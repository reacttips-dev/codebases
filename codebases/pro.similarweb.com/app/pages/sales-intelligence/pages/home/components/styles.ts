import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const StyledSectionTitle = styled.h3`
    ${mixins.setFont({ $size: 16, $weight: 500, $color: colorsPalettes.carbon["400"] })};
    line-height: 24px;
    margin: 0;
`;

export const StyledSectionTitleContainer = styled(FlexRow)`
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
`;
