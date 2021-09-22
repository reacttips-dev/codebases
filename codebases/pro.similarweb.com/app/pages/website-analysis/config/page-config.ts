import geographyTable from "./geography";
import { SimilarSites } from "./similarsites";
import subDomainsWidgetConfig from "./subdomains";

const pageConfig = {
    WEBSITES_AUDIENCEGEOGRAPHY: {
        single: [geographyTable],
        compare: [geographyTable],
    },
    COMPANYRESEARCH_WEBSITE_GEOGRAPHY: {
        single: [geographyTable],
        compare: [geographyTable],
    },
    ACCOUNTREVIEW_WEBSITE_AUDIENCE_GEOGRAPHY: {
        single: [geographyTable],
        compare: [geographyTable],
    },
    WEBSITES_SIMILARSITES: SimilarSites,
    WEBSITES_SUBDOMAINS: subDomainsWidgetConfig,
    COMPANYRESEARCH_WEBSITE_SUBDOMAINS: subDomainsWidgetConfig,
    ACCOUNTREVIEW_WEBSITE_SUBDOMAINS: subDomainsWidgetConfig,
};
export default pageConfig;
