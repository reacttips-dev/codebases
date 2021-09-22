import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { Box } from "@similarweb/ui-components/dist/box";
import { Title } from "@similarweb/ui-components/dist/title";
import * as React from "react";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import StyledBoxSubtitle from "../../StyledBoxSubtitle/src/StyledBoxSubtitle";

export const StyledBox = styled(Box).attrs(() => ({
    width: "100%",
}))`
    height: auto;
    transition: box-shadow ease 350ms;
`;

export const StyledBoxWithBorder = styled(Box).attrs((props) => ({
    width: "100%",
}))`
    .GroupRowEllipsis {
        position: absolute;
        top: 4px;
        right: 4px;
    }
    position: relative;
    height: auto;
    box-shadow: none;
    border: 1px solid ${colorsPalettes.carbon[100]};
`;

export const StyledBoxWithHover = styled(StyledBox)`
    &:hover {
        box-shadow: 0 6px 10px 0 ${rgba(colorsPalettes.midnight[500], 0.15)};
    }
`;

export const StyledBoxTitleContainer = styled.div<{ alignItems?: string }>`
    padding: 40px 24px 18px 24px;
    display: flex;
    align-items: ${({ alignItems = "center" }) => alignItems};
    justify-content: space-between;
`;

export const StyledBoxFooterContainer = styled.div`
    padding: 0 24px;
    border-top: 1px solid ${colorsPalettes.carbon[50]};
    height: 66px;
    box-sizing: border-box;
    line-height: 66px;
`;

export const StyledHeaderSubtitle: any = styled(StyledBoxSubtitle)`
    height: 18px;
    pointer-events: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-top: 7px;
`;

export const StyledTitle = styled(Title)`
    display: flex;
    align-items: center;
`;

export const StyledTitleIcon = styled(SWReactIcons)`
    margin-left: 8px;
`;

export const StyledBoxWithMargin = styled(StyledBoxWithHover)`
    margin-bottom: 16px;
`;

export const TitleRight = styled.div`
    display: flex;
`;
export const TitleLeft = styled.div``;

export const QuotaAndUtilsContainer = styled.div`
    flex-shrink: 0;
`;
