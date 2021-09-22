import { colorsPalettes } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";

export const StyledFlexRow: any = styled(FlexRow)`
    padding: 12px;
    font-size: 16px;
    align-items: center;
`;

export const BoxContainer: any = styled(Box)`
    width: 100%;
    max-width: 800px;
    height: auto;
    border-radius: 6px 6px 0px 0px;
    padding: 30px;
    margin: auto;
    margin-top: 20px;
    .row-container {
        border-bottom: 1px solid ${colorsPalettes.carbon["50"]};
    }
`;

export const LoaderContainer: any = styled(FlexRow)`
    padding: 10px;
    justify-content: center;
    align-items: center;
    min-height: 450px;
`;

export const StyledFlexRowAlignRight = styled(StyledFlexRow)`
    justify-content: flex-end;
`;

export const FeatureLabel: any = styled.div`
    flex-grow: 1;
`;

export const Header = styled(FeatureLabel)`
    font-size: 24px;
    color: ${colorsPalettes.carbon["400"]};
`;
