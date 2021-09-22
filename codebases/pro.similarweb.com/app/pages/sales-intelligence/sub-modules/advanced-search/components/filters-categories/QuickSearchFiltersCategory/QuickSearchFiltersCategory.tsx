import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { WithExpandingProps } from "../../../types/common";
import FiltersCategory from "../FiltersCategory/FiltersCategory";
import TextSearchFilterContainer from "../../filters/TextSearchFilter/TextSearchFilterContainer";

const QuickSearchFiltersCategory = (props: WithExpandingProps) => {
    const translate = useTranslation();

    const renderSearchBox = (registerFilter: (key: string) => void) => {
        return (
            <>
                <TextSearchFilterContainer filterKey="searchText" onRegister={registerFilter} />
            </>
        );
    };

    return (
        <FiltersCategory
            {...props}
            groupsComponents={[]}
            renderAboveGroupsContent={renderSearchBox}
            name={translate("si.lead_gen_filters.category.quick_search")}
        />
    );
};

export default QuickSearchFiltersCategory;
