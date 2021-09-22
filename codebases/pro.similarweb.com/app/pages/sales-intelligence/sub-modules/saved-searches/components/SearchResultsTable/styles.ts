import styled from "styled-components";

export const StyledExcelExportButton = styled.div`
    margin-left: 20px;
    margin-right: 16px;
`;

export const StyledResultsTable = styled.div`
    .add-to-list-table-selection {
        overflow: visible;
    }
`;

export const StyledSearchResultsTable = styled.div`
    .swReactTable-header-wrapper.css-sticky-header {
        top: 56px;
    }
`;

/**
 * all info in config of the table;
 * 340 width of domain column
 * 388 = 340(width domain) 48(width checkbox columns)
 */

export const StyledSearchResults = styled.div<{ showCheckBox: boolean }>`
    .swReactTable-pinned > {
        div:nth-child(1) {
            display: ${({ showCheckBox }) => (showCheckBox ? "block" : "none")};
        }
        div:nth-child(2) {
            flex-basis: ${({ showCheckBox }) =>
                showCheckBox ? "340" : "388"}px !important; // second + first
        }
    }
`;
