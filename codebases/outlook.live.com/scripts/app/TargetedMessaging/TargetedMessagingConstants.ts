export const CACHE_EXPIRY_MESSAGEMETADATA = 14400000; // expiry in ms - 4hrs
export const CACHE_EXPIRY_USERGOVERNANCERULES = 14400000; // expiry in ms - 4hrs
export const CACHE_EXPIRY_CAMPAIGNCONTENT = 14400000; // expiry in ms - 4hrs
export const CACHE_EXPIRY_DYNAMICSETTINGS = 14400000; // expiry in ms - 4hrs
export const CACHE_EXPIRY_LOGLEVELSETTINGS = 14400000; // expiry in ms - 4hrs
export const CACHE_EXPIRY_USERFACTS = 86400000; // expiry in ms - 24hrs

export const TMS_SERVICEURL = "https://messaging.office.com/lifecycle/CampaignMetadataAggregator?";
export const TMS_SERVICE_ACTION_URL = "https://messaging.office.com/lifecycle/SetCampaignAction?";
export const TMS_CAMPAIGN_LOAD_TIMEOUT = 1000;

export const TMS_FETCH_TIMEOUT = 5000; // timeout for fetching tms service requests

export const TULIPS_SERVICEURL =
	"https://substrate.office.com/OfficePersonalizationUserLifecycle/api/facts";

export const TULIPS_LOAD_TIMEOUT = 1000;

export const TULIPS_FETCH_TIMEOUT = 5000; // timeout for fetching tulips service requests

export const TULIPS_INGESTION_TIME = 24 * 60 * 60 * 1000; // Tulips ingestion time

export const AUGLOOP_INIT_CHECK_RETRY_TIMES = 5;
