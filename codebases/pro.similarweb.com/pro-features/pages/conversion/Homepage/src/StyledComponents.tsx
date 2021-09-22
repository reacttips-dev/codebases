import { colorsPalettes, rgba } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import * as React from "react";
import styled from "styled-components";
import { FlexColumn, FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";

export const ConversionHomepageContainer = styled(FlexRow)`
    font-family: Roboto;
    padding: 32px;
    justify-content: center;
`;
ConversionHomepageContainer.displayName = "ConversionHomepageContainer";

export const PageTitle = styled.div`
    font-size: 24px;
    color: ${colorsPalettes.carbon["500"]};
`;
PageTitle.displayName = "PageTitle";

export const PageDescription = styled.div`
    width: 500px;
    font-size: 14px;
    color: ${colorsPalettes.carbon["400"]};
    margin-top: 12px;
`;
PageDescription.displayName = "PageDescription";

export const TilesContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    background-color: ${colorsPalettes.bluegrey["100"]};
    max-width: 1691px;
    @media (max-width: 1480px) and (min-width: 1024px) {
        max-width: calc(100% - 50px);
    }
    @media (max-width: 1024px) {
        max-width: 100%;
    }
`;
TilesContainer.displayName = "TilesContainer";

export const TilesTitle = styled.div`
    font-size: 16px;
    color: ${colorsPalettes.midnight["500"]};
`;
TilesTitle.displayName = "TilesTitle";

export const Title = styled.div`
    text-transform: capitalize;
    margin-bottom: 16px;
    font-size: 20px;
    font-weight: 500;
    color: ${colorsPalettes.carbon[500]};
`;
Title.displayName = "Title";

export const SWGroupsTilesContainer = styled(FlexRow)`
    flex-wrap: wrap;
`;

export const PlaceholderTitle = styled(FlexRow)`
    font-size: 20px;
    color: ${colorsPalettes.carbon["200"]};
`;
PlaceholderTitle.displayName = "PlaceholderTitle";

export const TemporaryBox = styled(Box)`
    width: 415px;
    height: 70px;
    padding: 24px;
    transition: box-shadow 0.25s;

    &:hover {
        box-shadow: 0 3px 6px ${rgba(colorsPalettes.midnight[600], 0.2)};
        cursor: pointer;
    }
`;
TemporaryBox.displayName = "TemporaryBox";

export const StyledBoxLink = styled.a.attrs({
    target: "_self",
})`
    margin: 24px 24px 0px 0px;
    color: ${colorsPalettes.carbon[500]};
`;
StyledBoxLink.displayName = "StyledBoxLink";

export const CustomGroupButtonContainer = styled(FlexRow)`
    justify-content: flex-end;
    padding: 0 8px;
`;
CustomGroupButtonContainer.displayName = "CustomGroupButtonContainer";
