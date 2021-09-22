import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { WithExpandingProps } from "../../../types/common";
import FiltersCategory from "../FiltersCategory/FiltersCategory";
import CheckboxFilterContainer from "../../filters/CheckboxFilter/CheckboxFilterContainer";

const ExcludeFiltersCategory = (props: WithExpandingProps) => {
    const translate = useTranslation();

    const renderCheckboxes = (registerFilter: (key: string) => void) => {
        return (
            <>
                <CheckboxFilterContainer filterKey="excludeUserLeads" onRegister={registerFilter} />
                <CheckboxFilterContainer filterKey="isNewOnly" onRegister={registerFilter} />
            </>
        );
    };

    return (
        <FiltersCategory
            {...props}
            groupsComponents={[]}
            renderAboveGroupsContent={renderCheckboxes}
            name={translate("si.lead_gen_filters.category.exclude")}
        />
    );
};

export default ExcludeFiltersCategory;
