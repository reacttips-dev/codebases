import styled from "styled-components";

export const StyledResultsTable = styled.div<{
    showCheckBox: boolean;
    widthDomain: number;
    widthCheckbox: number;
}>`
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
            flex-basis: ${({ showCheckBox, widthDomain, widthCheckbox }) =>
                showCheckBox ? widthDomain : widthDomain + widthCheckbox}px !important;
        }
    }
`;

export const StyledIndustriesTablePagination = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 10px 15px;
    span {
        font-size: 12px !important;
    }
`;
