// State names
export const SI_ROOT_ROUTE = "salesIntelligence";

// Root pages
export const HOME_PAGE_ROUTE = `${SI_ROOT_ROUTE}-home`;
export const MY_LISTS_PAGE_ROUTE = `${SI_ROOT_ROUTE}-myLists`;
export const FIND_LEADS_PAGE_ROUTE = `${SI_ROOT_ROUTE}-findLeads`;

// Static/dynamic list pages
export const STATIC_LIST_PAGE_ROUTE = `${MY_LISTS_PAGE_ROUTE}-staticList`;
export const DYNAMIC_LIST_PAGE_ROUTE = `${MY_LISTS_PAGE_ROUTE}-dynamicList`;

// New search aka "Lead generator" pages
export const NEW_DYNAMIC_LIST_SEARCH_ROUTE = `${DYNAMIC_LIST_PAGE_ROUTE}-search`;
export const FIND_LEADS_SEARCH_ROUTE = `${FIND_LEADS_PAGE_ROUTE}-search`;
export const FIND_LEADS_SAVED_SEARCH_ROUTE = `${FIND_LEADS_PAGE_ROUTE}-savedSearch`;

// New search result pages
export const NEW_DYNAMIC_LIST_SEARCH_RESULT_ROUTE = `${NEW_DYNAMIC_LIST_SEARCH_ROUTE}-result`;
export const FIND_LEADS_SEARCH_RESULT_ROUTE = `${FIND_LEADS_SEARCH_ROUTE}-result`;

// URLs
export const SI_ROOT_ROUTE_URL = "/sales";

// Root pages
export const HOME_PAGE_ROUTE_URL = SI_ROOT_ROUTE_URL;
export const MY_LISTS_PAGE_ROUTE_URL = "/lists";
export const FIND_LEADS_PAGE_ROUTE_URL = "/find-leads";

// Static/dynamic list pages
export const STATIC_LIST_PAGE_ROUTE_URL = `${MY_LISTS_PAGE_ROUTE_URL}/static/:id?showRecommendations`;
export const DYNAMIC_LIST_PAGE_ROUTE_URL = `${MY_LISTS_PAGE_ROUTE_URL}/dynamic/:id?excludeUserLeads&newLeadsOnly`;

// New search aka "Lead generator" pages
export const NEW_DYNAMIC_LIST_SEARCH_ROUTE_URL = `${MY_LISTS_PAGE_ROUTE_URL}/advanced-search`;
export const FIND_LEADS_SEARCH_ROUTE_URL = `${FIND_LEADS_PAGE_ROUTE_URL}/advanced-search`;
export const FIND_LEADS_SAVED_SEARCH_ROUTE_URL = `${FIND_LEADS_PAGE_ROUTE_URL}/advanced-search/:id`;

// New search result pages
export const NEW_DYNAMIC_LIST_SEARCH_RESULT_ROUTE_URL = `${NEW_DYNAMIC_LIST_SEARCH_ROUTE_URL}/results`;
export const FIND_LEADS_SEARCH_RESULT_ROUTE_URL = `${FIND_LEADS_SEARCH_ROUTE_URL}/results`;
