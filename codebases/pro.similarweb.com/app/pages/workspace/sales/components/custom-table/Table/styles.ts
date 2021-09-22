import styled, { css } from "styled-components";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import { TableCell } from "pages/workspace/sales/components/custom-table/types";

export const StyledTableColumn = styled.div<Omit<TableCell, "text"> & { length: number }>`
    & > div {
        ${({ align }) => {
            const justifyContent =
                align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start";
            const textAlign = align ? align : "left";

            return css`
                justify-content: ${justifyContent};
                text-align: ${textAlign};
            `;
        }};
    }

    ${({ length, size }) => {
        if (length === 1 || typeof size === "undefined") {
            return css`
                flex-grow: 1;
            `;
        }

        return css`
            flex: 0 0 ${size};
        `;
    }};
`;

export const StyledTableBody = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const StyledTableHeader = styled.div`
    display: flex;
    justify-content: flex-end;
`;

export const StyledTable = styled(FlexColumn)`
    height: 100%;
    width: 100%;
`;

export const StyledLogo = styled.div`
    margin-top: 11px;
    margin-left: auto;
`;
