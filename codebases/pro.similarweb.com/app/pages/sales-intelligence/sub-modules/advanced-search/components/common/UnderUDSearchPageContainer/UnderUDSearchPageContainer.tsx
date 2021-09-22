import React from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import advancedSearchSettingsService from "../../../services/advancedSearchSettingsService";
import FindLeadsSearchPageContainer from "pages/sales-intelligence/pages/find-leads-search/FindLeadsSearchPageContainer";
import ComposedRootContainer from "../RootContainer/RootContainer";

const UnderUDSearchPageContainer = () => {
    if (advancedSearchSettingsService.isAdvancedSearchEnabled) {
        return <ComposedRootContainer />;
    }

    return <FindLeadsSearchPageContainer />;
};

SWReactRootComponent(UnderUDSearchPageContainer, "UnderUDSearchPageContainer");
