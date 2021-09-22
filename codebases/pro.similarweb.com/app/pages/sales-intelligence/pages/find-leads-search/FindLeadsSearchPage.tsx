import React from "react";
import { FIND_LEADS_PAGE_ROUTE, FIND_LEADS_SEARCH_RESULT_ROUTE } from "../../constants/routes";
import { FindLeadsSearchPageContainerProps } from "./FindLeadsSearchPageContainer";
import BaseSearchPage from "../search/BaseSearchPage";

const FindLeadsSearchPage = (props: FindLeadsSearchPageContainerProps) => {
    return (
        <BaseSearchPage
            {...props}
            backRoute={FIND_LEADS_PAGE_ROUTE}
            resultsRoute={FIND_LEADS_SEARCH_RESULT_ROUTE}
        />
    );
};

export default FindLeadsSearchPage;
