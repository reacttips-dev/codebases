import { colorsPalettes, colorsSets } from "@similarweb/styles";
import { ButtonLabel } from "@similarweb/ui-components/dist/button";
import { Flex } from "pages/Leading Folders/src/LeadingFoldersInfoPanel";
import * as React from "react";
import styled from "styled-components";
import { SourceIcon } from "../../../.pro-features/components/Legends/src/SitesAppsLegend/StyledComponents";
import { FlexRow } from "../../../.pro-features/styled components/StyledFlex/src/StyledFlex";

export const ConversionSegmentTitle = styled.div`
    text-transform: none;
    overflow: hidden;
    max-width: 420px;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 64px;
`;

export const QueryBarContainer = styled.div`
    display: flex;
    align-items: center;
    ${ButtonLabel} {
        text-transform: none;
        font-weight: 400;
    }
`;
QueryBarContainer.displayName = "QueryBarContainer";

export const DropElem = styled(FlexRow)`
    width: 75%;
    text-align: left;
    text-indent: 0;
    ${SourceIcon} {
        margin-left: 8px;
        transform: translateY(8px);
    }
`;
DropElem.displayName = "DropElem";

export const BtnDropElem = styled(DropElem)`
    width: 100%;
    ${SourceIcon} {
        transform: translateY(6px);
    }
`;
BtnDropElem.displayName = "BtnDropElem";

export const CatDropElem = styled.div`
    width: 75%;
    text-align: left;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;
CatDropElem.displayName = "CatDropElem";

export const DomainText = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    color: ${colorsPalettes.carbon["500"]};
    font-weight: 500;
`;
DropElem.displayName = "DropElem";
