import React from "react";
import { NewSearchPageContainerProps } from "./NewSearchPageContainer";
import { MY_LISTS_PAGE_ROUTE, NEW_DYNAMIC_LIST_SEARCH_RESULT_ROUTE } from "../../constants/routes";
import BaseSearchPage from "./BaseSearchPage";

// TODO: [lead-gen-remove]
const NewSearchPage = (props: NewSearchPageContainerProps) => {
    return (
        <BaseSearchPage
            {...props}
            backRoute={MY_LISTS_PAGE_ROUTE}
            resultsRoute={NEW_DYNAMIC_LIST_SEARCH_RESULT_ROUTE}
        />
    );
};

export default NewSearchPage;
