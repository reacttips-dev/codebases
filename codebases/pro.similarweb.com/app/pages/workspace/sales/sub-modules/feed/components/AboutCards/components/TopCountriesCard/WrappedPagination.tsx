import React from "react";
import { TablePagination } from "pages/workspace/sales/components/Pagination/Pagination";
import { StyledPaginationWrapper } from "../../styles";
import { TOP_COUNTRIES_PAGE_SIZE } from "./consts";

export const TopCountriesPagination = (
    page: number,
    pages: number,
    handlePageChange: (page: number) => void,
    itemsData?: object[],
) => (
    <StyledPaginationWrapper>
        {
            <TablePagination
                page={page}
                pages={pages}
                handlePageChange={handlePageChange}
                items={itemsData}
                itemsPerPage={TOP_COUNTRIES_PAGE_SIZE}
            />
        }
    </StyledPaginationWrapper>
);
