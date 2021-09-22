"use strict";

import { PaginationContainer } from "../StyledComponent";
import { Pagination } from "@similarweb/ui-components/dist/pagination";
import * as React from "react";

export function TablePager({ table, isTableLoading, handlePageChange, page, itemsPerPage }) {
    const { TotalCount } = table || { TotalCount: 0 };
    if (TotalCount > itemsPerPage) {
        return (
            <PaginationContainer>
                {!isTableLoading && (
                    <Pagination
                        handlePageChange={handlePageChange}
                        captionPosition={"center"}
                        page={page}
                        itemsCount={TotalCount}
                        itemsPerPage={itemsPerPage}
                        hasItemsPerPageSelect={false}
                    />
                )}
            </PaginationContainer>
        );
    }
    return null;
}
