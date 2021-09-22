import { colorsPalettes } from "@similarweb/styles";
import { ItemIcon } from "@similarweb/ui-components/dist/item-icon";
import * as React from "react";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled from "styled-components";
import { FlexRow } from "../../../../styled components/StyledFlex/src/StyledFlex";

// 130px is the max size for " + 9999 more sites/apps"
export const maxMoreSourcesText = "130px";

export const SourcesLine = styled(FlexRow)`
    font-size: 14px;
    line-height: 1.8;
`;
SourcesLine.displayName = "SourcesLine";

export const SourcesContainer = styled(FlexRow)`
    max-width: calc(100% - ${maxMoreSourcesText});
    overflow: hidden;
`;
SourcesContainer.displayName = "SourcesContainer";

export const SourceContent = styled(FlexRow)`
    overflow: hidden;
`;
SourceContent.displayName = "SourceContent";

export const SourceText = styled.div`
    margin-right: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;
SourceText.displayName = "SourceText";

export const SourceIcon = styled(ItemIcon)`
    height: 24px;
    width: 24px;
    margin-right: 8px;
    flex-shrink: 0;
`;
SourceIcon.displayName = "SourceIcon";

export const MoreSourcesText = styled(FlexRow)`
    width: ${maxMoreSourcesText};
`;
MoreSourcesText.displayName = "MoreSourcesText";

export const Pipe = styled.div`
    margin-right: 12px;
`;
Pipe.displayName = "Pipe";

export const MoreText = styled.div`
    line-height: 1.2;
    transform: translateY(4px);
`;
MoreText.displayName = "MoreText";
