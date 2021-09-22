import React from "react";
import { BooleanSearch } from "@similarweb/ui-components/dist/boolean-search";
import { IBooleanSearchChipItem } from "@similarweb/ui-components/dist/boolean-search/src/BooleanSearch";
import { actionListItems } from "./contactsSearchConfig";
import {
    generateContactsFiltersParams,
    generateContactsSearchParams,
} from "pages/sales-intelligence/sub-modules/right-sidebar/helpers/contacts";
import {
    DEFAULT_PAGE,
    PAGE_SIZE,
} from "pages/sales-intelligence/sub-modules/right-sidebar/constants/contacts";
import ContactsTabContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/ContactsTabContext";
import RightSidebarContext from "pages/sales-intelligence/sub-modules/right-sidebar/contexts/RightSidebarContext";
import { useTranslation } from "components/WithTranslation/src/I18n";
import useContactsTrackingService from "pages/sales-intelligence/hooks/useContactsTrackingService";
import { BooleanSearchWrapper } from "./styles";

const ContactsSearch = () => {
    const translate = useTranslation();
    const { website } = React.useContext(RightSidebarContext);
    const tracking = useContactsTrackingService();
    const { selectedFilters, fetchContacts, searchChips, setSearchChips } = React.useContext(
        ContactsTabContext,
    );

    const actions = React.useMemo(() => actionListItems(translate), []);

    const onChange = (items: IBooleanSearchChipItem[]) => {
        tracking.trackSearchRoles(items);
        setSearchChips(items);
        const paramsFilters = generateContactsFiltersParams(selectedFilters);
        const paramsSearch = generateContactsSearchParams(items);

        if (website?.domain) {
            fetchContacts(website.domain, {
                ...paramsFilters,
                ...paramsSearch,
                pageSize: PAGE_SIZE,
                page: DEFAULT_PAGE,
            });
        }
    };

    return (
        <BooleanSearchWrapper>
            <BooleanSearch
                withChipPrefix={false}
                chips={searchChips}
                placeholder={translate("si.sidebar.contacts.search.placeholder")}
                onChange={onChange}
                actionListItems={actions}
            />
        </BooleanSearchWrapper>
    );
};

export default ContactsSearch;
