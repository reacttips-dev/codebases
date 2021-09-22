import { Box } from "@similarweb/ui-components/dist/box";
import { ShareBarContainer, ShareBarValue } from "@similarweb/ui-components/dist/share-bar";
import { Flex } from "pages/Leading Folders/src/LeadingFoldersInfoPanel";
import * as React from "react";
import styled from "styled-components";
import { StyledPrimaryTitle } from "../../../../../../styled components/StyledBoxTitle/src/StyledBoxTitle";
import { FlexRow } from "../../../../../../styled components/StyledFlex/src/StyledFlex";
import StyledLink from "../../../../../../styled components/StyledLink/src/StyledLink";

const br0 = "800px";

export const AudienceContainer: any = styled(Box)`
    width: 100%;
    height: auto;
    margin-top: 24px;
    font-family: Roboto;
`;
AudienceContainer.displayName = "AudienceContainer";

export const AudienceTitle: any = styled(StyledPrimaryTitle)`
    margin-bottom: 8px;
`;
AudienceTitle.displayName = "AudienceTitle";

export const CategoryRow: any = styled(FlexRow)`
    padding: 13px 8px 13px 24px;
    justify-content: space-between;
    align-items: center;
    border-top: ${({ loading }) => (loading ? "none" : "1px solid #e0e0e0")};
    @media (max-width: ${br0}) {
        height: 198px;
        box-sizing: border-box;
        flex-direction: column;
        padding: 25px 24px 27px 24px;
        align-items: ${({ loading }) => (loading ? "flex-start" : "center")};
        border-top: ${({ loading }) => (loading ? "none" : "2px solid #e0e0e0")};
    }
`;
CategoryRow.displayName = "CategoryRow";

export const TitlesRow: any = styled(CategoryRow)`
    margin-top: 14px;
    border-top: none;
    font-size: 12px;
    font-weight: 500;
    color: rgba(42, 62, 82, 0.6);
    @media (max-width: ${br0}) {
        display: none;
        + div {
            border-top: 1px solid #e0e0e0;
        }
    }
`;
TitlesRow.displayName = "TitlesRow";

export const Category: any = styled.div`
    flex: 0 0 154px;
    font-size: 14px;
    color: #2a3e52;
    font-weight: normal;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    @media (max-width: ${br0}) {
        width: calc(100% - 56px);
        flex: none;
        align-self: flex-start;
    }
`;
Category.displayName = "Category";

export const TitleCategory: any = styled(Category)`
    font-size: 12px;
    font-weight: 500;
    color: rgba(42, 62, 82, 0.6);
`;
TitleCategory.displayName = "TitleCategory";

export const TopApps: any = styled(FlexRow)`
    width: 192px;
    box-sizing: border-box;
    > a,
    svg {
        margin-right: 8px;
    }
    @media (max-width: ${br0}) {
        width: 100%;
        flex: none;
        justify-content: space-between;
        > a {
            margin-right: 0px;
        }
    }
`;
TopApps.displayName = "TopApps";

export const AudienceShareBar: any = styled.div`
    flex: 0 0 25%;
    @media (max-width: ${br0}) {
        width: 100%;
        flex: none;
        ${ShareBarContainer} {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            height: 36px;
        }
        ${ShareBarValue} {
            position: relative;
            top: -27px;
            margin-right: 0px;
        }
    }
`;
AudienceShareBar.displayName = "AudienceShareBar";

export const Link: any = styled(StyledLink)`
    flex: 0 0 146px;
    text-align: right;
    @media (max-width: ${br0}) {
        flex: none;
        align-self: flex-end;
        height: 24px;
        .Button {
            margin-right: -16px;
        }
    }
`;
Link.displayName = "Link";

export const AudienceLoadersContainer: any = styled(Box)`
    width: 100%;
    height: 410px;
    margin-top: 24px;
    .px-lod1 {
        margin-bottom: 8px;
    }
    .px-lod3 {
        position: relative;
        top: -13px;
    }
    .px-lod42 {
        rect {
            width: 100%;
        }
    }
    .px-lod43 {
        border-radius: 6px;
    }
    .px-lod44 {
        position: relative;
        top: -6px;
        width: 100px;
        height: 18px;
        padding-right: 16px;
        align-self: flex-end;
    }
    @media (max-width: ${br0}) {
        height: auto;
        .px-lod42 {
            width: 100%;
        }
        .px-lod44 {
            padding-right: 0px;
            top: 0px;
        }
    }
`;
AudienceLoadersContainer.displayName = "AudienceLoadersContainer";

export const NoDataContainer: any = styled.div`
    height: 315px;
`;
NoDataContainer.displayName = "NoDataContainer";
