'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { Map as ImmutableMap } from 'immutable';
import * as SequenceEmailErrorTypes from 'SequencesUI/constants/SequenceEmailErrorTypes';
var otherMessage = 'otherMessage';
var otherMessageTagName = 'otherMessageTagName';
var errorTypesMap = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.RATE_LIMITED_BY_CLIENT, {
  errorMessage: 'rateLimitedByClient',
  errorTagName: 'rateLimitedByClientTagName',
  link: {
    copy: 'dailySendLimit',
    ref: 'https://knowledge.hubspot.com/email/why-was-my-sales-email-not-sent-due-to-a-send-limit'
  }
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.RATE_LIMITED_BY_PROVIDER, {
  errorMessage: 'rateLimitedByProvider',
  errorTagName: 'rateLimitedByProviderTagName',
  link: {
    copy: 'dailySendLimit',
    ref: 'https://knowledge.hubspot.com/email/why-was-my-sales-email-not-sent-due-to-a-send-limit'
  }
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.PERMANENT_FAIL, {
  errorMessage: 'permanentFail',
  errorTagName: 'permanentFailTagName',
  link: {
    copy: 'reconnectingYourInbox',
    ref: 'https://knowledge.hubspot.com/articles/kcs_article/email-notifications/reconnecting-your-inbox-to-hubspot-sales'
  }
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.UNSUBSCRIBED, {
  errorMessage: 'unsubscribed',
  errorTagName: 'unsubscribedTagName'
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.BOUNCED, {
  errorMessage: 'bounced',
  errorTagName: 'bouncedTagName'
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.DISCONNECTED_INBOX, {
  errorMessage: 'disconnectedInbox',
  errorTagName: 'disconnectedInboxTagName',
  link: {
    copy: 'reconnectYourInbox',
    ref: 'https://knowledge.hubspot.com/articles/kcs_article/email-notifications/reconnecting-your-inbox-to-hubspot-sales'
  }
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.CONTACT_MISSING, {
  errorMessage: 'contactMissing',
  errorTagName: 'contactMissingTagName'
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.CONTACT_INVALID_EMAIL_ADDRESS, {
  errorMessage: 'contactInvalidEmailAddress',
  errorTagName: 'contactInvalidEmailAddressTagName'
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.GLOBALLY_BLOCKED_RECIPIENT_ADDRESS, {
  errorMessage: 'globallyBlockedRecipientAddress',
  errorTagName: 'globallyBlockedRecipientAddressTagName'
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.GLOBALLY_BLOCKED_RECIPIENT_DOMAIN, {
  errorMessage: 'globallyBlockedRecipientDomain',
  errorTagName: 'globallyBlockedRecipientDomainTagName'
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.RECIPIENT_PREVIOUSLY_BOUNCED_ON_PORTAL, {
  errorMessage: 'recipientPreviouslyBouncedOnPortal',
  errorTagName: 'recipientPreviouslyBouncedOnPortalTagName'
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.RECIPIENT_PREVIOUSLY_BOUNCED_GLOBALLY, {
  errorMessage: 'recipientPreviouslyBouncedGlobally',
  errorTagName: 'recipientPreviouslyBouncedGloballyTagName'
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.PREVIOUSLY_MARKED_AS_SPAM, {
  errorMessage: 'previouslyMarkedAsSpam',
  errorTagName: 'previouslyMarkedAsSpamTagName'
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.OTHER_SEND_REJECTED, {
  errorMessage: 'otherSendRejected',
  errorTagName: 'otherSendRejectedTagName'
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.BAD_TQ_REQUEST, {
  errorMessage: otherMessage,
  errorTagName: otherMessageTagName
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.ENROLLMENT_STATE, {
  errorMessage: otherMessage,
  errorTagName: otherMessageTagName
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.OTHER, {
  errorMessage: otherMessage,
  errorTagName: otherMessageTagName
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.UNKNOWN, {
  errorMessage: otherMessage,
  errorTagName: otherMessageTagName
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.GMAIL_SEND_FAIL, {
  errorMessage: 'gmailSendError',
  errorTagName: 'gmailSendErrorTagName',
  link: {
    copy: 'gmailSendErrorLinkCopy',
    ref: 'https://knowledge.hubspot.com/articles/kcs_article/sequences/what-do-the-errors-mean-in-my-sequences-dashboard#gmail-send-error'
  }
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.GDPR, {
  errorMessage: 'gdpr',
  errorTagName: 'gdprTagName'
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.DOWNGRADE, {
  errorMessage: 'downgrade',
  errorTagName: 'downgradeTagName'
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.NO_INBOX_FOR_SENDER_ADDRESS, {
  errorMessage: 'noInboxForSenderAddress',
  errorTagName: 'noInboxForSenderAddressTagName'
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.NO_SETTINGS_FOR_GENERIC_INBOX, {
  errorMessage: 'noSettingsForGenericInbox',
  errorTagName: 'noSettingsForGenericInboxTagName'
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.UNSATISFIABLE_CONSTRAINTS, {
  errorMessage: 'unsatisfiableConstraints',
  errorTagName: 'unsatisfiableConstraintsTagName'
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.FACSIMILE_SCHEDULE_FAILURE, {
  errorMessage: 'facsimileScheduleFailure',
  errorTagName: 'facsimileScheduleFailureTagName'
}), _defineProperty(_ImmutableMap, SequenceEmailErrorTypes.EMAIL_ATTACHMENT_PROCESSING_FAILED, {
  errorMessage: 'unenrolledDueToLargeAttachment',
  errorTagName: 'unenrolledDueToLargeAttachmentTagName'
}), _ImmutableMap));

var sequenceEmailErrorType = function sequenceEmailErrorType(errorType) {
  return errorTypesMap.has(errorType) ? errorTypesMap.get(errorType) : {
    errorMessage: 'otherMessage',
    errorTagName: 'otherMessageTagName'
  };
};

export default sequenceEmailErrorType;