/* eslint no-multi-spaces: ["error", { exceptions: { "VariableDeclarator": true } }]*/
// document of how to use this file is here https://github01.zappos.net/mweb/marty/wiki/Analytics
// All track events MUST start in with TE_ or they _will_ not work in production. Other ALL_CAPS constant variable names are minified (see cfg/prod.js for the exact regex)

// page views
export const TE_PV_BRANDPAGE         = { l1: 'Page View', l2: 'BrandPage' };
export const TE_PV_CARTPAGE          = { l1: 'Page View', l2: 'CartPage' };
export const TE_PV_NATIVECHECKOUT    = { l1: 'Page View', l2: 'Native Checkout' };
export const TE_PV_HOMEPAGE          = { l1: 'Page View', l2: 'HomePage' };
export const TE_PV_LANDINGPAGE       = { l1: 'Page View', l2: 'LandingPage' };
export const TE_PV_ORDERCONFIRMATION = { l1: 'Page View', l2: 'Order Confirmation' };
export const TE_PV_PDP               = { l1: 'Page View', l2: 'PDP' };
export const TE_PV_SEARCHPAGE        = { l1: 'Page View', l2: 'Search' };
export const TE_PV_FAVORITES         = { l1: 'Page View', l2: 'Favorites' };
export const TE_PV_CHECKOUT_SSA      = { l1: 'Page View', l2: 'Native Checkout', l3: 'Select Ship Address' };
export const TE_PV_CHECKOUT_ESA      = { l1: 'Page View', l2: 'Native Checkout', l3: 'Edit Ship Address' };
export const TE_PV_CHECKOUT_NSA      = { l1: 'Page View', l2: 'Native Checkout', l3: 'New Ship Address' };
export const TE_PV_CHECKOUT_SBA      = { l1: 'Page View', l2: 'Native Checkout', l3: 'Select Bill Address' };
export const TE_PV_CHECKOUT_NBA      = { l1: 'Page View', l2: 'Native Checkout', l3: 'New Bill Address' };
export const TE_PV_CHECKOUT_SP       = { l1: 'Page View', l2: 'Native Checkout', l3: 'Select Payment' };
export const TE_PV_CHECKOUT_NP       = { l1: 'Page View', l2: 'Native Checkout', l3: 'New Payment' };
export const TE_PV_CHECKOUT_SSO      = { l1: 'Page View', l2: 'Native Checkout', l3: 'Select Ship Option' };
export const TE_PV_CHECKOUT_SPC      = { l1: 'Page View', l2: 'Native Checkout', l3: 'SPC' };
export const TE_PV_REWARDS           = { l1: 'Page View', l2: 'Rewards Dashboard' };

// component views
export const TE_CV_REDEEMABLE_REWARDS          = { l1: 'Page View', l2: 'RedeemableRewards' };
export const TE_CV_CHECKOUT_SHIPPING_DOWNGRADE = { l1: 'Page View', l2: 'Native Checkout', l3: 'Shippping Downgrade' };
export const TE_SHOW_REWARDS_TRANSPARENCY      = { l1: 'Page View', l2: 'Rewards Transparency' };
export const TE_CLICK_REWARDS_TRANSPARENCY     = { l2: 'Rewards Transparency', l3: 'CTA Click' };

// header
export const TE_HEADER_PROMOS                = { l2: 'Global Header', l3: 'Promos' };
export const TE_HEADER_CUSTOMER_SERVICE      = { l2: 'Global Header', l3: 'Customer Service' };
export const TE_HEADER_LOGO                  = { l2: 'Global Header', l3: 'Logo' };
export const TE_HEADER_CART                  = { l2: 'Global Header', l3: 'Cart' };
export const TE_HEADER_SEARCHBAR_SUBMIT      = { l2: 'Search Bar', l3: 'Type' };
export const TE_HEADER_SEARCH_SUGGESTION     = { l2: 'Global Header', l3: 'Search Submit Suggestion' };
export const TE_HEADER_SEARCH_NAV            = { l2: 'Global Header', l3: 'Nav Search Submit' };
export const TE_HEADER_ACCOUNT_DROPDOWN      = { l2: 'Global Header', l3: 'Account', l4: 'Dropdown Toggle' };
export const TE_HEADER_ACCOUNT_WELCOME       = { l2: 'Global Header', l3: 'Account', l4: 'Welcome' };
export const TE_HEADER_ACCOUNT_MYACCOUNT     = { l2: 'Global Header', l3: 'Account', l4: 'My Account' };
export const TE_HEADER_ACCOUNT_FAVORITES     = { l2: 'Global Header', l3: 'Account', l4: 'Favorites' };
export const TE_HEADER_ACCOUNT_REWARDS       = { l2: 'Global Header', l3: 'Account', l4: 'Rewards' };
export const TE_HEADER_ACCOUNT_ORDER_HISTORY = { l2: 'Global Header', l3: 'Account', l4: 'Order History' };
export const TE_HEADER_ACCOUNT_SIGNOUT       = { l2: 'Global Header', l3: 'Account', l4: 'Sign Out' };
export const TE_HEADER_ACCOUNT_SIGNIN        = { l2: 'Global Header', l3: 'Sign In', l4: 'Login Register' };
export const TE_HEADERFOOTER_MAIN_NAV_TOGGLE = { l2: 'Global HeaderFooter', l3: 'Main Nav Toggle' };
export const TE_HEADERFOOTER_MAIN_NAV        = { l2: 'Global HeaderFooter', l3: 'Main Nav' };
export const TE_HEADERFOOTER_NAV_CLICKME     = { l2: 'Global HeaderFooter', l3: 'Clickme Nav' };
export const TE_HEADERFOOTER_NAV_IMAGESGRID  = { l2: 'Global HeaderFooter', l3: 'Images Grid Nav' };
export const TE_HEADER_DYNAMICBANNER         = { l1: 'Impression', l2: 'Global Header', l3: 'DynamicBanner' };
export const TE_HEADER_DYNAMICBANNERCLICKED  = { l2: 'Global Header', l3: 'DynamicBanner' };

// global banner
export const TE_GLOBAL_BANNER_LINK_CLICK     = { l2: 'Global Banner', l3: 'Link Click' };

// footer
export const TE_FOOTER_FEEDBACK               = { l2: 'Global Footer', l3: 'Feedback' };
export const TE_FOOTER_NAV                    = { l2: 'Global Footer', l3: 'Nav' };
export const TE_FOOTER_SUBSCRIBE              = { l2: 'Global Footer', l3: 'Subscribe' };
export const TE_FOOTER_SOCIAL                 = { l2: 'Global Footer', l3: 'Connect with Us' };
export const TE_FOOTER_POLICIES               = { l2: 'Global Footer', l3: 'Legal Policies' };
export const TE_FOOTER_RECENTLY_VIEWED_RECO   = { l2: 'Global Footer', l3: 'Recently Viewed' };
export const TE_FOOTER_SIGN_UP_MODAL_SUBMIT   = { l2: 'Global Footer', l3: 'Sign Up Modal Submit' };

// cart
export const TE_CART_MODIFYQUANTITY    = { l2: 'Cart', l3: 'Modify Quantity' };
export const TE_CART_PRODUCTCLICKED    = { l2: 'Cart', l3: 'Product Click' };
export const TE_CART_PROCEEDTOCHECKOUT = { l2: 'Cart', l3: 'Checkout' };
export const TE_CART_ADDTOFAVORITES    = { l2: 'Swipe Menu', l3: 'Favorite' };
export const TE_CART_REMOVEITEM        = { l2: 'Swipe Menu', l3: 'Remove' };

// product video
export const TE_PRODUCTVIDEO_PLAYED      = { l2: 'ProductVideo', l3: 'Played' };
export const TE_PRODUCTVIDEO_ENDED       = { l2: 'ProductVideo', l3: 'Ended' };
export const TE_PRODUCTVIDEO_PAUSED      = { l2: 'ProductVideo', l3: 'Paused' };
export const TE_PRODUCTVIDEO_REPLAYED    = { l2: 'ProductVideo', l3: 'Replayed' };
export const TE_PRODUCTVIDEO_SOUGHT      = { l2: 'ProductVideo', l3: 'Sought' };
export const TE_PRODUCTVIDEO_TIMEUPDATED = { l2: 'ProductVideo', l3: 'TimeUpdated' };
export const TE_MELODYVIDEO_PLAYED       = { l2: 'melodyVideoPlayer', l3: 'Played' };
export const TE_MELODYVIDEO_PAUSED       = { l2: 'melodyVideoPlayer', l3: 'Paused' };
export const TE_MELODYVIDEO_ENDED        = { l2: 'melodyVideoPlayer', l3: 'Ended' };

// pdp
export const TE_PDP_SIZEBREAKRECOMMENDATION     = { l2: 'QEQ', l3: 'SizeBreakRecommendation' }; // QEQ === PDP; Analytics
export const TE_PDP_BUYBOX_CONTENT_IMPRESSION   = { l2: 'QEQ', l3: 'BuyBoxContentImpression' };
export const TE_PDP_BUYBOX_CONTENT_CLICK        = { l2: 'QEQ', l3: 'BuyBoxContentClick' };
export const TE_PDP_BUYBOX_SIZE_BIAS_IMPRESSION = { l2: 'QEQ', l3: 'BuyBoxSizeBiasImpression' };
export const TE_PDP_STORIES_IMPRESSION          = { l2: 'QEQ', l3: 'StoriesImpression' };
export const TE_PDP_STORIES_CLICK               = { l2: 'QEQ', l3: 'StoriesClick' };
export const TE_PDP_CROSS_SITE_PRODUCT          = { l2: 'QEQ', l3: 'CrossSiteReferredProduct' };
export const TE_PDP_SIZING                      = { l2: 'Product', l3: 'Sizing' };
export const TE_PDP_TELLAFRIEND_SEND            = { l2: 'TellAFriend', l3: 'Send' };
export const TE_PDP_TELLAFRIEND_SEND_ERROR      = { l2: 'TellAFriend', l3: 'Send Error' };
export const TE_PDP_REPORTANERROR_SEND          = { l2: 'ReportAnError', l3: 'Send' };
export const TE_PDP_REPORTANERROR_SEND_ERROR    = { l2: 'ReportAnError', l3: 'Send Error' };

// favorites
export const TE_FAVORITES_ADDTOCART         = { l2: 'Favorites', l3: 'Add To Cart' };
export const TE_FAVORITES_ADDTOCART_FAILURE = { l2: 'Favorites', l3: 'Add to Cart', l4: 'Failure' };
export const TE_FAVORITES_PDPCLICK          = { l2: 'Favorites', l3: 'PDP Click' };
export const TE_FAVORITES_DELETE            = { l2: 'Favorites', l3: 'Menu Item Delete' };
export const TE_FAVORITES_OOSNOTIFY         = { l2: 'Favorites', l3: 'OOS Notify Click' };

// reviews
export const TE_REVIEWS_RATEREVIEWHELPFUL = { l2: 'Reviews', l3: 'Rate-Review-Helpful' };
export const TE_REVIEWS_SORTREVIEWBYNEW   = { l2: 'Reviews', l3: 'Sort-By-New' };

export const TE_DONTFORGET_VIEW              = { l2: 'DontForget', l3: 'View' };
export const TE_DONTFORGET_CAROUSEL_INTERACT = { l2: 'DontForget', l3: 'Carousel Interact' };
export const TE_DONTFORGET_ITEM_CLICK        = { l2: 'DontForget', l3: 'Item Click' };

// customer questions on pdp (ask)
export const TE_ASK_EXPAND_QUESTIONS      = { l2: 'CustomerQuestions', l3: 'Expand Questions' };
export const TE_ASK_COLLAPSE_QUESTIONS    = { l2: 'CustomerQuestions', l3: 'Collapse Questions' };
export const TE_ASK_VIEW_QUESTION_FORM    = { l2: 'CustomerQuestions', l3: 'View Question Form' };
export const TE_ASK_LEAVE_QUESTION_FORM   = { l2: 'CustomerQuestions', l3: 'Leave Question Form' };
export const TE_ASK_SUBMIT_QUESTION       = { l2: 'CustomerQuestions', l3: 'Submit Question' };
export const TE_ASK_SUBMIT_EMPTY_QUESTION = { l2: 'CustomerQuestions', l3: 'Submit Empty Question' };
export const TE_ASK_UPVOTE_QUESTION       = { l2: 'CustomerQuestions', l3: 'Upvote Question' };
export const TE_ASK_DOWNVOTE_QUESTION     = { l2: 'CustomerQuestions', l3: 'Downvote Question' };
export const TE_ASK_REPORT_QUESTION       = { l2: 'CustomerQuestions', l3: 'Report Question' };
export const TE_ASK_EXPAND_ANSWERS        = { l2: 'CustomerQuestions', l3: 'Expand Answers' };
export const TE_ASK_COLLAPSE_ANSWERS      = { l2: 'CustomerQuestions', l3: 'Collapse Answers' };
export const TE_ASK_VIEW_ANSWER_FORM      = { l2: 'CustomerQuestions', l3: 'View Answer Form' };
export const TE_ASK_LEAVE_ANSWER_FORM     = { l2: 'CustomerQuestions', l3: 'Leave Answer Form' };
export const TE_ASK_SUBMIT_ANSWER         = { l2: 'CustomerQuestions', l3: 'Submit Answer' };
export const TE_ASK_SUBMIT_EMPTY_ANSWER   = { l2: 'CustomerQuestions', l3: 'Submit Empty Answer' };
export const TE_ASK_UPVOTE_ANSWER         = { l2: 'CustomerQuestions', l3: 'Upvote Answer' };
export const TE_ASK_DOWNVOTE_ANSWER       = { l2: 'CustomerQuestions', l3: 'Downvote Answer' };
export const TE_ASK_REPORT_ANSWER         = { l2: 'CustomerQuestions', l3: 'Report Answer' };

// personalized search
export const TE_PERSONALIZED_SEARCH_SIZE = { l2: 'Search', l3: 'Toggled Personalized Size' };
export const TE_PERSONALIZED_SIZE_AVAILABLE = { l2: 'Search', l3: 'Personalized Size Available' };
export const TE_PERSONALIZED_SEARCH_BFU_BUTTON = { l2: 'Search', l3: 'Toggled Best For You' };
export const TE_PERSONALIZED_SEARCH_BFU_ELIGIBLE = { l2: 'Search', l3: 'Best For You Eligible' };
export const TE_PERSONALIZED_SEARCH_BFU_ELIGIBLE_NO_TERM = { l2: 'Search', l3: 'Best For You Eligible No Term' };
export const TE_SAVED_FILTERS_VISIBLE = { l2: 'Search', l3: 'Save Filters Visible' };
export const TE_SAVED_FILTERS_SAVE_CLICK = { l2: 'Search', l3: 'Save Filters Saved' };
export const TE_SAVED_FILTERS_RESET_CLICK = { l2: 'Search', l3: 'Saved Filters Reset' };
export const TE_SAVED_FILTERS_TOGGLE_OFF = { l2: 'Search', l3: 'Saved Filters Toggled Off' };

// search
export const TE_SEARCH_OPENFILTERS                   = { l2: 'Search', l3: 'Open Filters' };
export const TE_SEARCH_CLOSEFILTERS                  = { l2: 'Search', l3: 'Close Filters' };
export const TE_SEARCH_FILTERS                       = { l2: 'Search', l3: 'Filters' };
export const TE_SEARCH_BREADCRUMB                    = { l2: 'Search', l3: 'Breadcrumb' };
export const TE_SEARCH_CLICKPRODUCT                  = { l2: 'Search', l3: 'PDP Click' };
export const TE_SEARCH_CLICKTHROUGHPRODUCT           = { l2: 'Search', l3: 'PDP Through Click' };
export const TE_SEARCH_APPLYFILTERS                  = { l2: 'Search', l3: 'Apply Filters' };
export const TE_SEARCH_INLINE_RECO_CLICK             = { l2: 'Search', l3: 'AmazonReco' };
export const TE_SEARCH_INLINE_RECOS_VIEW             = { l2: 'Search', l3: 'AmazonRecoImpression' };
export const TE_SEARCH_CROSS_SITE_PRODUCTS_VIEW      = { l2: 'Search', l3: 'CrossSiteProductsView' };
export const TE_SEARCH_CROSS_SITE_PRODUCT_CLICK      = { l2: 'Search', l3: 'CrossSiteProductClick' };
export const TE_SORTMENU_SELECTSORT                  = { l2: 'Sort Menu', l3: 'Select Sort' };
export const TE_LAYOUTMENU_SELECTLAYOUT              = { l2: 'Layout Menu', l3: 'Select Layout' };
export const TE_SEARCH_SHOP_SALE_ITEMS               = { l2: 'Search', l3: 'Shop Sale Items' };
export const TE_SEARCH_PRODUCT_HEART                 = { l2: 'Search', l3: 'Product Heart' };
export const TE_SEARCH_PRODUCT_UNHEART               = { l2: 'Search', l3: 'Product UnHeart' };
export const TE_SEARCH_HEART_LOGIN_PROMPT            = { l2: 'Search', l3: 'Heart Login Prompt' };
export const TE_SEARCH_PAGINATION                    = { l2: 'Search', l3: 'Pagination' };
export const TE_SEARCH_PILLCLICKED                   = { l2: 'Search', l3: 'Pills Clicked' };
export const TE_SEARCH_AUTOCOMPLETE                  = { l2: 'Search', l3: 'Autocomplete' };
export const TE_SEARCH_PRODUCT_RELATED_STYLE         = { l2: 'Search', l3: 'Related Style' };
export const TE_SEARCH_RELATED_STYLES_TOGGLE         = { l2: 'Search', l3: 'Related Style Toggle' };
export const TE_SEARCH_RELATED_STYLES_DROPDOWN_OPEN  = { l2: 'Search', l3: 'Related Style Dropdown Open' };
export const TE_SEARCH_RELATED_STYLES_DROPDOWN_CLOSE = { l2: 'Search', l3: 'Related Style Dropdown Close' };
export const TE_LOGIN_BEST_EXPERIENCE_CLICK          = { l2: 'Search', l3: 'Best Experience Login Click' };
export const TE_SEARCH_EDITORIAL_PLACEMENT_CLICK     = { l2: 'Search', l3: 'EDSP Click' };

// legacy and misc
export const TE_SIDEBAR_PROMOCLICKED = { l1: '-', l2: 'Promos', l3: 'Check-out-Today-s-Deals' };
export const TE_CLICKMES_CLICKED     = { l1: '-', l2: 'Clickmes' };

// login assistant
export const TE_SHOW_LA          = { l1: 'Page View', l2: 'Login Assistant' };
export const TE_LOGIN_FROM_LA    = { l2: 'Login Assistant', l3: 'Login' };
export const TE_REDIRECT_FROM_LA = { l2: 'Login Assistant', l3: 'Redirect' };
export const TE_CLOSE_LA         = { l2: 'Login Assistant', l3: 'Close' };

// checkout: spc
export const TE_CHECKOUT_SPC_USE_SHIPPING_DOWNGRADE   = { l2: 'SPC', l3: 'Use Shippping Downgrade' };
export const TE_CHECKOUT_SPC_CHANGE_SHIPPING          = { l2: 'SPC', l3: 'Change Shipping' };
export const TE_CHECKOUT_SPC_CHANGE_BILLING           = { l2: 'SPC', l3: 'Change Billing' };
export const TE_CHECKOUT_SPC_CHANGE_PAYMENT           = { l2: 'SPC', l3: 'Change Payment' };
export const TE_CHECKOUT_SPC_CHANGE_SHIP_OPT          = { l2: 'SPC', l3: 'Change Ship Option' };
export const TE_CHECKOUT_SPC_CLOSE_PAYMENT            = { l2: 'SPC', l3: 'Close Payment' };
export const TE_CHECKOUT_SPC_CLOSE_PAYMENT_MODAL      = { l2: 'SPC', l3: 'Close Payment Modal' };
export const TE_CHECKOUT_SPC_CLOSE_SEL_ADDRESS        = { l2: 'SPC', l3: 'Close Select Address' };
export const TE_CHECKOUT_SPC_CLOSE_SEL_ADDRESS_MODAL  = { l2: 'SPC', l3: 'Close Select Address Modal' };
export const TE_CHECKOUT_SPC_CLOSE_ADDRESS_MODAL      = { l2: 'SPC', l3: 'Close Address Modal' };
export const TE_CHECKOUT_SPC_CLOSE_SUGG_ADDRESS_MODAL = { l2: 'SPC', l3: 'Close Sugg Address Modal' };
export const TE_CHECKOUT_SPC_PLACE_ORDER              = { l2: 'SPC', l3: 'Place Order' };
export const TE_CHECKOUT_SPC_TOGGLE_DEFAULTS          = { l2: 'SPC', l3: 'Toggle Save As Default' };
export const TE_CHECKOUT_SPC_VIEW_REVIEWS             = { l2: 'SPC', l3: 'View Review Section' };
export const TE_CHECKOUT_SPC_VIEW_GIFT_OPTIONS        = { l2: 'SPC', l3: 'View Gift Options' };

// --- order confirmation
export const TE_ORDER_CONFIRMATION_CONTINUE_SHOPPING  = { l2: 'Order Confirmation', l3: 'Click Continue Shopping' };

// --- checkout api errors
export const TE_CHECKOUT_ERROR_NOT_AUTHORIZED                = { l2: 'Checkout API Error', l3: 'Not Authorized' };
export const TE_CHECKOUT_ERROR_DEFAULT                       = { l2: 'Checkout API Error', l3: 'Default API Error' };
export const TE_CHECKOUT_ERROR_PURCHASE_NOT_FOUND            = { l2: 'Checkout API Error', l3: 'Purchase Not Found' };
export const TE_CHECKOUT_ERROR_EMPTY_CART                    = { l2: 'Checkout API Error', l3: 'Empty Cart' };
export const TE_CHECKOUT_ERROR_REQUEST_VALIDATION            = { l2: 'Checkout API Error', l3: 'Request Validation' };
export const TE_CHECKOUT_ERROR_REDEEMABLE_REWARDS_NOT_FOUND  = { l2: 'Checkout API Error', l3: 'Redeemable Rewards Not Found' };
export const TE_CHECKOUT_ERROR_CANNOT_CONFIRM_PURCHASE_OOS   = { l2: 'Checkout API Error', l3: 'Purchase Item OOS' };
export const TE_CHECKOUT_ERROR_CANNOT_CONFIRM_PURCHASE_OTHER = { l2: 'Checkout API Error', l3: 'Cannot Confirm Purchase Default' };
export const TE_CHECKOUT_ERROR_QUANTITY_CHANGE_VALIDATION    = { l2: 'Checkout API Error', l3: 'Quantity Change' };
export const TE_CHECKOUT_ERROR_INVALID_GIFT_OPTIONS          = { l2: 'Checkout API Error', l3: 'Invalid Gift Options' };
export const TE_CHECKOUT_ERROR_EDIT_INACTIVE_ADDRESS         = { l2: 'Checkout API Error', l3: 'Edit Deactivated Address' };

// --- shipping options modal
export const TE_CHECKOUT_SO_SELECT_OPTION = { l2: 'Shipping Options', l3: 'Select Option' };
export const TE_CHECKOUT_SO_USE_OPTION    = { l2: 'Shipping Options', l3: 'Use Option' };

// checkout: address list
export const TE_CHECKOUT_AL_SHIP_TO_ADDRESS    = { l2: 'Address List', l3: 'Ship To Address' };
export const TE_CHECKOUT_AL_SELECT_FOR_EDIT    = { l2: 'Address List', l3: 'Select For Edit' };
export const TE_CHECKOUT_AL_SELECT_FOR_DELETE  = { l2: 'Address List', l3: 'Select For Delete' }; // shipping side
export const TE_CHECKOUT_AL_GO_TO_ADD_NEW_BIL  = { l2: 'Address List', l3: 'Go To Add New', l4: 'billing' };
export const TE_CHECKOUT_AL_GO_TO_ADD_NEW_SHIP = { l2: 'Address List', l3: 'Go To Add New', l4: 'shipping' };
export const TE_CHECKOUT_AL_SELECT_ADDRESS     = { l2: 'Address List', l3: 'Select Address' };

// checkout: payment list
export const TE_CHECKOUT_PL_SELECT_PAYMENT   = { l2: 'Payment List', l3: 'Select Payment' };
export const TE_CHECKOUT_PL_USE_PAYMENT      = { l2: 'Payment List', l3: 'Use Payment' };
export const TE_CHECKOUT_PL_UPDATE_EXP       = { l2: 'Payment List', l3: 'Update Exp' };
export const TE_CHECKOUT_PL_VERIFY_CC        = { l2: 'Payment List', l3: 'Verify CC' };
export const TE_CHECKOUT_PL_GO_TO_ADD_NEW    = { l2: 'Payment List', l3: 'Go To Add New' };
export const TE_CHECKOUT_PL_TOGGLE_USE_PROMO = { l2: 'Payment List', l3: 'Toggle Use Promo' };

// checkout: suggested Addresses
export const TE_CHECKOUT_SA_SELECT_ADDRESS = { l2: 'Suggested Address Modal', l3: 'Select Address' };
export const TE_CHECKOUT_SA_USE_ADDRESS    = { l2: 'Suggested Address Modal', l3: 'Use Address' };

// checkout: address modal
export const TE_CHECKOUT_AM_SHIP_TO_ADDRESS   = { l2: 'Address Modal', l3: 'Ship To Address' };
export const TE_CHECKOUT_AM_BILL_TO_ADDRESS   = { l2: 'Address Modal', l3: 'Bill To Address' };
export const TE_CHECKOUT_AM_TOGGLE_IS_BILLING = { l2: 'Address Modal', l3: 'Toggle Is Billing' };
export const TE_CHECKOUT_AM_DELETE_ADDRESS    = { l2: 'Address Modal', l3: 'Delete Address' };
export const TE_CHECKOUT_AM_TOGGLE_IS_DEFAULT = { l2: 'Address Modal', l3: 'Toggle Is Default' };

export const TE_CHECKOUT_AM_DELETE_ADDRESS_SHIPPING = { l2: 'Address Modal', l3: 'Delete Address', l4: 'shipping' };
export const TE_CHECKOUT_AM_DELETE_ADDRESS_BILLING  = { l2: 'Address Modal', l3: 'Delete Address', l4: 'billing' };

// checkout: new pay modal
export const TE_CHECKOUT_PM_ADD_NEW_PAYMENT           = { l2: 'Payment Modal', l3: 'Add Payment' };
export const TE_CHECKOUT_PM_TOGGLE_PRIMARY            = { l2: 'Payment Modal', l3: 'Toggle Primary' };
export const TE_CHECKOUT_PM_TOGGLE_NAME               = { l2: 'Payment Modal', l3: 'Toggle Name' };

// checkout: billing list
export const TE_CHECKOUT_BL_SELECT_ADDRESS  = { l2: 'Billing List', l3: 'Select Address' };
export const TE_CHECKOUT_BL_USE_ADDRESS     = { l2: 'Billing List', l3: 'Use Address' };
export const TE_CHECKOUT_BL_SELECT_FOR_EDIT = { l2: 'Billing List', l3: 'Select For Edit' };
export const TE_CHECKOUT_BL_GO_TO_ADD_NEW   = { l2: 'Billing List', l3: 'Go To Add New' };

// checkout: gc/promo box
export const TE_CHECKOUT_GC_APPLY_PROMO = { l2: 'Gift Cards', l3: 'Apply Promo' };
export const TE_CHECKOUT_GC_TOGGLE      = { l2: 'Gift Cards', l3: 'Toggle Box' };

// checkout: review
export const TE_CHECKOUT_REV_QTY       = { l2: 'Review', l3: 'Change Quantity' };
export const TE_CHECKOUT_REV_GO_TO_PDP = { l2: 'Review', l3: 'Go To PDP' };

// newsfeed
export const TE_NEWSFEED_FITSURVEY_LOADED   = { l1: 'Impression', l2: 'News Feed Widget', l3: 'Loaded' };
export const TE_NEWSFEED_FITSURVEY_REPLY    = { l2: 'News Feed Widget', l3: 'Reply' };
export const TE_NEWSFEED_FITSURVEY_DISMISS  = { l2: 'News Feed Widget', l3: 'Dismiss' };

// returns
export const TE_RETURNS_PRODUCT_CLICK     = { l2: 'Returns', l3: 'Return Clicked' };

// landing pages
export const TE_LANDING_PRODUCT_HEART            = { l2: 'LandingPage', l3: 'Product Heart' };
export const TE_LANDING_PRODUCT_UNHEART          = { l2: 'LandingPage', l3: 'Product UnHeart' };
export const TE_LANDING_HEART_LOGIN_PROMPT       = { l2: 'LandingPage', l3: 'Heart Login Prompt' };

// brand pages
export const TE_BRAND_PAGE_PRODUCT_HEART         = { l2: 'BrandPage', l3: 'Product Heart' };
export const TE_BRAND_PAGE_PRODUCT_UNHEART       = { l2: 'BrandPage', l3: 'Product UnHeart' };
export const TE_BRAND_PAGE_HEART_LOGIN_PROMPT    = { l2: 'BrandPage', l3: 'Heart Login Prompt' };

// redeemable rewards
export const TE_REWARDS_REDEEM_POINTS            = { l2: 'RedeemableRewards', l3: 'Redeem Points' };
export const TE_REWARDS_CHANGE_REDEMPTION_AMOUNT = { l2: 'RedeemableRewards', l3: 'Select Redemption Amount' };

// vip dashboard
export const TE_VIP_SIGN_UP = { l2: 'Vip', l3: 'Sign Up' };

// hmd survey (how's my driving)
export const TE_HMD_SURVEY_LOADED   = { l2: 'Hmd Survey Form', l3: 'Loaded' };
export const TE_HMD_SURVEY_SUBMITTED    = { l2: 'Hmd Survey Form', l3: 'Submitted' };

// banner ads
export const TE_BANNER_AD_VIEW = { l2: 'Banner Ad', l3: 'View' };
export const TE_BANNER_AD_CLICK = { l2: 'Banner Ad', l3: 'Click' };

// Personalized Categores
export const TE_PERSONALIZED_CATEGORIES_VIEW = { l2: 'Personalized Categories', l3: 'View' };
export const TE_PERSONALIZED_CATEGORIES_CLICK = { l2: 'Personalized Categories', l3: 'Click' };

// Federated Login Modal
export const TE_FEDERATED_LOGIN_MODAL_CLOSE_MODAL_BTN = { l2: 'Federated Login Modal', l3: 'Close Modal Button Click' };
export const TE_FEDERATED_LOGIN_MODAL_CLOSE_MODAL_MISC = { l2: 'Federated Login Modal', l3: 'Close Modal Misc' };
export const TE_FEDERATED_LOGIN_MODAL_CREATE_ACCOUNT_BTN = { l2: 'Federated Login Modal', l3: 'Create Account Click' };
export const TE_FEDERATED_LOGIN_MODAL_SIGN_IN_WITH_ZAPPOS_BTN = { l2: 'Federated Login Modal', l3: 'Sign In With Zappos Click' };
export const TE_FEDERATED_LOGIN_MODAL_SIGN_IN_WITH_AMAZON_BTN = { l2: 'Federated Login Modal', l3: 'Sign In With Amazon Click' };
export const TE_FEDERATED_LOGIN_MODAL_SIGN_IN_WITH_GOOGLE_BTN = { l2: 'Federated Login Modal', l3: 'Sign In With Google Click' };
export const TE_FEDERATED_LOGIN_MODAL_SIGN_IN_WITH_FACEBOOK_BTN = { l2: 'Federated Login Modal', l3: 'Sign In With Facebook Click' };
export const TE_SHOW_FEDERATED_LOGIN_MODAL = { l1: 'Page View', l2: 'Federated Login Modal' };

// skip links
export const TE_SKIP_LINK_CLICK = { l2: 'Skip Link', l3: 'Click' };
