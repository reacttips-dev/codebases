import { Pagination, PaginationInput } from "@similarweb/ui-components/dist/pagination";

export type TablePaginationProps = {
    page: number;
    pages: number;
    handlePageChange: (page: number) => void;
    items: unknown[];
    itemsPerPage: number;
};

export const TablePagination = ({
    page,
    handlePageChange,
    items,
    itemsPerPage,
}: TablePaginationProps) => {
    const itemsCount = items.length;
    return (
        <Pagination
            page={page}
            itemsCount={itemsCount}
            itemsPerPage={itemsPerPage}
            handlePageChange={handlePageChange}
            captionPosition="center"
            hasItemsPerPageSelect={false}
            captionElement={PaginationInput}
        />
    );
};
