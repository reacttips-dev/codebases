import styled from "styled-components";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { Link } from "@similarweb/ui-components/dist/link";
import React from "react";

export const OptInBanner = styled(FlexRow)<{ optedIn: boolean }>`
    border-top: ${({ optedIn }: any) =>
        optedIn ? `4px solid ${colorsPalettes.mint["400"]}` : "none"};
    align-items: center;
    padding: 12px 16px;
    background-color: ${colorsPalettes.blue["100"]};
`;
export const OptInBannerInner = styled(FlexRow)`
    width: 100%;
    align-items: center;
    justify-content: space-between;
`;
export const OptInBannerInnerBlock = styled(FlexRow)`
    & > * {
        margin: 0 4px;
    }
`;
export const OptInBannerMainText = styled.div`
    font-size: 14px;
    line-height: 16px;
    color: ${colorsPalettes.midnight["500"]};
`;
export const OptInBannerSecondaryText = styled.div`
    font-size: 14px;
    line-height: 16px;
    color: ${rgba(colorsPalettes.carbon["500"], 0.8)};
`;

export const StyledLink = styled(Link)`
    font-size: 14px;
    line-height: 16px;
`;
