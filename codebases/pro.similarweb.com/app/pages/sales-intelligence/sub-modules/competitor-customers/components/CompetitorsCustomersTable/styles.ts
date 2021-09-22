import styled from "styled-components";

export const StyledResultsTable = styled.div<{ showCheckBox: boolean }>`
    .add-to-list-table-selection {
        overflow: visible;
    }

    .swReactTable-header-wrapper.css-sticky-header {
        top: 56px;
    }

    .swReactTable-pinned {
        display: ${({ showCheckBox }) => (showCheckBox ? "block" : "none")};
    }
`;
