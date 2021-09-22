import styled from "styled-components";
import { DefaultCellHeader } from "./DefaultCellHeader";

export const DefaultEllipsisHeaderCell = styled(DefaultCellHeader)`
    flex-direction: row;
    display: flex;
    width: 100%;
    .u-flex-row {
        flex-direction: row;
        max-width: 100%;
    }
`;
DefaultEllipsisHeaderCell.displayName = "DefaultEllipsisHeaderCell";
