'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _SURVEY_CONFIGS, _SHEPHERD_TOURS_USER_, _SHEPHERD_TOURS_STEPS, _PUBLISHING_VIEW_ROUT, _NETWORK_LABELS, _ACCOUNT_TYPE_TO_ALLO, _ACCOUNT_TYPE_TO_ALLO2, _ACCOUNT_MAX_LENGTHS, _ACCOUNT_MAX_LENGTHS_, _MAX_IMAGE_BYTES, _MAX_IMAGE_PIXELS, _MAX_GIF_FRAME_COUNT, _ACCOUNT_TYPE_TO_MAX_, _ACCOUNT_TYPE_TO_MAX_2, _ACCOUNT_TYPE_TO_MIN_3, _ACCOUNT_TYPE_TO_MAX_5, _ACCOUNT_TYPE_TO_MIN_4, _ACCOUNT_TYPE_TO_MAX_6, _ACCOUNT_TYPE_TO_VIDE, _CHANNEL_TYPE_TO_SOUR, _keyMirror, _FM_FILE_TYPES_TO_BRO, _CONNECTION_ISSUE_LEA, _BROADCAST_STATE_TO_V, _BROADCAST_STATUS_TYP, _BROADCAST_STATUS_TYP2, _NETWORK_PREVIEW_KBDO, _ACTIONS_TO_LABEL, _ACTIONS_BY_NETWORK, _BROADCAST_STATUS_TYP3;

import { Set as ImmutableSet, Map as ImmutableMap, OrderedMap } from 'immutable';
import keyMirror from 'react-utils/keyMirror';
import { clone } from 'underscore';
import I18n from 'I18n';
import * as COLORS from 'HubStyleTokens/colors';
import PortalIdParser from 'PortalIdParser';
import { uppercaseFirstLetter } from './utils';
import { RANGE_TYPES } from './dateUtils';
export var STAT_PLACEHOLDERS = {
  supported: '--',
  notSupported: 'N/A'
};
export var POST_STATUS_TYPES = {
  draft: 'DRAFT',
  scheduled: 'SCHEDULED',
  uploaded: 'UPLOADED',
  failed: 'FAILED',
  pending: 'PENDING',
  top: 'TOP',
  published: 'PUBLISHED'
};
export var APP_SECTIONS = keyMirror({
  onboarding: null,
  inbox: null,
  manage: null,
  monitoring: null,
  analyze: null,
  publishing: null,
  compare: null,
  details: null,
  reports: null,
  settings: null,
  composerEmbed: null,
  composerExtension: null
});
export var SURVEY_CONFIGS = (_SURVEY_CONFIGS = {}, _defineProperty(_SURVEY_CONFIGS, APP_SECTIONS.manage, 478), _defineProperty(_SURVEY_CONFIGS, APP_SECTIONS.compare, 452), _SURVEY_CONFIGS);
export var BASE_DISPLAY_PARAMS = {
  xAxis: {
    title: {
      enabled: false
    }
  },
  yAxis: {
    title: {
      enabled: false
    }
  }
};
export var BAR_CHART_DISPLAY_PARAMS = Object.assign({}, BASE_DISPLAY_PARAMS);
export var CHANNEL_TYPE_SORT = [{
  property: 'channelType',
  type: 'ALPHA',
  order: 'ASC'
}];
export var CHART_HEIGHT = 300;
export var DATE_RANGE_KEYS = [RANGE_TYPES.THIS_WEEK, RANGE_TYPES.THIS_MONTH, RANGE_TYPES.LAST_MONTH, RANGE_TYPES.LAST_THIRTY_DAYS, RANGE_TYPES.THIS_QUARTER, RANGE_TYPES.THIS_YEAR, RANGE_TYPES.CUSTOM];
export var COMPOSER_QUERY_PARAMS = ['broadcastGuids', 'composer'];
export var SHEPHERD_TOURS = keyMirror({
  reportsNextOverview: null,
  publishingTable: null,
  detailsPanel: null,
  composer: null,
  manageDashboardStartTourModal: null,
  manageDashboard: null,
  reportsSaveButton: null
});
export var SHEPHERD_TOURS_USER_ATTRIBUTES = (_SHEPHERD_TOURS_USER_ = {}, _defineProperty(_SHEPHERD_TOURS_USER_, SHEPHERD_TOURS.reportsNextOverview, 'social:reportsNextOverviewShepherdStepsSeenAt'), _defineProperty(_SHEPHERD_TOURS_USER_, SHEPHERD_TOURS.publishingTable, 'social:publishingTableStepsSeenAt'), _defineProperty(_SHEPHERD_TOURS_USER_, SHEPHERD_TOURS.detailsPanel, 'social:detailsPanelTourStepsSeenAt'), _defineProperty(_SHEPHERD_TOURS_USER_, SHEPHERD_TOURS.composer, 'social:composerShepherdSeen'), _defineProperty(_SHEPHERD_TOURS_USER_, SHEPHERD_TOURS.manageDashboardStartTourModal, 'social:manageDashboardStartTourModalSeenAt'), _defineProperty(_SHEPHERD_TOURS_USER_, SHEPHERD_TOURS.manageDashboard, 'social:manageDashboardTourSeenAt'), _SHEPHERD_TOURS_USER_);
export var SHEPHERD_TOURS_STEPS = (_SHEPHERD_TOURS_STEPS = {}, _defineProperty(_SHEPHERD_TOURS_STEPS, SHEPHERD_TOURS.composer, OrderedMap(keyMirror({
  addMessage: null,
  deleteMessage: null
}))), _defineProperty(_SHEPHERD_TOURS_STEPS, SHEPHERD_TOURS.reportsNextOverview, OrderedMap(keyMirror({
  networkSelect: null,
  // lb - currently its not supported to make a tour step conditional based on a gate or something like that, for now you must use About the charts
  // my suggestion for this is to move these tour step defs into redux state, where you have the chance to tweak options based on scopes/gates as you pass in initialState to reducer
  channelAudienceByNetwork: null,
  socialPostsPublishedByNetwork: null,
  socialPostInteractionsByNetwork: null,
  socialPostClicksByNetwork: null,
  socialPostSharesByNetwork: null,
  socialPostImpressionsByNetwork: null,
  sessionsBySocialNetworkTimeSeries: null,
  contactsBySocialNetworkTimeSeries: null,
  aboutTheCharts: null
}))), _defineProperty(_SHEPHERD_TOURS_STEPS, SHEPHERD_TOURS.reportsSaveButton, OrderedMap(keyMirror({
  saveReport: null
}))), _defineProperty(_SHEPHERD_TOURS_STEPS, SHEPHERD_TOURS.publishingTable, OrderedMap(keyMirror({
  stepCalendar: null,
  stepBulk: null
}))), _defineProperty(_SHEPHERD_TOURS_STEPS, SHEPHERD_TOURS.detailsPanel, OrderedMap(keyMirror({
  broadcastAdsBoosting: null
}))), _defineProperty(_SHEPHERD_TOURS_STEPS, SHEPHERD_TOURS.manageDashboard, OrderedMap(keyMirror({
  allPosts: null,
  scheduleBulk: null,
  searchPosts: null,
  manageColumns: null,
  topPosts: null
}))), _defineProperty(_SHEPHERD_TOURS_STEPS, SHEPHERD_TOURS.manageDashboardStartTourModal, OrderedMap(keyMirror({
  startModal: null
}))), _SHEPHERD_TOURS_STEPS);
export var USER_ATTR_FAVORITE_CHANNEL_KEYS = "social:favoriteChannelKeys:" + PortalIdParser.get();
export var USER_ATTR_DEFAULT_PUBLISH_NOW = "social:defaultPublishNow:" + PortalIdParser.get();
export var USER_ATTR_MANAGE_COLUMNS = "social:manageColumns:" + PortalIdParser.get();
export var USER_ATTR_FAVORITE_CHANNEL_POPOVER_SEEN = 'social:favoriteChannelsSeen';
export var USER_ATTR_DEFAULT_PUBLISHING_VIEW = 'social:defaultPublishingView';
export var USER_ATTR_FAILED_POST_BANNER_DISMISSAL_TIME = "social:failedPostBannerDismissalTime:" + PortalIdParser.get();
export var PUBLISHING_VIEW = keyMirror({
  calendar: null,
  publishingTable: null
});
export var PUBLISHING_VIEW_ROUTE = (_PUBLISHING_VIEW_ROUT = {}, _defineProperty(_PUBLISHING_VIEW_ROUT, PUBLISHING_VIEW.calendar, 'calendar'), _defineProperty(_PUBLISHING_VIEW_ROUT, PUBLISHING_VIEW.publishingTable, 'publishing'), _PUBLISHING_VIEW_ROUT);
export var USER_ATTRIBUTES_TO_FETCH = [SHEPHERD_TOURS_USER_ATTRIBUTES.reportsNextOverview, SHEPHERD_TOURS_USER_ATTRIBUTES.publishingTable, SHEPHERD_TOURS_USER_ATTRIBUTES.detailsPanel, SHEPHERD_TOURS_USER_ATTRIBUTES.composer, SHEPHERD_TOURS_USER_ATTRIBUTES.manageDashboardStartTourModal, SHEPHERD_TOURS_USER_ATTRIBUTES.manageDashboard, USER_ATTR_FAVORITE_CHANNEL_KEYS, USER_ATTR_DEFAULT_PUBLISHING_VIEW, USER_ATTR_FAVORITE_CHANNEL_POPOVER_SEEN, USER_ATTR_DEFAULT_PUBLISH_NOW, USER_ATTR_MANAGE_COLUMNS, USER_ATTR_FAILED_POST_BANNER_DISMISSAL_TIME];
export var IMAGES_PREVIEW_TROUBLESHOOTING_URL = 'https://knowledge.hubspot.com/articles/kcs_article/social/featured-image-not-displaying-correctly-in-social-preview'; // export const API_GAMERA_BASE_URL = 'gamera/v2/item/social-app';

export var API_USER_ATTRIBUTES_BASE_URL = 'users/v1/app/attributes';
export var ACCOUNT_TYPES = keyMirror({
  facebook: null,
  instagram: null,
  twitter: null,
  youtube: null,
  linkedin: null,
  blogfeed: null,
  bitly: null
});
export var ACCOUNT_TYPES_TO_OAUTHOR_SERVICE = {
  facebook: 'facebook',
  instagram: 'facebook',
  twitter: 'twitter',
  youtube: 'google',
  linkedin: 'linkedin'
};
export var NETWORK_LABELS = (_NETWORK_LABELS = {}, _defineProperty(_NETWORK_LABELS, ACCOUNT_TYPES.youtube, 'YouTube'), _defineProperty(_NETWORK_LABELS, ACCOUNT_TYPES.facebook, 'Facebook'), _defineProperty(_NETWORK_LABELS, ACCOUNT_TYPES.twitter, 'Twitter'), _defineProperty(_NETWORK_LABELS, ACCOUNT_TYPES.instagram, 'Instagram'), _defineProperty(_NETWORK_LABELS, ACCOUNT_TYPES.linkedin, 'LinkedIn'), _NETWORK_LABELS);
export var NETWORK_IDS = {
  0: ACCOUNT_TYPES.twitter,
  1: ACCOUNT_TYPES.facebook,
  2: ACCOUNT_TYPES.linkedin,
  4: ACCOUNT_TYPES.instagram
};
export var NETWORKS_TO_IDS = Object.values(NETWORK_IDS || {});
export var CHANNEL_PICKER_ACCOUNT_TYPES_SORTED = [ACCOUNT_TYPES.facebook, ACCOUNT_TYPES.instagram, ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.linkedin, ACCOUNT_TYPES.youtube]; // note order is meaningful here, SelectChannelsModal will follow this within an account type

export var CHANNEL_TYPES = keyMirror({
  twitter: null,
  linkedinstatus: null,
  linkedincompany: null,
  linkedincompanypage: null,
  facebookpage: null,
  instagram: null,
  youtube: null
}); // these act like their own network, but really belong under a different root accoun type

export var NETWORK_CHANNEL_TYPES = _defineProperty({}, CHANNEL_TYPES.instagram, CHANNEL_TYPES.instagram);
export var NETWORK_CHANNEL_TO_ACCOUNT_TYPES = _defineProperty({}, CHANNEL_TYPES.instagram, ACCOUNT_TYPES.facebook);
export var REPORTS_NEXT_SUPPORTED_CHANNEL_TYPES = [CHANNEL_TYPES.facebookpage, CHANNEL_TYPES.instagram, CHANNEL_TYPES.twitter, CHANNEL_TYPES.linkedincompanypage, CHANNEL_TYPES.linkedinstatus, CHANNEL_TYPES.youtube];
export var DETAILS_PANEL_NETWORKS = [ACCOUNT_TYPES.facebook, ACCOUNT_TYPES.instagram, ACCOUNT_TYPES.linkedin];
export var DEFAULT_SAVED_COLUMNS = ['publishedAt', 'clicks', 'interactionsTotal', 'broadcastGuid', 'campaignName'];
export var DEFERRED_CHANNEL_NETWORKS = [ACCOUNT_TYPES.facebook, ACCOUNT_TYPES.instagram, ACCOUNT_TYPES.linkedin];
export var COMPOSER_MODES = keyMirror({
  create: null,
  edit: null,
  approve: null
});
export var COMPOSER_WIDTH = 800;
export var BROADCAST_DETAILS_PANEL_WIDTH = 800;
export var COMPOSER_SHEPHERD_STEPS = keyMirror({
  addMessage: null,
  deleteMessage: null
});
export var PUBLISHING_SHEPHERD_STEPS = keyMirror({
  stepCalendar: null,
  stepBulk: null
});
export var PUBLISHING_SHEPHERD_STEP_ARRAY = Object.values(PUBLISHING_SHEPHERD_STEPS || {});
export var PHOTO_URL = 'photoUrl';
export var LINK_IMAGE_URL = 'imageUrl';
export var COMPOSER_NETWORKS = [ACCOUNT_TYPES.facebook, CHANNEL_TYPES.instagram, ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.linkedin];
export var BROADCAST_GROUP_OPTIONS_KEYS = keyMirror({
  accountExpired: null,
  missingChannel: null
});
export var COMPOSER_EDITABLE_LINK_PREVIEW_NETWORKS = [ACCOUNT_TYPES.linkedin];
export var COMPOSE_CONTENT_ATTACH_TYPES = keyMirror({
  post: null,
  page: null
});
export var COMPOSER_NEXT_MESSAGE_DELAYS = keyMirror({
  nextSlot: null,
  day1: null,
  day2: null,
  day3: null,
  day4: null,
  day5: null,
  week1: null
});
export var CONTENT_TYPE = keyMirror({
  cosblog: null,
  coslp: null
});
export var COMPOSER_UPLOAD_FOLDER_PATH = 'social-suggested-images';
export var IMAGE_PREVIEW_SIZE = keyMirror({
  original: null,
  medium: null,
  thumb: null
});
export var ALLOWED_IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif'];
export var ALLOWED_MULTI_PHOTO_EXTENSIONS = ['png', 'jpg', 'jpeg'];
export var ALLOWED_BULK_UPLOAD_EXTENSIONS = new ImmutableSet(['csv', 'xls', 'xlsx']);
export var DISALLOWED_IMAGE_MIME_TYPES = ['webp', 'bmp', 'x-ms-bmp', 'x-bmp', 'tiff'];
var FACEBOOK_ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'avi', 'mov', 'mpeg4', 'm4v'];
var INSTAGRAM_ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'mov'];
var INSTAGRAM_ALLOWED_VIDEO_CODECS = ['h264', 'hevc'];
var INSTAGRAM_ALLOWED_VIDEO_AUDIO_CODECS = ['aac'];
var TWITTER_ALLOWED_VIDEO_EXTENSIONS = ['mp4', 'mov'];
var TWITTER_ALLOWED_VIDEO_CODECS = ['h264'];
var LINKEDIN_ALLOWED_VIDEO_EXTENSIONS = FACEBOOK_ALLOWED_VIDEO_EXTENSIONS;
export var ALL_VIDEO_EXTENSIONS = ImmutableSet().union(FACEBOOK_ALLOWED_VIDEO_EXTENSIONS, INSTAGRAM_ALLOWED_VIDEO_EXTENSIONS, TWITTER_ALLOWED_VIDEO_EXTENSIONS, LINKEDIN_ALLOWED_VIDEO_EXTENSIONS).toArray();
export var ACCOUNT_TYPE_TO_ALLOWED_VIDEO_EXTENSIONS = (_ACCOUNT_TYPE_TO_ALLO = {}, _defineProperty(_ACCOUNT_TYPE_TO_ALLO, ACCOUNT_TYPES.facebook, FACEBOOK_ALLOWED_VIDEO_EXTENSIONS), _defineProperty(_ACCOUNT_TYPE_TO_ALLO, ACCOUNT_TYPES.instagram, INSTAGRAM_ALLOWED_VIDEO_EXTENSIONS), _defineProperty(_ACCOUNT_TYPE_TO_ALLO, ACCOUNT_TYPES.twitter, TWITTER_ALLOWED_VIDEO_EXTENSIONS), _defineProperty(_ACCOUNT_TYPE_TO_ALLO, ACCOUNT_TYPES.linkedin, LINKEDIN_ALLOWED_VIDEO_EXTENSIONS), _ACCOUNT_TYPE_TO_ALLO);
export var ACCOUNT_TYPE_TO_ALLOWED_VIDEO_CODECS = (_ACCOUNT_TYPE_TO_ALLO2 = {}, _defineProperty(_ACCOUNT_TYPE_TO_ALLO2, ACCOUNT_TYPES.instagram, INSTAGRAM_ALLOWED_VIDEO_CODECS), _defineProperty(_ACCOUNT_TYPE_TO_ALLO2, ACCOUNT_TYPES.twitter, TWITTER_ALLOWED_VIDEO_CODECS), _ACCOUNT_TYPE_TO_ALLO2);
export var ACCOUNT_TYPE_TO_ALLOWED_VIDEO_AUDIO_CODECS = _defineProperty({}, ACCOUNT_TYPES.instagram, INSTAGRAM_ALLOWED_VIDEO_AUDIO_CODECS); // we don't want to show 'by @username' when the links are from the following urls

export var SKIP_VIA_USERNAMES = ['youtube', 'medium'];
export var ACCOUNT_MAX_LENGTHS = (_ACCOUNT_MAX_LENGTHS = {}, _defineProperty(_ACCOUNT_MAX_LENGTHS, ACCOUNT_TYPES.twitter, 280), _defineProperty(_ACCOUNT_MAX_LENGTHS, ACCOUNT_TYPES.facebook, 2500), _defineProperty(_ACCOUNT_MAX_LENGTHS, ACCOUNT_TYPES.instagram, 2200), _defineProperty(_ACCOUNT_MAX_LENGTHS, ACCOUNT_TYPES.linkedin, 3000), _ACCOUNT_MAX_LENGTHS);
export var ACCOUNT_MAX_LENGTHS_FOR_REPLY = (_ACCOUNT_MAX_LENGTHS_ = {}, _defineProperty(_ACCOUNT_MAX_LENGTHS_, ACCOUNT_TYPES.twitter, ACCOUNT_MAX_LENGTHS.twitter), _defineProperty(_ACCOUNT_MAX_LENGTHS_, ACCOUNT_TYPES.facebook, 1000), _defineProperty(_ACCOUNT_MAX_LENGTHS_, ACCOUNT_TYPES.instagram, 1000), _defineProperty(_ACCOUNT_MAX_LENGTHS_, ACCOUNT_TYPES.linkedin, 1000), _ACCOUNT_MAX_LENGTHS_); // twitter shortlink of 23 chars + extra 2 for spacer that are inserted into customized post

export var BAP_CUSTOMIZATION_APPENDED_CHAR_LENGTH = 25;
export var MAX_IMAGE_DESCRIPTION_LENGTH = 200;
export var INSTAGRAM_MAX_HASHTAGS = 30;
export var ACCOUNT_MAX_IMAGE_DIMENSIONS_DEFAULT = 8192;
export var INSTAGRAM_MIN_SUGGESTED_DIMENSIONS = 1080;
export var ACCOUNT_SUGGESTED_MIN_IMAGE_DIMENSIONS = _defineProperty({}, ACCOUNT_TYPES.facebook, [460, 246]); // https://developers.facebook.com/docs/graph-api/photo-uploads/ - facebook recommends under 4MB but allow more (that said, this seems to be a good default)
// https://developer.twitter.com/en/docs/media/upload-media/uploading-media/media-best-practices
// https://developers.facebook.com/docs/instagram-api/reference/user/media/
// https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/rich-media-shares#upload-rich-media

export var MAX_IMAGE_BYTES = (_MAX_IMAGE_BYTES = {}, _defineProperty(_MAX_IMAGE_BYTES, ACCOUNT_TYPES.facebook, 4 * 1024 * 1024), _defineProperty(_MAX_IMAGE_BYTES, ACCOUNT_TYPES.instagram, 8 * 1024 * 1024), _defineProperty(_MAX_IMAGE_BYTES, ACCOUNT_TYPES.linkedin, 10 * 1024 * 1024), _defineProperty(_MAX_IMAGE_BYTES, ACCOUNT_TYPES.twitter, 5 * 1024 * 1024), _MAX_IMAGE_BYTES);
export var MAX_IMAGE_PIXELS = (_MAX_IMAGE_PIXELS = {}, _defineProperty(_MAX_IMAGE_PIXELS, ACCOUNT_TYPES.facebook, null), _defineProperty(_MAX_IMAGE_PIXELS, ACCOUNT_TYPES.instagram, null), _defineProperty(_MAX_IMAGE_PIXELS, ACCOUNT_TYPES.linkedin, 36152320), _defineProperty(_MAX_IMAGE_PIXELS, ACCOUNT_TYPES.twitter, null), _MAX_IMAGE_PIXELS);
export var MAX_GIF_FRAME_COUNT = (_MAX_GIF_FRAME_COUNT = {}, _defineProperty(_MAX_GIF_FRAME_COUNT, ACCOUNT_TYPES.facebook, null), _defineProperty(_MAX_GIF_FRAME_COUNT, ACCOUNT_TYPES.instagram, null), _defineProperty(_MAX_GIF_FRAME_COUNT, ACCOUNT_TYPES.linkedin, 270), _defineProperty(_MAX_GIF_FRAME_COUNT, ACCOUNT_TYPES.twitter, null), _MAX_GIF_FRAME_COUNT);
export var MAX_IMAGE_BYTES_ANIMATED = _defineProperty({}, ACCOUNT_TYPES.twitter, 15 * 1024 * 1024); // sanity check for any undefined network (but preferably define all networks)

export var MAX_IMAGE_BYTES_DEFAULT = 8 * 1024 * 1024; // facebook will fail to render preview images over this size, see https://developers.facebook.com/docs/sharing/best-practices#images

export var MAX_PREVIEW_IMAGE_BYTES = 8 * 1024 * 1024; // see https://issues.hubspotcentral.com/browse/SM-4393?focusedCommentId=1097507

export var MAX_PREVIEW_IMAGE_BYTES_TWITTER = 5 * 1024 * 1024; // keep matched to: https://git.hubteam.com/HubSpot/Broadcast/blob/master/BroadcastData/src/main/config/broadcastdata.xml

export var ACCOUNT_TYPE_TO_MAX_VIDEO_SIZE_BYTES = (_ACCOUNT_TYPE_TO_MAX_ = {}, _defineProperty(_ACCOUNT_TYPE_TO_MAX_, ACCOUNT_TYPES.facebook, 1024 * 1024 * 1024), _defineProperty(_ACCOUNT_TYPE_TO_MAX_, ACCOUNT_TYPES.instagram, 100 * 1024 * 1024), _defineProperty(_ACCOUNT_TYPE_TO_MAX_, ACCOUNT_TYPES.twitter, 512 * 1024 * 1024), _defineProperty(_ACCOUNT_TYPE_TO_MAX_, ACCOUNT_TYPES.linkedin, 5 * 1024 * 1024 * 1024), _ACCOUNT_TYPE_TO_MAX_); // sanity check for any undefined network (but preferably define all networks)

export var MAX_VIDEO_SIZE_BYTES_DEFAULT = 100 * 1024 * 1024;
export var ACCOUNT_TYPE_TO_MIN_VIDEO_SIZE_BYTES = _defineProperty({}, ACCOUNT_TYPES.linkedin, 75 * 1024);
export var ACCOUNT_TYPE_TO_MAX_VIDEO_FRAME_RATE = (_ACCOUNT_TYPE_TO_MAX_2 = {}, _defineProperty(_ACCOUNT_TYPE_TO_MAX_2, ACCOUNT_TYPES.twitter, 60.0), _defineProperty(_ACCOUNT_TYPE_TO_MAX_2, ACCOUNT_TYPES.instagram, 60.0), _ACCOUNT_TYPE_TO_MAX_2);
export var ACCOUNT_TYPE_TO_MIN_VIDEO_FRAME_RATE = _defineProperty({}, ACCOUNT_TYPES.instagram, 23.0);
export var ACCOUNT_TYPE_TO_MAX_VIDEO_BITRATE = _defineProperty({}, ACCOUNT_TYPES.instagram, 5 * 1000 * 1000);
export var ACCOUNT_TYPE_TO_MAX_VIDEO_BITRATE_FRIENDLY = _defineProperty({}, ACCOUNT_TYPES.instagram, '5Mbps');
export var ACCOUNT_TYPE_TO_MIN_VIDEO_DURATION_SECONDS = (_ACCOUNT_TYPE_TO_MIN_3 = {}, _defineProperty(_ACCOUNT_TYPE_TO_MIN_3, ACCOUNT_TYPES.facebook, 1), _defineProperty(_ACCOUNT_TYPE_TO_MIN_3, ACCOUNT_TYPES.instagram, 3), _defineProperty(_ACCOUNT_TYPE_TO_MIN_3, ACCOUNT_TYPES.twitter, 0.5), _defineProperty(_ACCOUNT_TYPE_TO_MIN_3, ACCOUNT_TYPES.linkedin, 3), _ACCOUNT_TYPE_TO_MIN_3);
export var ACCOUNT_TYPE_TO_MAX_VIDEO_DURATION_SECONDS = (_ACCOUNT_TYPE_TO_MAX_5 = {}, _defineProperty(_ACCOUNT_TYPE_TO_MAX_5, ACCOUNT_TYPES.facebook, 20 * 60), _defineProperty(_ACCOUNT_TYPE_TO_MAX_5, ACCOUNT_TYPES.instagram, 60), _defineProperty(_ACCOUNT_TYPE_TO_MAX_5, ACCOUNT_TYPES.twitter, 140), _defineProperty(_ACCOUNT_TYPE_TO_MAX_5, ACCOUNT_TYPES.linkedin, 30 * 60), _ACCOUNT_TYPE_TO_MAX_5);
export var ACCOUNT_TYPE_TO_MIN_VIDEO_ASPECT_RATIO = (_ACCOUNT_TYPE_TO_MIN_4 = {}, _defineProperty(_ACCOUNT_TYPE_TO_MIN_4, ACCOUNT_TYPES.facebook, 0.25), _defineProperty(_ACCOUNT_TYPE_TO_MIN_4, ACCOUNT_TYPES.instagram, 0.8), _defineProperty(_ACCOUNT_TYPE_TO_MIN_4, ACCOUNT_TYPES.twitter, 1 / 3), _defineProperty(_ACCOUNT_TYPE_TO_MIN_4, ACCOUNT_TYPES.linkedin, 1 / 2.4), _ACCOUNT_TYPE_TO_MIN_4);
export var ACCOUNT_TYPE_TO_MAX_VIDEO_ASPECT_RATIO = (_ACCOUNT_TYPE_TO_MAX_6 = {}, _defineProperty(_ACCOUNT_TYPE_TO_MAX_6, ACCOUNT_TYPES.facebook, 4.0), _defineProperty(_ACCOUNT_TYPE_TO_MAX_6, ACCOUNT_TYPES.instagram, 1.78), _defineProperty(_ACCOUNT_TYPE_TO_MAX_6, ACCOUNT_TYPES.twitter, 3.0), _defineProperty(_ACCOUNT_TYPE_TO_MAX_6, ACCOUNT_TYPES.linkedin, 2.4), _ACCOUNT_TYPE_TO_MAX_6);
export var ACCOUNT_TYPE_TO_MAX_VIDEO_WIDTH = _defineProperty({}, ACCOUNT_TYPES.instagram, 1920);
export var ACCOUNT_TYPE_TO_MAX_VIDEO_HEIGHT = {// TODO: Twitter allowed videos larger than this despite their docs and others failing. worth reviewing what their true limit is
  //[ACCOUNT_TYPES.twitter]: 1024,
};
export var ACCOUNT_TYPE_TO_MIN_VIDEO_WIDTH = _defineProperty({}, ACCOUNT_TYPES.twitter, 32);
export var ACCOUNT_TYPE_TO_MIN_VIDEO_HEIGHT = _defineProperty({}, ACCOUNT_TYPES.twitter, 32);
export var ACCOUNT_TYPE_TO_VIDEO_LINK = (_ACCOUNT_TYPE_TO_VIDE = {}, _defineProperty(_ACCOUNT_TYPE_TO_VIDE, ACCOUNT_TYPES.facebook, 'https://developers.facebook.com/docs/graph-api/video-uploads/'), _defineProperty(_ACCOUNT_TYPE_TO_VIDE, ACCOUNT_TYPES.instagram, 'https://developers.facebook.com/docs/instagram/ads-api/reference/media-requirements'), _defineProperty(_ACCOUNT_TYPE_TO_VIDE, ACCOUNT_TYPES.twitter, 'https://developer.twitter.com/en/docs/media/upload-media/uploading-media/media-best-practices.html'), _defineProperty(_ACCOUNT_TYPE_TO_VIDE, ACCOUNT_TYPES.linkedin, 'https://www.linkedin.com/help/lms/answer/85306?query=video&hcppcid=search'), _ACCOUNT_TYPE_TO_VIDE);
export var DEFAULT_UNTITLED_FILENAME = 'Untitled';
export var FM_FILE_TYPES = keyMirror({
  IMG: null,
  MOVIE: null
}); // if inserted via URL feature in File Manager, will end up as file with id: -1
// we want to download this to the FM before publishing

export var FILE_FROM_URL_ID = -1;
export function getChannelSlugFromKey(channelKey) {
  return channelKey.split(':')[0].toLowerCase();
}
export var FACEBOOK_PAGE_TASKS = keyMirror({
  ADVERTISE: null,
  ANALYZE: null,
  CREATE_CONTENT: null,
  MANAGE: null,
  MODERATE: null
});
export var COMPOSER_MESSAGE_TYPES = {
  ready: 'hs_composeready',
  loadComposeParams: 'loadComposeParams',
  exit: 'hs_socialexit',
  requestComposerClose: 'hs_requestComposerClose'
};
export var COMPOSER_IMAGE_INVALID_REASON = keyMirror({
  failedDownload: null,
  tooSmallDimensions: null,
  tooLargeDimensions: null,
  tooLargeByteSize: null,
  linkedinUnderscoreInHostname: null
});
export var CHANNEL_TYPE_TO_ACCOUNT_TYPES = {
  twitter: ACCOUNT_TYPES.twitter,
  linkedinstatus: ACCOUNT_TYPES.linkedin,
  linkedincompany: ACCOUNT_TYPES.linkedin,
  linkedincompanypage: ACCOUNT_TYPES.linkedin,
  facebookpage: ACCOUNT_TYPES.facebook,
  instagram: ACCOUNT_TYPES.instagram,
  bitly: ACCOUNT_TYPES.bitly,
  youtube: ACCOUNT_TYPES.youtube
};
export var CHANNEL_TYPE_TO_SOURCES_TYPE = (_CHANNEL_TYPE_TO_SOUR = {}, _defineProperty(_CHANNEL_TYPE_TO_SOUR, CHANNEL_TYPES.facebookpage, 'fbp'), _defineProperty(_CHANNEL_TYPE_TO_SOUR, CHANNEL_TYPES.twitter, 'tw'), _defineProperty(_CHANNEL_TYPE_TO_SOUR, CHANNEL_TYPES.linkedinstatus, 'lis'), _defineProperty(_CHANNEL_TYPE_TO_SOUR, CHANNEL_TYPES.linkedincompanypage, 'lcp'), _CHANNEL_TYPE_TO_SOUR); // value channel types will be nested under their parentIds of key type in SelectChannelsModal

export var CHANNEL_SUBTYPES = _defineProperty({}, CHANNEL_TYPES.facebookpage, CHANNEL_TYPES.instagram); // "properties" are connected through these "personal" channels

export var CHANNEL_OWNER_TYPES = [CHANNEL_TYPES.linkedinstatus];
export var MEDIA_FILTER_OPTIONS = keyMirror({
  all: null,
  link: null,
  photo: null,
  video: null
});
export var MEDIA_FILTERS_ORDERED = [MEDIA_FILTER_OPTIONS.all, MEDIA_FILTER_OPTIONS.link, MEDIA_FILTER_OPTIONS.photo, MEDIA_FILTER_OPTIONS.video];
export var PUBLISHABLE_CHANNEL_TYPES = [CHANNEL_TYPES.twitter, CHANNEL_TYPES.facebookpage, CHANNEL_TYPES.instagram, CHANNEL_TYPES.linkedinstatus, CHANNEL_TYPES.linkedincompanypage];
export var ACCOUNT_LONG_EXPIRED_DAYS = 90;
export var ACCOUNT_EXPIRED_DAYS_FACEBOOK = 90;
export var ACCOUNT_EXPIRED_DAYS_LINKEDIN = 365;
export var ACCOUNT_SETTINGS_CHANNEL_TYPES = clone(PUBLISHABLE_CHANNEL_TYPES).concat([CHANNEL_TYPES.youtube]);
export var CHANNEL_VALIDATION = keyMirror({
  FB_PAGE_PERMISSIONS: null,
  FB_CHANNEL_SCOPES: null,
  LI_PERMISSION_MIGRATION: null,
  EXPIRED: null,
  WILL_EXPIRE: null,
  INSTAGRAM_PERMISSIONS: null
});
export var CHANNEL_VALIDATION_ERRORS = [CHANNEL_VALIDATION.FB_PAGE_PERMISSIONS, CHANNEL_VALIDATION.FB_CHANNEL_SCOPES, CHANNEL_VALIDATION.EXPIRED, CHANNEL_VALIDATION.INSTAGRAM_PERMISSIONS];
export var LINKEDIN_DELETION_GAP_DAYS = 8;
export var LINKEDIN_EXPIRE_SOON_DAYS = 2;
export var EXPIRE_SOON_DAYS = 7;
export var TAG_STATUS = {
  ERROR: 'error',
  WARNING: 'warning'
};
export var FOLLOW_ME_ACCOUNT_TYPES = [ACCOUNT_TYPES.facebook, ACCOUNT_TYPES.instagram, ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.linkedin, ACCOUNT_TYPES.youtube, ACCOUNT_TYPES.blogfeed, 'link']; // these are stored as followUrls, not channels

export var FOLLOW_ME_RAW_URL_ACCOUNT_TYPES = [ACCOUNT_TYPES.youtube, ACCOUNT_TYPES.blogfeed, 'link'];
export var FAVORITE_COUNT_NETWORKS = [ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.instagram];
export var CLICK_TRACKING_NETWORKS = [ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.facebook, ACCOUNT_TYPES.linkedin];
export var CLICK_TRACKING_CHANNEL_TYPES = [CHANNEL_TYPES.facebookpage, CHANNEL_TYPES.twitter, CHANNEL_TYPES.linkedinstatus, CHANNEL_TYPES.linkedincompanypage];
export var INBOX_COMMENT_VISIBLE_COUNT = 5;
export var INBOX_REPLY_VISIBLE_COUNT = 3;
export var SOCIAL_CONTACTS_NETWORKS = [ACCOUNT_TYPES.twitter];
export var SOCIAL_USER_LOOKUP_TYPES = keyMirror((_keyMirror = {}, _defineProperty(_keyMirror, ACCOUNT_TYPES.twitter, null), _defineProperty(_keyMirror, ACCOUNT_TYPES.facebook, null), _defineProperty(_keyMirror, ACCOUNT_TYPES.linkedin, null), _defineProperty(_keyMirror, "email", null), _keyMirror));
export var BLOG_SELECT_MODES = keyMirror({
  hubspot: null,
  custom: null
});
export var CONNECT_MODAL_NETWORKS = [ACCOUNT_TYPES.facebook, ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.linkedin];
export var MULTI_IMAGE_ACCOUNT_TYPES = [ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.facebook, ACCOUNT_TYPES.linkedin];
var ACCOUNT_SLUG_TO_ICON = {
  blogfeed: 'rss'
};
var ACCOUNT_SLUG_TO_COLOR = {
  blogfeed: 'rss'
};
export function getAccountIcon(accountSlug) {
  var block = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (accountSlug === 'link') {
    return 'link';
  }

  var iconName = ACCOUNT_SLUG_TO_ICON[accountSlug] || "social" + uppercaseFirstLetter(accountSlug);
  return block ? "socialBlock" + uppercaseFirstLetter(accountSlug) : iconName;
}
export function getAccountColor(accountSlug) {
  return COLORS[(ACCOUNT_SLUG_TO_COLOR[accountSlug] || accountSlug).toUpperCase()];
}
export function getAccountDisplayName(accountSlug) {
  return I18n.lookup("sui.accountConstants." + accountSlug + ".displayName") ? I18n.text("sui.accountConstants." + accountSlug + ".displayName") : I18n.text('sui.accountConstants.unknown.displayName');
}
export function getChannelDisplayName(channelSlug) {
  var plural = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!I18n.lookup("sui.channelConstants." + channelSlug + ".displayName")) {
    return I18n.text('sui.channelConstants.unknown.displayName');
  }

  if (plural && I18n.lookup("sui.channelConstants." + channelSlug + ".plural")) {
    return I18n.text("sui.channelConstants." + channelSlug + ".plural");
  }

  return I18n.lookup("sui.channelConstants." + channelSlug + ".displayName");
}
export function getChannelIdFromChannelKey(channelKey) {
  return channelKey.split(':')[1];
}
export function getChannelSlugFromChannelKey(channelKey) {
  return channelKey.split(':')[0].toLowerCase();
}
export function getNetworkFromChannelKey(channelKey) {
  return CHANNEL_TYPE_TO_ACCOUNT_TYPES[channelKey.split(':')[0].toLowerCase()];
}
export function getTopPostsFilterOptions(_ref) {
  var withOptionText = _ref.withOptionText;
  return {
    CLICKS: {
      text: withOptionText ? I18n.text('srui.topPosts.filters.clicks') : null,
      value: 'clicks'
    },
    IMPRESSIONS: {
      text: withOptionText ? I18n.text('srui.topPosts.filters.impressions') : null,
      value: 'impressions'
    },
    INTERACTIONS: {
      text: withOptionText ? I18n.text('srui.topPosts.filters.interactions') : null,
      value: 'interactions'
    },
    SHARES: {
      text: withOptionText ? I18n.text('srui.topPosts.filters.shares') : null,
      value: 'shares'
    }
  };
}
export function getTopPostsFiltersForNetwork(_ref2) {
  var network = _ref2.network,
      _ref2$withOptionText = _ref2.withOptionText,
      withOptionText = _ref2$withOptionText === void 0 ? false : _ref2$withOptionText;
  var FILTER_OPTIONS = getTopPostsFilterOptions({
    withOptionText: withOptionText
  });
  var options = [];

  switch (network) {
    case ACCOUNT_TYPES.facebook:
    case ACCOUNT_TYPES.linkedin:
      options = [FILTER_OPTIONS.IMPRESSIONS, FILTER_OPTIONS.INTERACTIONS, FILTER_OPTIONS.SHARES, FILTER_OPTIONS.CLICKS];
      break;

    case ACCOUNT_TYPES.twitter:
      options = [FILTER_OPTIONS.INTERACTIONS, FILTER_OPTIONS.SHARES, FILTER_OPTIONS.CLICKS];
      break;

    case ACCOUNT_TYPES.youtube:
      options = [];
      break;

    case ACCOUNT_TYPES.instagram:
      options = [FILTER_OPTIONS.INTERACTIONS, FILTER_OPTIONS.IMPRESSIONS, FILTER_OPTIONS.SHARES];
      break;

    default:
      options = [FILTER_OPTIONS.INTERACTIONS, FILTER_OPTIONS.IMPRESSIONS, FILTER_OPTIONS.SHARES, FILTER_OPTIONS.CLICKS];
      break;
  }

  return options;
}
export var SIMPLE_DATE_FORMAT = 'YYYY-MM-DD';
export var ANALYTICS_DATE_FORMAT = 'YYYYMMDD';
export var EARLIEST_DATE = '2013-01-01';
export var BULK_UPLOAD_NETWORKS = [ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.facebook, ACCOUNT_TYPES.linkedin];
export var MANAGE_BETA_GATE = 'Social:ManageBeta';
export var COMPARE_BETA_GATE = 'Social:CompareBeta';
export var ALL_RIVAL_IQ_CHANNELS = ['facebook', 'instagram', 'twitter', 'youtube'];
export var APP_ROOT = 'social';
export var SERVICE_NAME = 'social';
export function getAppRoot() {
  return APP_ROOT;
}
export var RIVAL_IQ_NETWORK_OPTIONS = ['all', ACCOUNT_TYPES.facebook, ACCOUNT_TYPES.instagram, ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.youtube];
export var RIVAL_IQ_TIME_PERIODS = ['thisweek', 'thismonth', 'last30days', 'last90days'];
export function getRivalIqNetworks() {
  return RIVAL_IQ_NETWORK_OPTIONS.map(function (n) {
    return {
      value: n,
      text: I18n.text("sui.accountConstants." + n + ".displayName")
    };
  });
}
export function getRivalIqTimePeriods() {
  return RIVAL_IQ_TIME_PERIODS.map(function (t) {
    return {
      value: t,
      text: I18n.text("sui.competitors.timePeriod." + t)
    };
  });
}
export var RIVAL_IQ_URL = 'https://www.rivaliq.com';
export function getRivalIqUrl() {
  var subPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return "competitors/" + subPath;
}
export var NAV_ITEMS = [{
  id: APP_SECTIONS.publishing,
  route: 'publishing',
  notGate: MANAGE_BETA_GATE
}, {
  id: APP_SECTIONS.manage,
  route: 'manage',
  gate: MANAGE_BETA_GATE
}, {
  id: APP_SECTIONS.monitoring,
  route: 'inbox'
}, {
  id: APP_SECTIONS.analyze,
  route: 'analyze'
}];
export var REPORTS_OVERVIEW_URL = "/" + getAppRoot() + "/" + PortalIdParser.get() + "/analyze";
export var TWITTER_BASE_URL = 'https://twitter.com';
export var FACEBOOK_BASE_URL = 'https://www.facebook.com';
export var INSTAGRAM_BASE_URL = 'https://www.instagram.com';
export var FACEBOOK_GRAPH_API_BASE_URL = 'https://graph.facebook.com/';
export var LINKEDIN_BASE_URL = 'https://www.linkedin.com';
export var LINKEDIN_MESSAGE_BASE_URL = LINKEDIN_BASE_URL + "/feed/update/urn:li:activity:";
export var FACEBOOK_MENTION_PATTERN = /\{\{faceboo[k\u212A]_mention\(([0-9]*?)\|((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])*?)\)\}\}/gi;
export var LINKEDIN_MENTION_PATTERN = /\{\{lin[k\u212A]edin_mention\(urn:li:organization:([0-:]+?)\|((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+?)\)\}\}/gi;
export var LINKEDIN_MENTION_WITHOUT_URN_PATTERN = /\{\{lin[k\u212A]edin_mention\(([0-:]+?)\|((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+?)\)\}\}/gi;
export var LINKEDIN_URN_PREFIX = 'urn:li:organization:';
export var INSTAGRAM_MENTION_PATTERN = /(^|\B)@(?![0-9_]+\b)([a-zA-Z0-9_.]{1,30})(\b|\r)/g;
export var TWITTER_STATUS_PATTERN = /https:\/\/twitter.com\/\w+\/status\/\w+/;
export var LANDSCAPE_SETTING = 'Social:RivalIQLandscape';
export var SCOPES = {
  social: 'social-access',
  corporate: 'social-corporate-access',
  blogPostRead: 'blog-post-read',
  landingPagesAccess: 'landingpages-access',
  campaignsAccess: 'campaigns-access',
  campaignsWrite: 'campaigns-write',
  fileManagerWrite: 'file-manager-write',
  socialMonitoringCompanies: 'social-monitoring-companies-read',
  socialMonitoringFeatures: 'social-monitoring-features',
  socialOwnedAccountsPublish: 'social-owned-accounts-publish',
  socialSharedAccountsDraft: 'social-shared-accounts-draft',
  socialSharedAccountsPublish: 'social-shared-accounts-publish',
  socialSharedAccountsConfigure: 'social-shared-accounts-configure',
  socialAllAccountsRead: 'social-all-accounts-read',
  socialAllAccountsPublish: 'social-all-accounts-publish',
  socialAllAccountsConfigure: 'social-all-accounts-configure',
  socialAccountsConnect: 'social-accounts-connect',
  socialShareAccounts: 'social-share-accounts',
  youtubeAccess: 'social-youtube-access',
  socialDraftOnlyUserAccess: 'social-draft-only-user-access',
  adsRead: 'ads-read',
  adsWrite: 'ads-write',
  adsRoiReporting: 'ads-roi-reporting',
  jitaUser: 'jita-user'
};
export var DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
export var FORMAT_TIME_BRIEF = 'ha';
export var FORMAT_TIME_FULL = 'LT';
export var FORMAT_DATE_WITH_TIME = 'll LT';
export var FORMAT_DAY_WITH_TIME = 'dddd LT';
export var FORMAT_DAY_NAME_FULL = 'dddd';
export var FORMAT_DAY_NAME = 'ddd';
export var FORMAT_MONTH_CODE = 'YYYY-MM';
export var FORMAT_MM_DD_YYYY = 'll';
export var FORMAT_MM_DD_YYYY_TIME = 'lll';
export var INITIAL_REQUESTS = {
  accountsFetch: null,
  channelsFetch: null,
  channelsV2Fetch: null,
  channelsAndAccountsFetch: null,
  accountsWithChannelsFetch: null,
  activateNewAccountChannels: null,
  channelSave: null,
  usersFetch: null,
  broadcastFetch: null,
  broadcastsFetch: null,
  broadcastInteractionsFetch: null,
  broadcastClone: null,
  broadcastDelete: null,
  broadcastsExport: null,
  broadcastGroupCreate: null,
  broadcastGroupSave: null,
  broadcastGroupBulkSave: null,
  followMeLinksFetch: null,
  followMeLinksDelete: null,
  followMeLinksCreate: null,
  feedFetch: null,
  feedItemReply: null,
  streamFetch: null,
  streamPreviewFetch: null,
  landscapeFetch: null,
  landscapeFetchSocialPosts: null,
  channelsV2ForAccountFetch: null,
  reportingPostsFetch: null,
  broadcastPostsFetch: null,
  postsFetch: null
};
export var REQUEST_STATUS = {
  loading: 100,
  success: 200
};
export var CONNECT_STEPS = keyMirror({
  selectNetwork: null,
  auth: null,
  saving: null,
  selectChannels: null,
  success: null,
  error: null,
  publishAnywhere: null
});
export var ACCOUNT_CONNECT_FAILURE_REASONS = keyMirror({
  // refused to login or accept permissions
  refused: null,
  // not positive this can occur for networks other than gplus
  noChannels: null,
  // hard to separate from unknown, initial used for when we see error_description=Internal+Server+Error from linkedin and are confident its sporadic
  networkError: null,
  // connection timed out, ordinarily due to too many Facebook pages or accounts
  timeout: null,
  unknown: null
});
export var YOUTUBE_CONNECT_FAILURE_REASONS = {
  // No YouTube videos were found on this channel
  YOUTUBE_NO_POSTS: 'youtubeNoPosts',
  // The YouTube channel is not a Brand channel
  YOUTUBE_NOT_BRAND_CHANNEL: 'youtubeNotBrandChannel',
  // The account is private or has only private videos
  YOUTUBE_PRIVATE_ACCOUNT: 'youtubePrivateAccount',
  // Some required information about the YouTube account is missing
  YOUTUBE_REQUIRED_METADATA_KEYS_MISSING: 'youtubeRequiredMetadataKeysMissing'
};
export var ACCOUNT_CONNECT_ERROR_CODES = {
  TIMEOUT: ACCOUNT_CONNECT_FAILURE_REASONS.timeout
};
export var SINGLE_CHANNEL_ACCOUNT_TYPES = [ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.youtube];
export var BROADCAST_SERIALIZE_OMIT_PROPS = ['users', 'interactions', 'interactionTotals', 'feed', 'assists', 'channel', 'accountServiceId', 'assists', 'feedHasLoaded', 'serviceId', 'file', 'videoInsights', 'user'];
export var BROADCAST_STATUS_TYPE = keyMirror({
  canceled: null,
  published: null,
  pending: null,
  scheduled: null,
  failed: null,
  draft: null,
  uploaded: null
});
export var BROADCAST_PUBLISH_TYPE = keyMirror({
  now: null,
  schedule: null,
  draft: null,
  comment: null,
  uploaded: null,
  bap: null
});
export var BROADCAST_STATUS = keyMirror({
  DRAFT: null,
  CANCELED: null,
  CREATED: null,
  WAITING: null,
  NEEDSLINKSHRUNK: null,
  RUNNING: null,
  ERROR_RETRY: null,
  ERROR_FATAL: null,
  ERROR_ARCHIVE: null,
  DUPLICATE: null,
  BAD_CHANNEL: null,
  BAD_CREDENTIALS: null,
  UNKNOWN: null,
  SUCCESS: null,
  UPLOADED: null,
  CREATED_BAP: null
});
export var POST_ACTION_TYPES = keyMirror({
  VIEW_DETAILS: null,
  CLONE: null,
  VIEW_ON_NETWORK: null,
  BOOST: null,
  DELETE: null
});
export var BROADCAST_ACTION_TYPES = keyMirror({
  CANCEL: null,
  CLONE: null,
  DELETE: null,
  EDIT: null,
  VIEW_ON_NETWORK: null,
  VIEW_DETAILS: null,
  BOOST: null,
  MAKE_DRAFT: null,
  APPROVE_DRAFT: null // EDIT_CAMPAIGN: null,

});
export var BROADCAST_MEDIA_TYPE = keyMirror({
  NONE: null,
  PHOTO: null,
  CAROUSEL: null,
  ANIMATED_GIF: null,
  VIDEO: null,
  VIDEO_MEDIA: null
});
export var BROADCAST_MEDIA_TYPE_NOT_ALLOWED_FB_POST_TARGET = [BROADCAST_MEDIA_TYPE.VIDEO, BROADCAST_MEDIA_TYPE.VIDEO_MEDIA];
export var POST_TARGET_ERROR = {
  FB_VIDEO_POST: 'fb-video-post'
};
export var POST_TARGET_ERRORS_TO_FEEBACK_MESSAGE = _defineProperty({}, POST_TARGET_ERROR.FB_VIDEO_POST, 'sui.composer.message.postTargeting.errors.fbVideoPost');
export var FM_FILE_TYPES_TO_BROADCAST_MEDIA_TYPE = (_FM_FILE_TYPES_TO_BRO = {}, _defineProperty(_FM_FILE_TYPES_TO_BRO, FM_FILE_TYPES.IMG, BROADCAST_MEDIA_TYPE.PHOTO), _defineProperty(_FM_FILE_TYPES_TO_BRO, FM_FILE_TYPES.MOVIE, BROADCAST_MEDIA_TYPE.VIDEO), _FM_FILE_TYPES_TO_BRO);
export var FM_FILE_SERIALIZE_ALLOW_PROPS = ['description', 'height', 'id', 'mediaType', 'url', 'width'];
export var UPLOADED_BROADCAST_ISSUE_FILTER = keyMirror({
  ALL_POSTS: null,
  ISSUES: null
});
export var SOCIAL_ACCOUNTS_SETTINGS = 'https://knowledge.hubspot.com/social/manage-your-social-account-settings';
export var CONNECT_SOCIAL_NETWORK_TO_HS = 'https://knowledge.hubspot.com/social/connect-your-social-media-accounts-to-hubspot';
export var DISCONNECT_SOCIAL_ACCOUNTS_FROM_HS = 'https://knowledge.hubspot.com/social/disconnect-social-accounts-from-hubspot';
export var FACEBOOK_PERMISSIONS_LEARN_MORE_URL = 'https://knowledge.hubspot.com/social/can-t-connect-social-page-to-hubspot#facebook-page-admin-access';
export var FB_IG_SCOPES_LEARN_MORE_URL = 'https://knowledge.hubspot.com/social/can-t-connect-social-page-to-hubspot#hubspot-integration-permissions';
export var CHANNEL_CONNECTION_STATE = keyMirror({
  connectableChannels: null,
  connectedChannels: null,
  lackPermissionsChannels: null,
  lackScopesChannels: null,
  lackScopesAccount: null
});
export var CONNECTION_ISSUE_LEARN_MORE_URL = (_CONNECTION_ISSUE_LEA = {}, _defineProperty(_CONNECTION_ISSUE_LEA, CHANNEL_CONNECTION_STATE.lackPermissionsChannels, FACEBOOK_PERMISSIONS_LEARN_MORE_URL), _defineProperty(_CONNECTION_ISSUE_LEA, CHANNEL_CONNECTION_STATE.lackScopesChannels, FB_IG_SCOPES_LEARN_MORE_URL), _defineProperty(_CONNECTION_ISSUE_LEA, CHANNEL_CONNECTION_STATE.lackScopesAccount, FB_IG_SCOPES_LEARN_MORE_URL), _CONNECTION_ISSUE_LEA);
export var FACEBOOK_FEED_PUBLISH_SUNSET_DATE = '2018-08-01';
export var BROADCAST_VALIDATION_ERRORS = keyMirror({
  noMessages: null,
  emptyContent: null,
  noChannels: null,
  missingChannel: null,
  unknownApiError: null,
  noTriggerAt: null,
  // should be almost impossible
  inPast: null,
  overCharLimit: null,
  overCharLimitBapTwitter: null,
  overCharLimitNetwork: null,
  overHashtagLimit: null,
  photoRequired: null,
  notifyUserRequired: null,
  invalidExtension: null,
  imageDownloadFailed: null,
  imageDimensionsTooLarge: null,
  linkedinImagePixelsTooMany: null,
  linkedinGifFramesTooMany: null,
  instagramImageAspectRatio: null,
  imageIsAnimatedGif: null,
  imageSizeTooLarge: null,
  imageSizeTooLargeAnimated: null,
  imageDimensionsUnreadable: null,
  missingFileManagerWriteAccess: null,
  videoFormat: null,
  videoCodec: null,
  videoAudioCodec: null,
  videoAudioProfile: null,
  videoSizeTooLarge: null,
  videoSizeTooSmall: null,
  videoTooShort: null,
  videoTooLong: null,
  videoAspectRatio: null,
  videoFrameRate: null,
  videoMinFrameRate: null,
  videoInLinkedInStatusChannel: null,
  videoWidthTooLarge: null,
  videoWidthTooSmall: null,
  videoHeightTooLarge: null,
  videoHeightTooSmall: null,
  badEncoding: null,
  duplicateTwitterContent: null,
  maxScheduledTimeExceeded: null,
  facebokFeedSunset: null,
  mixMultiImageFileTypes: null,
  userCannotPublish: null,
  videoBitrate: null,
  tooManyImages: null
});
export var BROADCAST_SUGGESTIONS = keyMirror({
  imageDimensionsTooSmall: null,
  instagramSquareImage: null,
  instagramDimensionsTooSmall: null,
  hubspotShortlink: null
}); // many of these are from: https://git.hubteam.com/HubSpot/Broadcast/blob/master/BroadcastData/src/main/java/com/hubspot/broadcast/bulk/UploadedBroadcastIssue.java

export var BROADCAST_TABLE_ERRORS = keyMirror({
  DATETIME_PASSED: null,
  EXPIRED: null,
  INVALID_PHOTO_TOO_MANY_IMAGES: null,
  INVALID_PHOTO_URL: null,
  LINK_PREVIEW_ERROR: null,
  MISSING_DATE: null,
  MISSING_PHOTO_INSTAGRAM: null,
  MUTUAL_CONFLICT: null
});
export var BROADCAST_STATE_TO_VERB_KEY = (_BROADCAST_STATE_TO_V = {}, _defineProperty(_BROADCAST_STATE_TO_V, BROADCAST_STATUS_TYPE.canceled, 'sui.details.canceledAt.label'), _defineProperty(_BROADCAST_STATE_TO_V, BROADCAST_STATUS_TYPE.published, 'sui.details.publishedAt.label'), _defineProperty(_BROADCAST_STATE_TO_V, BROADCAST_STATUS_TYPE.pending, 'sui.details.scheduledFor.label'), _defineProperty(_BROADCAST_STATE_TO_V, BROADCAST_STATUS_TYPE.scheduled, 'sui.details.scheduledFor.label'), _defineProperty(_BROADCAST_STATE_TO_V, BROADCAST_STATUS_TYPE.draft, 'sui.details.scheduledFor.label'), _defineProperty(_BROADCAST_STATE_TO_V, BROADCAST_STATUS_TYPE.failed, 'sui.details.failedAt.label'), _defineProperty(_BROADCAST_STATE_TO_V, BROADCAST_STATUS_TYPE.uploaded, 'sui.details.scheduledFor.label'), _BROADCAST_STATE_TO_V);
export var BROADCAST_STATUS_TYPE_TO_DATE_ATTRIBUTE = (_BROADCAST_STATUS_TYP = {}, _defineProperty(_BROADCAST_STATUS_TYP, BROADCAST_STATUS_TYPE.published, 'finishedAt'), _defineProperty(_BROADCAST_STATUS_TYP, BROADCAST_STATUS_TYPE.scheduled, 'triggerAt'), _defineProperty(_BROADCAST_STATUS_TYP, BROADCAST_STATUS_TYPE.failed, 'triggerAt'), _defineProperty(_BROADCAST_STATUS_TYP, BROADCAST_STATUS_TYPE.draft, 'userUpdatedAt'), _defineProperty(_BROADCAST_STATUS_TYP, BROADCAST_STATUS_TYPE.uploaded, 'uploadedRow'), _defineProperty(_BROADCAST_STATUS_TYP, BROADCAST_STATUS_TYPE.pending, 'triggerAt'), _BROADCAST_STATUS_TYP);
export var BROADCAST_STATUS_TYPE_TO_SORT_ORDER = (_BROADCAST_STATUS_TYP2 = {}, _defineProperty(_BROADCAST_STATUS_TYP2, BROADCAST_STATUS_TYPE.published, 'desc'), _defineProperty(_BROADCAST_STATUS_TYP2, BROADCAST_STATUS_TYPE.scheduled, 'asc'), _defineProperty(_BROADCAST_STATUS_TYP2, BROADCAST_STATUS_TYPE.failed, 'desc'), _defineProperty(_BROADCAST_STATUS_TYP2, BROADCAST_STATUS_TYPE.draft, 'desc'), _defineProperty(_BROADCAST_STATUS_TYP2, BROADCAST_STATUS_TYPE.uploaded, 'asc'), _defineProperty(_BROADCAST_STATUS_TYP2, BROADCAST_STATUS_TYPE.pending, 'desc'), _BROADCAST_STATUS_TYP2);
export var QUOTED_STATUS_ATTRS = ['quotedStatusUrl', 'quotedStatusId', 'quotedStatusName', 'quotedStatusScreenName', 'quotedStatusAvatarUrl', 'quotedStatusCreatedAt', 'quotedStatusPhotoUrl', 'quotedStatusText'];
export var CAMPAIGN_EDIT_MODES = keyMirror({
  add: null,
  edit: null
});
export var INTERACTION_TYPES = keyMirror({
  LINK_CLICKED: null,
  TWITTER_REPLY: null,
  TWITTER_RETWEET: null,
  TWITTER_FAVORITE: null,
  TWITTER_MENTION: null,
  FACEBOOK_LIKE: null,
  FACEBOOK_COMMENT: null,
  FACEBOOK_SHARE: null,
  FACEBOOK_REACT_LIKE: null,
  FACEBOOK_REACT_HAHA: null,
  FACEBOOK_REACT_LOVE: null,
  FACEBOOK_REACT_SAD: null,
  FACEBOOK_REACT_WOW: null,
  FACEBOOK_REACT_ANGRY: null,
  INSTAGRAM_COMMENT: null,
  LINKEDIN_COMMENT: null,
  LINKEDIN_LIKE: null
});
export var FEED_INTERACTION_TYPES = keyMirror({
  ALL: null,
  CONVERSATIONS: null,
  INTERACTIONS: null,
  FOLLOWERS: null
});
export var FEED_ARCHIVE_STATUS = keyMirror({
  UNARCHIVED: null,
  ARCHIVED: null,
  ALL: null
});
export var FEED_ITEM_SUBJECT_TYPES = keyMirror({
  TWITTER_REPLY: null,
  TWITTER_MENTION: null,
  TWITTER_SELF_MENTION: null,
  TWITTER_RETWEET: null,
  LINKEDIN_COMMENT: null,
  LINKEDIN_LIKE: null,
  FACEBOOK_COMMENT: null,
  FACEBOOK_LIKE: null,
  INSTAGRAM_LIKE: null,
  INSTAGRAM_COMMENT: null
}); // we only return this many in the listing endpoint

export var WHO_TRUNCATE_LIMIT = 5;
export var INLINE_REPLY_ACCOUNT_TYPES = [ACCOUNT_TYPES.twitter];
export var TOP_LEVEL_REPLY_NETWORKS = [ACCOUNT_TYPES.facebook, ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.linkedin];
export var INLINE_MESSAGE_MODES = keyMirror({
  quote: null,
  mention: null,
  reply: null
});
export var FAVORITABLE_ACCOUNT_TYPES = [ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.facebook // ACCOUNT_TYPES.linkedin -500ing for me, and old UI doesn't seem to allow
];
export var LIVE_FETCH_NETWORKS = [ACCOUNT_TYPES.facebook, ACCOUNT_TYPES.linkedin];
export var NETWORKS_ALLOWING_EMPTY_BODY_WITH_VIDEO_FILE = [ACCOUNT_TYPES.twitter];
export var INTERACTION_CATEGORIES = keyMirror({
  click: null,
  like: null,
  favorite: null,
  comment: null,
  retweet: null,
  share: null,
  reaction: null
});
export var DRILLDOWN_KEY_TO_FEED_INTERACTION_TYPE = {
  retweet: FEED_INTERACTION_TYPES.INTERACTIONS,
  comment: FEED_INTERACTION_TYPES.CONVERSATIONS,
  reply: FEED_INTERACTION_TYPES.CONVERSATIONS,
  like: FEED_INTERACTION_TYPES.INTERACTIONS,
  reaction: FEED_INTERACTION_TYPES.INTERACTIONS
}; // boil down equivalent interactions on different networks

export var INTERACTION_TYPE_TO_CATEGORY = {
  LINK_CLICKED: INTERACTION_CATEGORIES.click,
  TWITTER_COMMENT: INTERACTION_CATEGORIES.comment,
  TWITTER_REPLY: INTERACTION_CATEGORIES.comment,
  TWITTER_RETWEET: INTERACTION_CATEGORIES.retweet,
  TWITTER_FAVORITE: INTERACTION_CATEGORIES.favorite,
  FACEBOOK_LIKE: INTERACTION_CATEGORIES.like,
  FACEBOOK_REACT_LIKE: INTERACTION_CATEGORIES.like,
  FACEBOOK_REACT_LOVE: INTERACTION_CATEGORIES.reaction,
  FACEBOOK_REACT_HAHA: INTERACTION_CATEGORIES.reaction,
  FACEBOOK_REACT_WOW: INTERACTION_CATEGORIES.reaction,
  FACEBOOK_REACT_SAD: INTERACTION_CATEGORIES.reaction,
  FACEBOOK_REACT_ANGRY: INTERACTION_CATEGORIES.reaction,
  FACEBOOK_REACT_OTHER: INTERACTION_CATEGORIES.reaction,
  FACEBOOK_COMMENT: INTERACTION_CATEGORIES.comment,
  FACEBOOK_SHARE: INTERACTION_CATEGORIES.share,
  INSTAGRAM_COMMENT: INTERACTION_CATEGORIES.comment,
  LINKEDIN_COMMENT: INTERACTION_CATEGORIES.comment,
  LINKEDIN_LIKE: INTERACTION_CATEGORIES.like
}; // These mostly map to post.stats keys (interactions being the exception).

export var POST_STAT_TYPES = keyMirror({
  clicks: null,
  clicksNetwork: null,
  comments: null,
  dislikes: null,
  impressions: null,
  impressionsPaid: null,
  interactions: null,
  likes: null,
  reactions: null,
  reactionsByType: null,
  replies: null,
  saves: null,
  shares: null,
  videoAverageViewDurationSeconds: null,
  videoAverageViewPercentage: null,
  videoMinutesWatched: null,
  videoViews: null,
  videoViewsPaid: null
});
export var DEFAULT_TOP_POSTS_FILTER_BY = 'interactionsTotal';
export var REACTION_TYPE_TO_COUNT_KEY = ImmutableMap({
  angries: 'angry',
  hahas: 'haha',
  likes: 'like',
  loves: 'love',
  sads: 'sad',
  // thankfuls: 'thankful',
  wows: 'wow'
});
export var REACTION_TYPE_TO_INTERACTION_TYPE = ImmutableMap({
  angries: 'FACEBOOK_REACT_ANGRY',
  hahas: 'FACEBOOK_REACT_HAHA',
  likes: 'FACEBOOK_REACT_LIKE',
  loves: 'FACEBOOK_REACT_LOVE',
  sads: 'FACEBOOK_REACT_SAD',
  // thankfuls: 'FACEBOOK_REACT_THANKFUL',
  wows: 'FACEBOOK_REACT_WOW'
});
export var FEED_ACTION_TYPES = keyMirror({
  FAVORITE: null,
  UNFAVORITE: null,
  RETWEET: null,
  UNRETWEET: null,
  REPLY: null,
  SHARED: null,
  NEW_MESSAGE: null,
  NEW_BROADCAST: null,
  MATCH_STREAM_RETWEET: null
});
export var SHOW_RECENT_STREAM_COUNT = 5;
export var STREAM_TYPES = keyMirror({
  // can be created & edited by users
  TWITTER_SEARCH: null,
  TWITTER_LIST: null,
  TWITTER_CONTACT_LIST: null,
  // internal
  TWITTER_TIMELINE: null,
  TWITTER_USER_TIMELINE: null,
  // internal and results create interactions
  TWITTER_MENTIONS: null,
  TWITTER_RETWEETS: null
});
export var BLACKLISTED_STREAM_TYPES = [STREAM_TYPES.TWITTER_TIMELINE, STREAM_TYPES.TWITTER_USER_TIMELINE];
export var STREAM_MAX_QUERY_LENGTH = 400;
export var STREAM_MAX_TERMS = 10; // the other STREAM_TYPES are internally created, and can only have their name and notification settings edited

export var EDITABLE_STREAM_TYPES = [STREAM_TYPES.TWITTER_SEARCH, STREAM_TYPES.TWITTER_LIST, STREAM_TYPES.TWITTER_CONTACT_LIST]; // the other STREAM_TYPES are internally created and also used to create interactions

export var DELETEABLE_STREAM_TYPES = EDITABLE_STREAM_TYPES.concat([STREAM_TYPES.TWITTER_TIMELINE, STREAM_TYPES.TWITTER_USER_TIMELINE]);
export var STREAM_INVALID_REASONS = keyMirror({
  missingName: null,
  missingQuery: null,
  missingTwitterList: null,
  missingContactList: null,
  missingUserToNotify: null,
  queryAnyTooLong: null,
  queryAnyTooComplex: null,
  queryAnyTooComplexIgnoreRetweets: null,
  cannotPreviewContactList: null,
  missingTwitterUser: null
});
export var STREAM_ITEM_PAGE_SIZE = 25;
export var STREAM_LANGUAGES = ['en', 'ar', 'es', 'de', 'ja', 'fr', 'it', 'ko', 'zh', 'el', 'ga', 'nl', 'fi', 'hi', 'id', 'pt', 'ru', 'eu', 'bg'].sort();
export var MEDIA_TYPE = keyMirror({
  photo: null,
  video: null,
  animated_gif: null
});
export var MEDIA_PROVIDER = keyMirror({
  instagram: null,
  youtube: null,
  vimeo: null
});
export var NOTIFICATION_OPTION_TIME_DISPLAY = {
  MORNING: function MORNING() {
    return I18n.moment().hour(8).format(FORMAT_TIME_BRIEF);
  },
  MORNING_AFTERNOON: function MORNING_AFTERNOON() {
    return I18n.moment().hour(8).format(FORMAT_TIME_BRIEF) + " & " + I18n.moment().hour(16).format(FORMAT_TIME_BRIEF);
  },
  WEEKLY: function WEEKLY() {
    return I18n.moment().day(1).hour(8).format(FORMAT_DAY_WITH_TIME);
  }
};
var HUBSPOT_WEB_CLIENT_TAGS = ['GettingStarted', 'inbox-empty', 'MonitoringShare'];
export var CLIENT_TAGS = keyMirror({
  'calendar-v2': null,
  'calendar-v2-clone': null,
  SocialUI_composer: null,
  SocialUI_clone: null
});
export var MAX_SCHEDULE_AHEAD_MONTHS = 24;
export function getClientTagDisplayName(clientTag) {
  if (!clientTag) {
    return null;
  }

  if (clientTag.startsWith('SocialUI') || clientTag.startsWith('Social') || HUBSPOT_WEB_CLIENT_TAGS.includes(clientTag)) {
    return I18n.text('sui.clientTags.hubspotWeb');
  }

  if (clientTag.startsWith('app')) {
    clientTag = clientTag.replace(':', '');

    if (!I18n.lookup("sui.clientTags." + clientTag)) {
      clientTag = 'appOther';
    }
  }

  return I18n.lookup("sui.clientTags." + clientTag) ? I18n.text("sui.clientTags." + clientTag) : null;
}
export var AD_CAMPAIGN_STATUSES = keyMirror({
  ENABLED: null,
  PAUSED: null,
  REMOVED: null
});
export var CAMPAIGN_STATUS_TO_STATUS_TAG = {
  ENABLED: 'active',
  PAUSED: 'warning',
  DELETED: 'disabled',
  ARCHIVED: 'disabled'
};
export var ACCOUNT_THRESHOLD_LIMIT_APPROACH = 0.8;
export var UI_POPOVER_WIDTH = 400;
export var LOADING_INCREMENT_PERCENTAGE = 0.15;
export var LOADING_INCREMENT_INTERVAL_MS = 250;
export var TWITTER_PUBLISH_ANYWHERE_OPTIONS = {
  ENABLED: 'ENABLED',
  DISABLED: 'DISABLED'
};
export var ADS_BOOSTING_POST_SOURCE = 'ads-create-flow';
export var DISPLAY_CONTEXT = keyMirror({
  publishingTable: null,
  detailsPanel: null
});
export var NETWORKS_AVAILABLE_FOR_POST_TARGETING = [ACCOUNT_TYPES.facebook // ACCOUNT_TYPES.linkedin,
];
export var POST_TARGETING_MAX_TARGETS = 5;
export var FAVORITE_CHANNELS_LIMIT = 60;
export var ZERO_STATE_TYPE = {
  overview: 'overview',
  youtube: 'youtube'
};
export var ZERO_STATE_MODES = {
  noAccounts: 'noAccounts',
  noData: 'noData',
  noSelectedChannels: 'noSelectedChannels'
};
export var DAYS_DATA_REMAINS_AFTER_DISCONNECT_ACCOUNT = 7;
export var NETWORKS_SUPPORTING_LINK_PREVIEW_PHOTO_CONVERSION = [ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.linkedin, ACCOUNT_TYPES.facebook];
export var NETWORKS_AVAILABLE_FOR_PREVIEW = [ACCOUNT_TYPES.facebook, ACCOUNT_TYPES.twitter, ACCOUNT_TYPES.linkedin, ACCOUNT_TYPES.instagram];
export var NETWORK_PREVIEW_KBDOCS_URL = (_NETWORK_PREVIEW_KBDO = {}, _defineProperty(_NETWORK_PREVIEW_KBDO, ACCOUNT_TYPES.facebook, 'https://knowledge.hubspot.com/social/preview-your-social-posts-before-publishing'), _defineProperty(_NETWORK_PREVIEW_KBDO, ACCOUNT_TYPES.twitter, 'https://knowledge.hubspot.com/social/preview-your-social-posts-before-publishing'), _defineProperty(_NETWORK_PREVIEW_KBDO, ACCOUNT_TYPES.linkedin, 'https://knowledge.hubspot.com/social/preview-your-social-posts-before-publishing'), _defineProperty(_NETWORK_PREVIEW_KBDO, ACCOUNT_TYPES.instagram, 'https://knowledge.hubspot.com/social/preview-your-social-posts-before-publishing'), _NETWORK_PREVIEW_KBDO);
export var COMPOSER_MESSAGE_LIMIT = 50;
export var ACTIONS_TO_LABEL = (_ACTIONS_TO_LABEL = {}, _defineProperty(_ACTIONS_TO_LABEL, BROADCAST_ACTION_TYPES.BOOST, 'sui.broadcasts.actionsDropDown.createAd'), _defineProperty(_ACTIONS_TO_LABEL, BROADCAST_ACTION_TYPES.VIEW_ON_NETWORK, 'sui.broadcasts.actionsDropDown.viewOnNetwork'), _defineProperty(_ACTIONS_TO_LABEL, BROADCAST_ACTION_TYPES.EDIT_CAMPAIGN, 'sui.broadcasts.actionsDropDown.editCampaign'), _defineProperty(_ACTIONS_TO_LABEL, BROADCAST_ACTION_TYPES.ASSIGN_USERS_AND_TEAMS, 'sui.broadcasts.actionsDropDown.assignUsersAndTeams'), _defineProperty(_ACTIONS_TO_LABEL, BROADCAST_ACTION_TYPES.DELETE, 'sui.broadcasts.actionsDropDown.delete'), _defineProperty(_ACTIONS_TO_LABEL, BROADCAST_ACTION_TYPES.VIEW_DETAILS, 'sui.broadcasts.actionsDropDown.details'), _defineProperty(_ACTIONS_TO_LABEL, BROADCAST_ACTION_TYPES.EDIT, 'sui.broadcasts.actionsDropDown.edit'), _defineProperty(_ACTIONS_TO_LABEL, BROADCAST_ACTION_TYPES.CLONE, 'sui.broadcasts.actionsDropDown.clone'), _defineProperty(_ACTIONS_TO_LABEL, BROADCAST_ACTION_TYPES.MAKE_DRAFT, 'sui.broadcasts.actionsDropDown.makeDraft'), _defineProperty(_ACTIONS_TO_LABEL, BROADCAST_ACTION_TYPES.APPROVE_DRAFT, 'sui.broadcasts.actionsDropDown.approveDraft'), _ACTIONS_TO_LABEL);
export var ACTIONS_BY_NETWORK = (_ACTIONS_BY_NETWORK = {}, _defineProperty(_ACTIONS_BY_NETWORK, ACCOUNT_TYPES.facebook, [BROADCAST_ACTION_TYPES.BOOST, BROADCAST_ACTION_TYPES.VIEW_ON_NETWORK, // BROADCAST_ACTION_TYPES.EDIT_CAMPAIGN,
BROADCAST_ACTION_TYPES.MAKE_DRAFT, BROADCAST_ACTION_TYPES.DELETE]), _defineProperty(_ACTIONS_BY_NETWORK, ACCOUNT_TYPES.instagram, [BROADCAST_ACTION_TYPES.VIEW_ON_NETWORK, // BROADCAST_ACTION_TYPES.EDIT_CAMPAIGN,
BROADCAST_ACTION_TYPES.MAKE_DRAFT, BROADCAST_ACTION_TYPES.DELETE]), _defineProperty(_ACTIONS_BY_NETWORK, ACCOUNT_TYPES.linkedin, [BROADCAST_ACTION_TYPES.VIEW_ON_NETWORK, // BROADCAST_ACTION_TYPES.EDIT_CAMPAIGN,
BROADCAST_ACTION_TYPES.MAKE_DRAFT, BROADCAST_ACTION_TYPES.DELETE]), _defineProperty(_ACTIONS_BY_NETWORK, ACCOUNT_TYPES.twitter, [BROADCAST_ACTION_TYPES.VIEW_ON_NETWORK, // BROADCAST_ACTION_TYPES.EDIT_CAMPAIGN,
BROADCAST_ACTION_TYPES.MAKE_DRAFT, BROADCAST_ACTION_TYPES.DELETE]), _ACTIONS_BY_NETWORK);
export var DETAILS_SUPPORTED_STATUS_TYPES = [BROADCAST_STATUS_TYPE.published, BROADCAST_STATUS_TYPE.failed, BROADCAST_STATUS_TYPE.pending];
export var EDIT_SUPPORTED_STATUS_TYPES = [BROADCAST_STATUS_TYPE.scheduled, BROADCAST_STATUS_TYPE.draft, BROADCAST_STATUS_TYPE.uploaded];
export var PUBLISHING_TABLE_RESULTS_PER_PAGE = 10;
export var ACTIONS_COMPACT_VIEW_MIN_WIDTH = 1200;
export var MAX_ALLOWED_IMAGES_COMPOSER = 4;
export var MANAGE_DASH_COLUMNS_MAP = {
  PUBLISHED_AT: 'publishedAt',
  CLICK: 'clicks',
  INTERACTIONS: 'interactionsTotal',
  SHARES: 'shares',
  IMPRESSIONS: 'impressions',
  CREATED_BY: 'createdBy',
  CAMPAIGN_NAME: 'campaignName',
  CLICKS_NETWORK: 'clicksNetwork',
  MEDIA_TYPE: 'mediaType',
  VIDEO_VIEWS: 'videoViews',
  BROADCAST_GUID: 'broadcastGuid'
};
export var BROADCAST_STATUS_TYPE_TO_STATUS_TAG_PROPS = (_BROADCAST_STATUS_TYP3 = {}, _defineProperty(_BROADCAST_STATUS_TYP3, BROADCAST_STATUS_TYPE.draft, {
  use: 'draft'
}), _defineProperty(_BROADCAST_STATUS_TYP3, BROADCAST_STATUS_TYPE.canceled, {
  use: 'cancelled'
}), _defineProperty(_BROADCAST_STATUS_TYP3, BROADCAST_STATUS_TYPE.failed, {
  use: 'cancelled'
}), _defineProperty(_BROADCAST_STATUS_TYP3, BROADCAST_STATUS_TYPE.pending, {
  hollow: true,
  use: 'published'
}), _defineProperty(_BROADCAST_STATUS_TYP3, BROADCAST_STATUS_TYPE.published, {
  use: 'published'
}), _defineProperty(_BROADCAST_STATUS_TYP3, BROADCAST_STATUS_TYPE.scheduled, {
  use: 'scheduled'
}), _defineProperty(_BROADCAST_STATUS_TYP3, BROADCAST_STATUS_TYPE.uploaded, {
  color: COLORS.CHART_DARK_PURPLE,
  // Special color requested by design,
  use: 'info' // Color takes priority over use

}), _BROADCAST_STATUS_TYP3);
export var HIDE_MANAGE_BETA_TAG_PORTAL_IDS = ImmutableSet([// This portal is being used for HubSpot Academy, and we want the content
// shown in the academy not to have the "Beta" tag when Manage Dash v2
// eventually comes out of beta
3811406]);