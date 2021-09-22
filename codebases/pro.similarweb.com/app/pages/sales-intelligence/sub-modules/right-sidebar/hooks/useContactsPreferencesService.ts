import React from "react";
import contactsPreferencesService from "pages/sales-intelligence/sub-modules/right-sidebar/services/contactsPreferencesService";

const useContactsPreferencesService = () => {
    return React.useMemo(() => contactsPreferencesService(), []);
};

export default useContactsPreferencesService;
