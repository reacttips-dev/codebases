export enum SERP_IDS {
    RELATED_SEARCHES = "related_searches",
    FEATURED_SNIPPET = "featured",
    TWITTER_FEED = "twitter",
    KNOWLEDGE_FEED = "knowledge",
    NEWS = "news",
    INSTANT_ANSWERS = "instant_answers",
    POPULAR_PRODUCTS = "popular_products",
    SHOWCASE_SHOPPING_ADS = "?showcase",
    JOB_LISTINGS = "jobs",
    IMAGES = "images",
    PRODUCT_LISTING_ADS = "pla",
    HOTELS = "hotels",
    RELATED_QUESTIONS = "related_questions",
    VIDEO = "video",
    RECIPES = "recipes",
    APPS = "apps",
    SITE_LINKS = "site_links",
    LOCAL_PACK = "local_pack",
    FLIGHTS = "flights",
    PAID = "paid",
    PAID_SITE_LINKS = "paid_sitelinks",
    ORGANIC_SITE_LINKS = "organic_sitelinks",
}
const SERP_MAP_RAW: {
    [key: string]: { icon: string; name: string; id: string };
} = {
    [SERP_IDS.RELATED_SEARCHES]: {
        icon: "nav-keyword-group",
        name: "Related Searches",
        id: SERP_IDS.RELATED_SEARCHES,
    },
    [SERP_IDS.FEATURED_SNIPPET]: {
        icon: "opportunities",
        name: "Featured snippet",
        id: SERP_IDS.FEATURED_SNIPPET,
    },
    [SERP_IDS.TWITTER_FEED]: {
        icon: "social-twitter",
        name: "Twitter feed",
        id: SERP_IDS.TWITTER_FEED,
    },
    [SERP_IDS.KNOWLEDGE_FEED]: {
        icon: "helpcenter",
        name: "Knowledge card",
        id: SERP_IDS.KNOWLEDGE_FEED,
    },
    [SERP_IDS.NEWS]: {
        icon: "serp-news",
        name: "News",
        id: SERP_IDS.NEWS,
    },
    [SERP_IDS.INSTANT_ANSWERS]: {
        icon: "direct",
        name: "Instant Answers",
        id: SERP_IDS.INSTANT_ANSWERS,
    },
    [SERP_IDS.POPULAR_PRODUCTS]: {
        icon: "nav-publishers",
        name: "Popular Products",
        id: SERP_IDS.POPULAR_PRODUCTS,
    },
    [SERP_IDS.SHOWCASE_SHOPPING_ADS]: {
        icon: "showcase-shopping",
        name: "Showcase Shopping Ads",
        id: SERP_IDS.SHOWCASE_SHOPPING_ADS,
    },
    [SERP_IDS.JOB_LISTINGS]: {
        icon: "employees",
        name: "Job listings",
        id: SERP_IDS.JOB_LISTINGS,
    },
    [SERP_IDS.IMAGES]: {
        icon: "image",
        name: "Images",
        id: SERP_IDS.IMAGES,
    },
    [SERP_IDS.PRODUCT_LISTING_ADS]: {
        icon: "pla",
        name: "Product Listing Ads",
        id: SERP_IDS.PRODUCT_LISTING_ADS,
    },
    [SERP_IDS.HOTELS]: {
        icon: "hotels",
        name: "Hotels",
        id: SERP_IDS.HOTELS,
    },
    [SERP_IDS.RELATED_QUESTIONS]: {
        icon: "questions",
        name: "Related questions",
        id: SERP_IDS.RELATED_QUESTIONS,
    },
    [SERP_IDS.VIDEO]: {
        icon: "video",
        name: "Video",
        id: SERP_IDS.VIDEO,
    },
    [SERP_IDS.RECIPES]: {
        icon: "recipes",
        name: "Recipes",
        id: SERP_IDS.RECIPES,
    },
    [SERP_IDS.APPS]: {
        icon: "mobile-web",
        name: "Apps",
        id: SERP_IDS.APPS,
    },
    [SERP_IDS.SITE_LINKS]: {
        icon: "organic-link",
        name: "Site Links",
        id: SERP_IDS.SITE_LINKS,
    },
    [SERP_IDS.LOCAL_PACK]: {
        icon: "location",
        name: "Local pack",
        id: SERP_IDS.LOCAL_PACK,
    },
    [SERP_IDS.FLIGHTS]: {
        icon: "flights",
        name: "Flights",
        id: SERP_IDS.FLIGHTS,
    },
    [SERP_IDS.PAID]: {
        icon: "serp-paid",
        name: "Ads",
        id: SERP_IDS.PAID,
    },
    [SERP_IDS.PAID_SITE_LINKS]: {
        icon: "serp-paid-with-links",
        name: "Paid Sites Links",
        id: SERP_IDS.PAID_SITE_LINKS,
    },
    [SERP_IDS.ORGANIC_SITE_LINKS]: {
        icon: "organic-site-links",
        name: "Organic Sites Links",
        id: SERP_IDS.ORGANIC_SITE_LINKS,
    },
};
// export only the serp features that is currently supported.
export const SERP_MAP = Object.fromEntries(
    Object.entries(SERP_MAP_RAW).filter(([id]) => {
        return id[0] !== "?";
    }),
);
export const serpFeatureSupported = (serp): boolean => Boolean(SERP_MAP[serp]);
