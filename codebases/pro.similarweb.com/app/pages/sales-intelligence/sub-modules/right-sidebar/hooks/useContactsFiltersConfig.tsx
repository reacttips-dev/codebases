import React from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { contactsFiltersConfig } from "pages/sales-intelligence/sub-modules/right-sidebar/helpers/contacts";
import useContactsTrackingService from "pages/sales-intelligence/hooks/useContactsTrackingService";

const useContactsFiltersConfig = () => {
    const translate = useTranslation();
    const tracking = useContactsTrackingService();

    return React.useMemo(() => contactsFiltersConfig(translate, tracking), []);
};

export default useContactsFiltersConfig;
