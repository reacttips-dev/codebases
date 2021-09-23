'use es6';

var prefix = function prefix(name) {
  return "library.templates." + name;
};

var createTemplate = function createTemplate(path) {
  return {
    name: prefix(path + ".name"),
    subject: prefix(path + ".subject"),
    body: prefix(path + ".body")
  };
};

var createEmailBuriedTemplate = function createEmailBuriedTemplate(path) {
  return {
    name: prefix(path + ".name"),
    subject: prefix('shared.emailBuried.subject'),
    body: prefix('shared.emailBuried.body')
  };
};

var createLetsMeetTemplate = function createLetsMeetTemplate(path) {
  return {
    name: prefix(path + ".name"),
    subject: prefix('shared.letsMeet.subject'),
    body: prefix('shared.letsMeet.body')
  };
};

var createGettingWorriedTemplate = function createGettingWorriedTemplate(path) {
  return {
    name: prefix(path + ".name"),
    subject: prefix('shared.gettingWorried.subject'),
    body: prefix('shared.gettingWorried.body')
  };
};

var createThinLineTemplate = function createThinLineTemplate(path) {
  return {
    name: prefix(path + ".name"),
    subject: prefix('shared.thinLine.subject'),
    body: prefix('shared.thinLine.body')
  };
};

export var RecentConversionEmail = createTemplate('recentConversion.email1');
export var RecentConversionEmail2 = createTemplate('recentConversion.email2');
export var RecentConversionEmail3 = createTemplate('recentConversion.email3');
export var TradeShowEmail = createTemplate('tradeShowOrConferenceFollowUp.email1');
export var TradeShowEmail2 = createTemplate('tradeShowOrConferenceFollowUp.email2');
export var TradeShowEmail3 = createEmailBuriedTemplate('tradeShowOrConferenceFollowUp.email3');
export var ProductDemoEmail = createTemplate('productOrDemoRequest.email1');
export var ProductDemoEmail2 = createTemplate('productOrDemoRequest.email2');
export var ProductDemoEmail3 = createEmailBuriedTemplate('productOrDemoRequest.email3');
export var MeetingFollowUpEmail = createTemplate('postCallFollowUp.email1');
export var MeetingFollowUpEmail2 = createTemplate('postCallFollowUp.email2');
export var MeetingFollowUpEmail3 = createLetsMeetTemplate('postCallFollowUp.email3');
export var MeetingFollowUpEmail4 = createGettingWorriedTemplate('postCallFollowUp.email4');
export var MeetingFollowUpEmail5 = createThinLineTemplate('postCallFollowUp.email5');
export var ProspectingEmail = createTemplate('prospecting.email1');
export var ProspectingEmail2 = createTemplate('prospecting.email2');
export var ProspectingEmail3 = createTemplate('prospecting.email3');
export var LeftVoicemailEmail = createTemplate('leftVoicemail.email1');
export var LeftVoicemailEmail2 = createLetsMeetTemplate('leftVoicemail.email2');
export var LeftVoicemailEmail3 = createGettingWorriedTemplate('leftVoicemail.email3');
export var LeftVoicemailEmail4 = createThinLineTemplate('leftVoicemail.email4');
export var RescheduleMeetingEmail = createTemplate('rescheduleMeeting.email1');
export var RescheduleMeetingEmail2 = createLetsMeetTemplate('rescheduleMeeting.email2');
export var RescheduleMeetingEmail3 = createTemplate('rescheduleMeeting.email3');
export var RescheduleMeetingEmail4 = createGettingWorriedTemplate('rescheduleMeeting.email4');
export var ReEngagementEmail = createTemplate('reengagement.email1');
export var ReEngagementEmail2 = createTemplate('reengagement.email2');
export var ReEngagementEmail3 = createThinLineTemplate('reengagement.email3');