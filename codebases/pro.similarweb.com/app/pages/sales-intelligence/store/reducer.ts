import { combineReducers } from "redux";
import { SalesIntelligenceState } from "../types";
import opportunitiesReducer from "../sub-modules/opportunities/store/reducer";
import savedSearchesReducer from "../sub-modules/saved-searches/store/reducer";
import commonReducer from "../sub-modules/common/store/reducer";
import competitorCustomersReducer from "../sub-modules/competitor-customers/store/reducer";
import advancedSearchReducer from "../sub-modules/advanced-search/store/reducer";
import { keywordsReducer } from "../sub-modules/keyword-leads/store/reducer";
import IndustriesReducer from "pages/sales-intelligence/sub-modules/industries/store/reducer";
import contactsReducer from "../sub-modules/contacts/store/reducer";

const salesIntelligenceReducer = combineReducers<SalesIntelligenceState>({
    common: commonReducer,
    opportunities: opportunitiesReducer,
    savedSearches: savedSearchesReducer,
    advancedSearch: advancedSearchReducer,
    competitorCustomers: competitorCustomersReducer,
    keywordLeads: keywordsReducer,
    industries: IndustriesReducer,
    contacts: contactsReducer,
});

export default salesIntelligenceReducer;
