import * as React from "react";
import styled from "styled-components";
import { DefaultCellHeader } from "./DefaultCellHeader";

export const DefaultCellHeaderRightAlign = styled(DefaultCellHeader)`
    flex-direction: row-reverse;
    display: flex;
    width: 100%;
    .u-flex-row {
        flex-direction: row-reverse;
        max-width: 100%;
    }
`;
DefaultCellHeaderRightAlign.displayName = "DefaultCellHeaderRightAlign";
