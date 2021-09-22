import { Flex } from "pages/Leading Folders/src/LeadingFoldersInfoPanel";
import * as React from "react";
import styled from "styled-components";
import { FlexRow } from "../../../../../styled components/StyledFlex/src/StyledFlex";

const br0 = "648px";

export const TablesContainer: any = styled(FlexRow)`
    justify-content: space-between;
    flex-wrap: wrap;
    @media (max-width: ${br0}) {
        > div:not(:first-child) {
            margin-top: 24px;
        }
    }
`;
TablesContainer.displayName = "TablesContainer";
