import styled from "styled-components";

/**
 * all info in config of the table;
 * 220 width of domain column
 * 268 - 200(width domain) 48(width checkbox columns)
 */

export const StyledResultsTable = styled.div<{ showCheckBox: boolean }>`
    .add-to-list-table-selection {
        overflow: visible;
    }

    .swReactTable-header-wrapper.css-sticky-header {
        top: 56px;
    }

    .swReactTable-pinned > {
        div:nth-child(1) {
            display: ${({ showCheckBox }) => (showCheckBox ? "block" : "none")};
        }
        div:nth-child(2) {
            flex-basis: ${({ showCheckBox }) => (showCheckBox ? "220" : "268")}px !important;
        }
    }
`;
