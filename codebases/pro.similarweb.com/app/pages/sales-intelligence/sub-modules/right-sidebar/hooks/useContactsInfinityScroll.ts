import React, { MutableRefObject } from "react";
import ContactsTabContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/ContactsTabContext";
import RightSidebarContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/RightSidebarContext";
import {
    DEFAULT_PAGE,
    PAGE_SIZE,
} from "pages/sales-intelligence/sub-modules/right-sidebar/constants/contacts";

const useContactsInfinityScroll = () => {
    const { updatingContacts, updateContacts, selectedFilters, totalCount } = React.useContext(
        ContactsTabContext,
    );
    const { website } = React.useContext(RightSidebarContext);

    const observer = React.useRef(null);
    const [page, setPage] = React.useState(DEFAULT_PAGE);
    const hasMore = PAGE_SIZE * page < totalCount;

    React.useEffect(() => {
        if (page !== DEFAULT_PAGE) {
            setPage(DEFAULT_PAGE);
        }
    }, [selectedFilters]);

    React.useEffect(() => {
        if (website?.domain && page > DEFAULT_PAGE) {
            updateContacts(website?.domain, { ...selectedFilters, pageSize: PAGE_SIZE, page });
        }
    }, [page]);

    const lastBookElementRef = React.useCallback(
        (node: HTMLInputElement | null) => {
            if (updatingContacts) {
                return true;
            }

            observer.current?.disconnect();

            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMore) {
                        setPage(page + 1);
                    }
                },
                { threshold: 1.0 },
            );
            if (node) {
                observer.current?.observe(node);
            }
        },
        [updatingContacts, hasMore],
    );

    return lastBookElementRef;
};

export default useContactsInfinityScroll;
