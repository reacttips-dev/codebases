import React from "react";
import FiltersPanelContent from "./FiltersPanelContent";
import FiltersPanelContext from "../../../contexts/filtersPanelContext";

const FiltersPanelContentContainer = () => {
    const { isLoading, isExpanded, isFirstCategoryInitiallyExpanded } = React.useContext(
        FiltersPanelContext,
    );

    return (
        <FiltersPanelContent
            isLoading={isLoading}
            isVisible={isExpanded}
            shouldExpandFirstCategory={isFirstCategoryInitiallyExpanded}
        />
    );
};

export default FiltersPanelContentContainer;
