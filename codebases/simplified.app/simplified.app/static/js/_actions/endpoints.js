const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/api/v1`;
export const LOGIN_USER = BASE_URL + "/auth/login/";
export const REGISTER_USER = BASE_URL + "/auth/registration/";
export const CONFIRM_YOUR_EMAIL_ADDRESS = BASE_URL + "/accounts/confirm-email/";
export const VERIFY_EMAIL = BASE_URL + "/auth/registration/verify-email/";
export const CONFIRM_EMAIL_SCREEN = BASE_URL + "/accounts/confirm-email/";
export const STORIES = BASE_URL + "/stories";
export const STORIES_DETAIL = STORIES + "/{0}";
export const STORY_TO_TEMPLATE = STORIES + "/{0}/template";
export const CLONE_STORIES_DETAIL = STORIES + "/{0}/clone";
export const EXPORT_VIDEO = STORIES + "/{0}/video";
export const EXPORT_DESIGN = STORIES + "/{0}/export";
export const STORIES_FONTS_ENDPOINT = `${STORIES}/{0}/fonts`; // TODO(Akshay): Change endpoint to story fonts instead of generic fonts
export const RESET_PASSWORD = BASE_URL + "/auth/password/reset/";
export const RESET_PASSWORD_CONFIRMATION =
  BASE_URL + "/auth/password/reset/confirm/";
export const SET_NEW_PASSWORD_VIA_INVITATION = BASE_URL + "/invitations";
export const CHECK_TASK_STATAUS = BASE_URL + "/tasks/{0}";

export const FETCH_STORIES = BASE_URL + "/search/designs";

export const GROUP_BY_TEMPLATES = BASE_URL + "/search/templates";
export const GROUP_AND_SEARCH_EMPLATES = GROUP_BY_TEMPLATES + "&search={0}";
export const GROUP_BY_CATEGORIES =
  BASE_URL + "/search/templates/groups?group_by=category&template={0}";
export const SEARCH_IN_GROUPED_CATEGORIES = GROUP_BY_CATEGORIES + "&search={0}";
export const SEARCH_BY_TEMPLATE_TYPE = BASE_URL + "/search/templates";
export const SEARCH_PROJECT_FORMATS_ENDPOINT = BASE_URL + "/formats?search={}";

export const TEMPLATES_ENDPOINT = BASE_URL + "/templates";

/// Legacy template endpoints
export const FETCH_TEMPLATES =
  BASE_URL + "/templates?template={0}&org={1}&category={2}";
export const FETCH_TEMPLATE_TYPES = BASE_URL + "/templates/types?template={0}";
export const PUBLISH_TEMPLATE = BASE_URL + "/templates/{}";
export const CREATE_COMPONENT = BASE_URL + "/layers/{}/component";
export const CLONE_LAYERS_ENDPOINT = BASE_URL + "/layers/clone";
export const CLONE_TEMPLATE = BASE_URL + "/templates/{0}/clone";
export const FETCH_CATEGORIES = BASE_URL + "/categories?type={0}";
export const FETCH_STORY_PAGES = BASE_URL + "/stories/{0}/pages";
export const PAGES = "/pages";

export const FETCH_TEXT_BLOCKS = SEARCH_BY_TEMPLATE_TYPE + "?template=text";

export const ASSETS_ENDPOINT = BASE_URL + "/assets";
export const EFFECTS_ENDPOINT = BASE_URL + "/effects?mime=1";
export const DELETE_ASSET_ENDPOINT = ASSETS_ENDPOINT + "/{0}";
export const DELETE_TEMPLATE_ENDPOINT = TEMPLATES_ENDPOINT + "/{0}";
export const GRADIENTS_ENDPOINT = BASE_URL + "/effects?mime=7";

//// this is the link to be clicked from email :
// https://celeryhq.herokuapp.com/accounts/confirm-email/OA:1jG5uF:x-dVXy2QueVNzRw0YByF82x-AUA/

const SOCKET_BASE_URL = process.env.REACT_APP_SOCKET_BASE_URL;
export const WEBSOCKETS_ENDPOINT = `${SOCKET_BASE_URL}/ws/studio/{0}/?token={1}`;
export const GET_S3_SIGNED_URL_ENDPOINT = BASE_URL + "/assets/sign";
export const FONTS_ENDPOINT = `${BASE_URL}/fonts`;
export const GOOGLE_FONTS_ENDPOINT = `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.REACT_APP_GOOGLE_FONTS_API}`;
// GOOGLE CLIENT ID:
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
export const LOGIN_WITH_GOOGLE = BASE_URL + "/auth/google/";

// Partner APIs
export const GENERIC_APP_CONNECT = BASE_URL + "/partners/generic-app/connect";
export const CONNECTED_ACCOUNTS = BASE_URL + "/social/accounts/";
export const CONNECTED_APPS = BASE_URL + "/partners";
export const LOGIN_WITH_SHOPIFY = BASE_URL + "/auth/shopify/?shop={}";
export const CONNECT_WITH_SHOPIFY = BASE_URL + "/auth/shopify/connect/?shop={}";
export const SHOPIFY_CLIENT_ID = process.env.REACT_APP_SHOPIFY_CLIENT_ID;
export const SEARCH_SHOPIFY =
  BASE_URL + "/partners/integrations/shopify_app/fetch-products";
export const SEARCH_GOOGLE_DRIVE =
  BASE_URL + "/partners/integrations/google_drive/images-list";
export const GENERIC_IMAGE_DOWNLOAD =
  BASE_URL + "/partners/generic-file-download";

//export const OAUTH_CALLBACK_URL = "https://af3cc63f70da.ngrok.io/callback";
export const DOMAIN_NAME = process.env.REACT_APP_DOMAIN_NAME;
export const OAUTH_CALLBACK_URL = `${DOMAIN_NAME}/shopify/callback`;
export const SHOPIFY_AUTH_URL = `https://{0}/admin/oauth/authorize?client_id=${SHOPIFY_CLIENT_ID}&scope=read_products,read_product_listings&redirect_uri=${OAUTH_CALLBACK_URL}&state={1}`;
export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

// Third party end points
export const UNSPLASH_KEY = process.env.REACT_APP_UNSPLASH_KEY;
export const GIPHY_KEY = process.env.REACT_APP_GIPHY_KEY;
export const PIXABAY_KEY = process.env.REACT_APP_PIXABAY;
export const GETTY_KEY = process.env.REACT_APP_GETTY_API_KEY;
export const PEXELS_CLIENT_ID = process.env.REACT_APP_PEXELS_CLIENT_ID;
export const FLATICON_API_KEY = process.env.REACT_APP_FLATICON_KEY;
export const BRANDFETCH_API_KEY = process.env.REACT_APP_BRANDFETCH_API_KEY;
export const GIPHY_SEARCH_ENDPOINT = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_KEY}`;
export const GIPHY_TRENDING_ENDPOINT = `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_KEY}`;
export const PIXABAY_VIDEO_ENDPOINT = `https://pixabay.com/api/videos/?key=${PIXABAY_KEY}`;
export const PIXABAY_VIDEO_COVER_ENDPOINT = `https://i.vimeocdn.com/video/{0}_{1}.jpg`;
export const PIXABAY_IMAGES_ENDPOINT = `https://pixabay.com/api/?key=${PIXABAY_KEY}`;
export const FETCH_IMAGES_ENDPOINT = `https://api.unsplash.com/photos/?client_id=${UNSPLASH_KEY}`;
export const STORYBLOCK_VIDEOS_FETCH = `${BASE_URL}/partners/storyblocks_video/api/v2/videos/search`;
export const STORYBLOCK_MUSIC_COLLECTIONS_FETCH = `${BASE_URL}/partners/storyblocks_audio/api/v2/audio/stock-item/categories`;
export const STORYBLOCK_MUSIC_SEARCH = `${BASE_URL}/partners/storyblocks_audio/api/v2/audio/search`;

export const SEARCH_IMAGES_ENDPOINT = `https://api.unsplash.com/search/photos/?client_id=${UNSPLASH_KEY}`;
export const DOWNLOAD_UNSPLASH_IMAGE_ENDPOINT = `{}&client_id=${UNSPLASH_KEY}`;

export const REMOVE_IMAGE_BACKGROUND = `${BASE_URL}/partners/background-remover`;

export const FETCH_IMAGES_ENDPOINT_PEXELS =
  "https://api.pexels.com/v1/curated/";
export const SEARCH_IMAGES_ENDPOINT_PEXELS =
  "https://api.pexels.com/v1/search/";
export const FETCH_VIDEOS_ENDPOINT_PEXELS = "https://api.pexels.com/videos/";

export const FETCH_IMAGES_ENDPOINT_GETTY =
  "https://api.gettyimages.com/v3/images/83454800";

export const ICONS_ENDPOINT_FLATICON = BASE_URL + "/partners/flaticon";
export const ICONS_SEARCH_ENDPOINT_FLATICON =
  ICONS_ENDPOINT_FLATICON + "/search/icons";
export const ICONS_ENDPOINT_BRANDFETCH = "https://api.brandfetch.io/v1/logo";
export const ICONS_ENDPOINT_CLEARBIT =
  "https://autocomplete.clearbit.com/v1/companies/suggest"; //?query=shopify
export const BRANDFETCH_LICENSE_AGREEMENT = "https://brandfetch.io/terms";

export const SHUTTERSTOCK_SEARCH_IMAGES_ENDPOINT =
  "https://api.shutterstock.com/v2/images/search?category=random&sort=popular";

export const BRANDFETCH_DATA = "https://api.brandfetch.io/v1/company";

// User management
export const WORKSPACE = BASE_URL + "/orgs";
export const ADD_MEMBER = BASE_URL + "/orgs/{}/members";
export const DELETE_MEMBER = BASE_URL + "/orgs/{}/members/{}";
export const JOIN_TEAM = BASE_URL + "/orgs/{}/members";
export const BULK_INVITE = BASE_URL + "/orgs/{}/members/add";

//verify membership
export const INVITATIONS = BASE_URL + "/invitations/{}/";

export const GET_USER_INFO = BASE_URL + "/auth/user/";
export const CHANGE_PASSWORD = BASE_URL + "/auth/password/change/";

// MANAGE TEAMS
export const CREATE_NEW_TEAM = BASE_URL + "/orgs";
export const SHOW_MY_TEAMS = BASE_URL + "/orgs";
export const SHOW_MY_TEAM_MEMBERS = BASE_URL + "/orgs/"; //orgs/25/members
export const ADD_NEW_TEAM_MEMBER = BASE_URL + "/orgs/"; //orgs/25/members
export const EDIT_TEAM_MEMBER_DETAILS = BASE_URL + "/orgs/"; //orgs/25/members/26

// Workspace Settings
export const UPDATE_WORKSPACE_NAME = BASE_URL + "/orgs/"; //orgs/<ORG ID>

//BrandKit endpoints
export const LIST_BRANDKITS = BASE_URL + "/brandkit";
export const CREATE_BRANDKIT = BASE_URL + "/brandkit";
export const DELETE_BRANDKIT = BASE_URL + "/brandkit/{}";
export const UPDATE_BRANDKIT = BASE_URL + "/brandkit/{}";
export const LIST_BRANDKIT_LOGOS = BASE_URL + "/brandkit/{}/logos";
export const CREATE_BRANDKIT_LOGOS = BASE_URL + "/brandkit/{}/logos";
export const DELETE_BRANDKIT_LOGO = BASE_URL + "/brandkit/{0}/logos/{1}";
export const LIST_BRANDKIT_COLOR_PALLETE = BASE_URL + "/brandkit/{}/palette";
export const CREATE_BRANDKIT_COLOR_PALLETE = BASE_URL + "/brandkit/{}/palette";
export const UPDATE_BRANDKIT_COLOR_PALETTE =
  BASE_URL + "/brandkit/{0}/palette/{1}";

// Comments API
export const COMMENTS_ENDPOINT = BASE_URL + "/comments";

// Guided tours
export const GENERATE_ASSETS = TEMPLATES_ENDPOINT + "/{}/generate";

// Proxy loading
export const PROXY_IMAGES = `${API_BASE_URL}/proxy?url=`;

// Comments API
export const FOLDERS_ENDPOINT = BASE_URL + "/folders";
export const FOLDERS_SEARCH_ENDPOINT = BASE_URL + "/search/folders";

// AI
export const AI_ENDPOINT = BASE_URL + "/writer";
export const AI_WRITER_ENDPOINT = BASE_URL + "/writer?categories={}";
export const LAST_RUN = BASE_URL + "/writer/last?prompt={}";
export const FIND_DOMAIN = BASE_URL + "/writer/find";
export const COPIES_ENDPOINT = BASE_URL + "/copy/{}";

export const SAVED_COPIES = BASE_URL + "/copy?document={}";
export const GET_ALL_COPIES = BASE_URL + "/last";

// Formats
export const FETCH_FORMATS = BASE_URL + "/formats?category={}";

//Documents
export const DOCUMENTS_ENDPOINT = BASE_URL + "/documents";
export const DOCUMENT_DETAILS = BASE_URL + "/documents/{0}";
export const MAGIC_ENDPOINT = BASE_URL + "/documents/{}/generate";
export const MAGIC_DESIGN = BASE_URL + "/documents/{}/design";
export const DELETE_DOCUMENTS_ENDPOINT = DOCUMENTS_ENDPOINT + "/{0}";
export const FAVORITE_COPIES = BASE_URL + "/copy?status=1";

// Template search suggestions
export const TEMPLATE_SEARCH_SUGGESTION_ENDPOINT =
  BASE_URL +
  "/search/templates/suggest?title_suggest={0}&tag_suggest={0}&category_suggest={0}";

export const FILTER_TEMPLATES_BY_CATEGORY_ENDPOINT =
  BASE_URL +
  "/search/templates?template=template&format_id={0}&category_id={1}";

// billing and payment
export const ALL_SUBSCRIPTION_PLANS_ENDPOINT = BASE_URL + "/payments/prices";
export const SUBSCRIBED_PLAN_ENDPOINT = BASE_URL + "/payments/subscription";
export const SUBSCRIPTION_PAYMENT_HISTORY_ENDPOINT =
  BASE_URL + "/payments/history";
export const SUBSCRIPTION_ENDPOINT = BASE_URL + "/payments/subscription/{}";
export const BILLING_PLAN_FEATURES_ENDPOINT = BASE_URL + "/payments/features";
export const BILLING_ORG_FEATURES_ENDPOINT =
  BASE_URL + "/payments/org_features";
export const CANCEL_SUBSCRIPTION_ENDPOINT =
  BASE_URL + "/payments/cancel_subscription/{}";
export const CREATE_CHECKOUT_SESSION_ENDPOINT =
  BASE_URL + "/payments/checkout_session";
// Deals
export const SUMO_DEAL_ENDPOINT = BASE_URL + "/sumo/{0}";
export const SUMO_ACTIVATE_ENDPOINT = BASE_URL + "/sumo/{0}/activate";
export const SUMO_ASSOCIATE_ENDPOINT = BASE_URL + "/sumo/{0}/associate";
