'use es6';

import { Set as ImmutableSet } from 'immutable';
import keyMirror from 'react-utils/keyMirror';
import Raven from 'Raven';
import { BROADCAST_STATUS, ACCOUNT_TYPES, getNetworkFromChannelKey } from './constants'; // helps formulate the last sentence, eg what to do next

export var BROADCAST_PUBLISH_RESOLUTIONS = keyMirror({
  tomorrow: null,
  // rate limit type errors should not retry immediately
  retrying: null,
  clone: null,
  thenClone: null,
  // error has prompted to do something else, so we say "then clone..."
  alreadyCloned: null,
  instagram: null,
  unshorten: null
});
/*
 * Maps back-end errors codes and messages to customer-facing messages
 * ORDER MATTERS HERE. Prefer more precise apiErrorSubcode first (except for some like ERROR_ARCHIVE that don't care about the code)
 *
 * Back-end Error Codes: https://git.hubteam.com/HubSpot/Broadcast/blob/master/BroadcastBase/src/main/java/com/hubspot/broadcast/broadcast/ErrorCode.java
 * Back-end Error Subcodes: https://git.hubteam.com/HubSpot/Broadcast/blob/master/BroadcastBase/src/main/java/com/hubspot/broadcast/broadcast/ErrorSubcode.java
 */

export var BROADCAST_PUBLISH_ERRORS = {
  default: {
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.clone
  },
  // error codes that I couldn't come up with a useful message for or don't know exactly what they mean
  genericFailure: {
    apiErrorSubcodes: [-1, 0, 7, 8, 9, 10, 11, 12, 13, 14, 21, 22]
  },
  // status based lookups that should take precedence over subcodes
  missingChannel: {
    apiErrorSubcode: 3,
    conditions: [{
      pattern: /Unable to select a preferred channel/
    }, {
      status: BROADCAST_STATUS.BAD_CHANNEL
    }],
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.thenClone
  },
  deleted: {
    status: BROADCAST_STATUS.ERROR_ARCHIVE
  },
  pending: {
    // https://local.hubspotqa.com/social-beta/99258317/publishing/view/4186159
    status: BROADCAST_STATUS.RUNNING
  },
  missingResource: {
    apiErrorSubcode: 1
  },
  malformedResource: {
    apiErrorSubcode: 2
  },
  featuredGated: {
    apiErrorSubcode: 4
  },
  conflict: {
    apiErrorSubcode: 5
  },
  invalidPortal: {
    apiErrorSubcode: 6
  },
  publishingLimitReached: {
    apiErrorSubcode: 15
  },
  unpermittedChannelType: {
    apiErrorSubcode: 16
  },
  videoStatusCheckingStalled: {
    apiErrorSubcode: 17
  },
  hubslyDecodeError: {
    apiErrorSubcode: 18
  },
  accountTokenIssues: {
    apiErrorSubcodes: [19, 20],
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.thenClone
  },
  fileManagerDownloadOrMetadataIssues: {
    apiErrorSubcodes: [23, 24, 25]
  },
  exceededHourlyPublishingLimit: {
    apiErrorSubcode: 26
  },
  fbUnknownError: {
    apiErrorSubcodes: [10000, 10013, // FB_INVALID_PARAMETER (this is a somewhat deprecated subcode)
    10031, // IG_UNKNOWN_ERROR_RESPONSE (FB's unknown response still leads to a successful publish. not sure about IG)
    10042 // FB_UNSUPPORTED_POST_REQUEST (not sure what this means and might mean multiple things)
    ],
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.clone
  },
  fbNetworkUnavailable: {
    // Facebook returns: An unexpected error has occurred. Please retry your request later.
    // However, this can include fatal errors like too many hashtags
    apiErrorSubcode: 10001
  },
  fbApiTooManyCalls: {
    apiErrorSubcode: 10002
  },
  fbUserRateLimit: {
    apiErrorSubcode: 10003,
    pattern: /User request limit reached|code 17/ // https://developers.facebook.com/docs/graph-api/advanced/rate-limiting

  },
  fbActionRateLimit: {
    // on the back-end this is an application rate limit (at least that's what the var is named)
    apiErrorSubcode: 10004
  },
  fbPolicyViolation: {
    // this should only include temporary blocks since summer 2019
    apiErrorSubcode: 10005
  },
  fbRetryVideo: {
    apiErrorSubcode: 10006
  },
  fbRetryVideoFile: {
    apiErrorSubcode: 10007
  },
  fbRetryVideoUpload: {
    apiErrorSubcode: 10008
  },
  fbPageRateLimit: {
    // https://app.hubspot.com/social-beta/2533471/publishing/view/64603800
    apiErrorSubcode: 10009
  },
  fbAssortedPermissionErrors: {
    apiErrorSubcodes: [10010, 10011, 10012, 10023, 10035, 10051]
  },
  fbCorruptVideo: {
    apiErrorSubcode: 10014
  },
  fbVideoFetch: {
    apiErrorSubcode: 10015
  },
  fbUnsupportedFormat: {
    apiErrorSubcode: 10016
  },
  fbReduceAmountOfData: {
    apiErrorSubcode: 10017,
    pattern: /Please reduce the amount of data/
  },
  fbIgNetworkError: {
    apiErrorSubcode: 10018
  },
  fbDuplicateTwitter: {
    // don't think this one even happens anymore
    apiErrorSubcode: 10019
  },
  fbUrlParseError: {
    apiErrorSubcode: 10020
  },
  fbCustomLevelThrottling: {
    apiErrorSubcode: 10021
  },
  fbObjectMissingOrUnsupported: {
    apiErrorSubcode: 10022
  },
  instagramPostedBeforeBusinessAccountConversion: {
    network: ACCOUNT_TYPES.instagram,
    apiErrorSubcode: 10024
  },
  instagramVideoRetryErrors: {
    network: ACCOUNT_TYPES.instagram,
    apiErrorSubcodes: [10025, 10026, 10027]
  },
  instagramVideoUnsupportedFormat: {
    network: ACCOUNT_TYPES.instagram,
    apiErrorSubcode: 10028
  },
  instagramUserRestricted: {
    network: ACCOUNT_TYPES.instagram,
    apiErrorSubcode: 10058
  },
  instagramUserLimited: {
    network: ACCOUNT_TYPES.instagram,
    apiErrorSubcode: 10059
  },
  instagramPlatformError: {
    network: ACCOUNT_TYPES.instagram,
    apiErrorSubcode: 10029
  },
  fbUnknownResponse: {
    apiErrorSubcode: 10030
  },
  fbVideoStatusFail: {
    apiErrorSubcode: 10032
  },
  fbImageUnsupportedFormat: {
    apiErrorSubcode: 10033
  },
  instagramNotABusinessAccount: {
    network: ACCOUNT_TYPES.instagram,
    apiErrorSubcode: 10034
  },
  instagramMediaNotFound: {
    network: ACCOUNT_TYPES.instagram,
    apiErrorSubcode: 10036
  },
  fbMissingMessageAttachment: {
    apiErrorSubcode: 10037
  },
  fbAgainstCommunityStandards: {
    apiErrorSubcode: 10038
  },
  fbDuplicate: {
    apiErrorSubcode: 10039
  },
  fbPageForTokenDeleted: {
    apiErrorSubcode: 10040
  },
  igMediaTimeout: {
    apiErrorSubcode: 10041
  },
  fbSessionInvalidatedPasswordChangedOrSecurity: {
    apiErrorSubcode: 10043
  },
  fbImageTooBigOrWrongFormat: {
    apiErrorSubcode: 10044
  },
  fbOtherPeopleReportedAsAbusive: {
    apiErrorSubcode: 10045
  },
  fbBlockingLoggedInCheckpoint: {
    apiErrorSubcode: 10046,
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.thenClone
  },
  fbInvalidUrlBlocked: {
    apiErrorSubcode: 10047
  },
  fbIgNotAConfirmedUser: {
    apiErrorSubcode: 10048
  },
  igUnableToDownloadImage: {
    apiErrorSubcode: 10049
  },
  fbCouldNotSharePostMaybeDeleted: {
    apiErrorSubcode: 10050
  },
  fbAspectRatioNotSupported: {
    apiErrorSubcode: 10052
  },
  fbAccountTemporarilyUnavailableLogin: {
    apiErrorSubcode: 10053
  },
  fbTroubleWithProvidedUrlTryAgain: {
    apiErrorSubcode: 10054
  },
  igPermalinkFetchFailedAfterRetries: {
    apiErrorSubcode: 10055
  },
  igErrorAccessingMediaStatus: {
    apiErrorSubcode: 10056
  },
  fbPhotosAlreadyPosted: {
    apiErrorSubcode: 10057
  },
  bitlyError: {
    apiErrorSubcode: 20000
  },
  bitlyUnableToUnroll: {
    // https://app.hubspot.com/social/2938061/publishing/view/72359244
    // https://app.hubspot.com/social/4433425/publishing/view/71835532
    apiErrorSubcode: 20001,
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.unshorten
  },
  bitlyAccountDeactivated: {
    apiErrorSubcode: 20002,
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.thenClone
  },
  bitlySuspended: {
    apiErrorSubcode: 20003
  },
  bitlyInvalidToken: {
    apiErrorSubcode: 20004
  },
  bitlyMonthlyRateLimit: {
    apiErrorSubcode: 20005
  },
  bitlyRateLimit: {
    apiErrorSubcode: 20006,
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.tomorrow
  },
  bitlyAlreadyShortened: {
    apiErrorSubcode: 20007,
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.unshorten
  },
  bitlyInvalidLink: {
    apiErrorSubcode: 20008
  },
  bitlyTemporarilyUnavailable: {
    apiErrorSubcode: 20009
  },
  bitlyUnknownResponse: {
    apiErrorSubcode: 20010
  },
  linkedinUnknownError: {
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcodes: [30001, // LI_FAILED_ACTIVITY_DROPPED_WHILE_FETCHING_URNS
    30003, // LI_FAILED_CREATING_ACTIVITY_EVENT
    30004, // LI_FAILED_CREATING_ACTIVITY_V2
    30005, // LI_FAILED_CREATING_UGC
    30007, // LI_FAILED_GETTING_ACTIVITY_V2
    30008, // LI_FAILED_GETTING_ORGANIZATION_URN
    30009, // LI_FAILED_GETTING_PUBLISHREQUEST
    30011, // LI_FAILED_GETTING_UGC
    30020 // LI_FAILED_UPDATING_UGC
    ]
  },
  linkedinUnavailable: {
    // https://local.hubspot.com/social-beta/2490540/publishing/view/64611850
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcodes: [30002, // LI_FAILED_BAD_GATEWAY
    30006, // LI_FAILED_GATEWAY_TIMEOUT
    30010, // LI_FAILED_GETTING_SHARE_AUTH
    30012, // LI_FAILED_ORGSHAREAUTH_DIDNT_RESPOND
    30015, // LI_FAILED_READ_TIMEOUT
    30016, // LI_FAILED_REQUEST_TIMEOUT
    30017, // LI_FAILED_SERVICE_UNAVAILABLE
    30019 // LI_FAILED_SERVER_TIMEOUT
    ],
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.clone
  },
  linkedinFailedPhotoUpload: {
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcode: 30013
  },
  linkedinInternalErrorOrIse: {
    // this is frequently returned by images LinkedIn can't handle (or generic Internal Server Errors)
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcode: 30018
  },
  linkedinRateLimit: {
    // https://app.hubspot.com/social/20590/publishing/view/71987650
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcodes: [30021, 30024],
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.tomorrow
  },
  linkedinMarkedAsSpam: {
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcodes: [30000]
  },
  linkedinMemberRestricted: {
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcodes: [30022, 30023, 30025, 30037]
  },
  linkedinTokenExpired: {
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcode: 30026,
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.thenClone
  },
  linkedinTokenRevoked: {
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcode: 30027,
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.thenClone
  },
  linkedinBadContent: {
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcode: 30028
  },
  linkedinBlockedByUcf: {
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcode: 30029
  },
  linkedinDuplicate: {
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcode: 30030
  },
  linkedinMultipartMaxFilesize: {
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcode: 30031
  },
  linkedinMentionUrn: {
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcode: 30032
  },
  linkedinThumbnailUrl: {
    // historical error of ours with invalid ValidatedUris
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcode: 30033
  },
  linkedinUrlFailedUcvValidation: {
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcode: 30034
  },
  linkedinVideoStatusCheckingFailed: {
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcode: 30035
  },
  linkedinForbiddenToCreateVideoPost: {
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcode: 30036
  },
  linkedInFieldOverrideNotSupported: {
    // hopefully this is just for a one-off run of failures caused by a temporary LinkedIn bug
    // could possibly occur if we start making invalid API requests
    network: ACCOUNT_TYPES.linkedin,
    apiErrorSubcode: 30038
  },
  twitterUnknownError: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcodes: [40000, 40021]
  },
  twitterInvalidAttachmentUrl: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40001
  },
  twitterImageSize: {
    // todo - review max sizes
    // https://local.hubspot.com/social-beta/1865444/publishing/view/63485984
    // https://local.hubspot.com/social-beta/2719566/publishing/view/64582982
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40002
  },
  twitterInvalidGifs: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40003
  },
  twitterInvalidUrl: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40004
  },
  twitterAuth: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcodes: [40005, 40006, 40007, 40008, 40009, 40022],
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.thenClone
  },
  twitterLocked: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40010,
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.thenClone
  },
  twitterUserSuspended: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40011
  },
  twitterRetweetDuplicate: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40012
  },
  twitterTweetDuplicate: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40013
  },
  twitterWrongApiVersion: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40014
  },
  twitterBadApiEndpoint: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40015
  },
  twitterInvalidReply: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40016
  },
  twitterExtendedLength: {
    // https://local.hubspot.com/social-beta/309182/publishing/view/64401923
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40017
  },
  twitterMissingPage: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40018
  },
  twitterMissingTweet: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40019
  },
  twitterMissingMedia: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40020
  },
  twitterSuspended: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40023,
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.thenClone
  },
  twitterForbiddenAction: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40024
  },
  twitterAutomated: {
    // https://local.hubspot.com/social-beta/474307/publishing/view/64289248
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40025
  },
  twitterRateLimit: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40026
  },
  twitterTweetLimit: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40027
  },
  twitterSslError: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40028
  },
  twitterMustLogIn: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40029,
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.thenClone
  },
  twitterWriteError: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40030
  },
  twitterMissingUser: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40031
  },
  twitterOverCapacity: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40032
  },
  twitterTooManyAttachments: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40033
  },
  twitterInvalidUrlParameter: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40034
  },
  twitterMissingQueryParameter: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40035
  },
  twitterUnsupportedMedia: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40036
  },
  twitterEntityTooLarge: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40037
  },
  twitterRetryErrors: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcodes: [40038, 40039]
  },
  twitterVideoStatusCheckingFailed: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40040
  },
  twitterImageTooSmall: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40041
  },
  twitterMissingStatusParameter: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40042
  },
  twitterUnrecognizedMedia: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40043
  },
  twitterMediaFilesizeExceeded: {
    network: ACCOUNT_TYPES.twitter,
    apiErrorSubcode: 40044
  },
  // status-based fallbacks for when we have no mapping for a subcode
  duplicate: {
    // https://local.hubspotqa.com/social-beta/99258317/publishing/view/4208120
    status: BROADCAST_STATUS.DUPLICATE
  },
  ourGenericError: {
    // this needs to be at bottom to avoid conflicting with other error messages
    pattern: /This broadcast has encountered an unknown error/,
    resolution: BROADCAST_PUBLISH_RESOLUTIONS.clone
  }
}; // back-end broadcast update error codes we have messages for
// BroadcastUpdateError: https://git.hubteam.com/HubSpot/Broadcast/blob/master/BroadcastBase/src/main/java/com/hubspot/broadcast/broadcast/BroadcastUpdateError.java

export var BROADCAST_UPDATE_ERROR_KEYS = ImmutableSet(['EXISTING_BROADCAST_END_STATE', 'EXISTING_BROADCAST_PROCESSING', 'EXISTING_BROADCAST_TRIGGERED_SOON']);
Object.keys(BROADCAST_PUBLISH_ERRORS).forEach(function (errorCode) {
  BROADCAST_PUBLISH_ERRORS[errorCode].errorCode = errorCode;
});

function getErrorCodeForMessage(message, network, status, errorData) {
  function evalCondition(condition) {
    if (errorData && condition.apiErrorSubcode) {
      return condition.apiErrorSubcode === errorData.apiErrorSubcode;
    }

    if (errorData && condition.apiErrorSubcodes) {
      return condition.apiErrorSubcodes.includes(errorData.apiErrorSubcode);
    }

    if (condition.pattern) {
      return condition.pattern.test(message);
    }

    if (condition.status) {
      return status === condition.status;
    }

    return false;
  }

  return Object.keys(BROADCAST_PUBLISH_ERRORS).find(function (_key) {
    var errorObj = BROADCAST_PUBLISH_ERRORS[_key];

    if (network && errorObj.network && network !== errorObj.network) {
      return false;
    }

    if (errorObj.conditions) {
      return errorObj.conditions.some(evalCondition);
    }

    return evalCondition(errorObj);
  });
}

export function getErrorInfo(broadcast) {
  var network = getNetworkFromChannelKey(broadcast.channelKey);
  var errorInfo = {
    errorCode: getErrorCodeForMessage(broadcast.message, network, broadcast.status, broadcast.getErrorData())
  };

  if (!errorInfo.errorCode) {
    // means this code has not been ported to this new system, so grab its key and message from the old class
    var message = broadcast.message ? broadcast.message.substr(0, 200) : '';
    Raven.captureMessage("Untranslated error for Broadcast. Message: \"" + message + "\". Status: " + broadcast.status);
  } else {
    // this code has been ported, so we can count on its message to be in the SocialUI lang file, named after it
    errorInfo = Object.assign({}, BROADCAST_PUBLISH_ERRORS[errorInfo.errorCode], {}, errorInfo);
  }

  if (!errorInfo.type) {
    errorInfo.type = 'warning';

    if (broadcast.isRunning()) {
      errorInfo.type = 'info';
    } else if (broadcast.isRetrying()) {
      errorInfo.type = 'warning';
      errorInfo.resolution = BROADCAST_PUBLISH_RESOLUTIONS.retrying;
    } else if (broadcast.isFailed()) {
      errorInfo.type = 'danger';
    }
  }

  if (broadcast.isVideo() && broadcast.isRunning() && network === ACCOUNT_TYPES.facebook) {
    // https://local.hubspotqa.com/social-beta/99258317/publishing/view/4184320
    errorInfo.errorCode = 'videoProcessing';
  }

  if (broadcast.isRetrying()) {
    errorInfo.resolution = BROADCAST_PUBLISH_RESOLUTIONS.retrying;
  }

  return errorInfo;
}