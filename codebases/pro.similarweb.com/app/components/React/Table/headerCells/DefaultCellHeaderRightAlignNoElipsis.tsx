import styled from "styled-components";
import { DefaultCellHeader } from "components/React/Table/headerCells";

/**
 * Removes overflow effect from text. this is used to extend our support
 * in responsive views, for right-aligned cells that have small width
 */
export const DefaultCellHeaderRightAlignNoElipsis = styled(DefaultCellHeader)`
    flex-direction: row-reverse;
    display: flex;
    width: 100%;
    .u-flex-row {
        flex-direction: row-reverse;
        max-width: 100%;

        .u-truncate {
            overflow: visible;
        }
    }
`;
DefaultCellHeaderRightAlignNoElipsis.displayName = "DefaultCellHeaderRightAlignNoElipsis";
