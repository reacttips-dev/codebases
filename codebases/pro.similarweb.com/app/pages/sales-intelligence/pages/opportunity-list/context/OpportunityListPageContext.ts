import React from "react";
import { OpportunityListType } from "../../../sub-modules/opportunities/types";
import {
    changeListCountryThunk,
    createOpportunityListThunk,
    deleteOpportunityListThunk,
    updateOpportunityListSettingsThunk,
    updateOpportunityListThunk,
} from "../../../sub-modules/opportunities/store/effects";

const OpportunityListPageContext = React.createContext<OpportunityListPageContextType>(null);

export type OpportunityListPageContextType = {
    list: OpportunityListType;
    listCreating: boolean;
    listUpdating: boolean;
    listDeleting: boolean;
    listDeleteError?: string;
    createList(...args: Parameters<typeof createOpportunityListThunk>): void;
    updateList(...args: Parameters<typeof updateOpportunityListThunk>): void;
    updateListSettings(...args: Parameters<typeof updateOpportunityListSettingsThunk>): void;
    updateListCountry(...args: Parameters<typeof changeListCountryThunk>): void;
    deleteList(...args: Parameters<typeof deleteOpportunityListThunk>): void;
};
export default OpportunityListPageContext;
