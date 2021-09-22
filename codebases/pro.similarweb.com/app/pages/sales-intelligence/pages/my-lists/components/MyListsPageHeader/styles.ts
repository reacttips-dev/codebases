import styled from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { StyledQuotaContainer } from "../../../../common-components/quota/QuotaContainer/styles";

export const StyledHeaderContent = styled(FlexRow)`
    align-items: center;
    justify-content: space-between;
    margin-top: 6px;
    position: relative;

    ${StyledQuotaContainer} {
        position: absolute;
        right: 0;
        top: -50%;
    }
`;

export const StyledHeaderDescription = styled.p`
    ${mixins.setFont({ $size: 14, $color: rgba(colorsPalettes.carbon["500"], 0.6) })};
    margin: 0;
`;

export const StyledHeaderTitle = styled.h1`
    ${mixins.setFont({ $size: 32, $color: colorsPalettes.carbon["500"], $weight: 500 })};
    margin: 0;
`;

export const StyledHeaderContainer = styled.div`
    padding-top: 25px;
`;
