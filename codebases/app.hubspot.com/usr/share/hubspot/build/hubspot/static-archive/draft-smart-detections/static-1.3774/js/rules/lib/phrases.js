'use es6';

import I18n from 'I18n';
import { Set as ImmutableSet } from 'immutable';

var toI18nText = function toI18nText(name) {
  return I18n.text("draftSmartDetections.phrases." + name);
};

export var getMeetingPhrases = function getMeetingPhrases() {
  return ImmutableSet([toI18nText('meetingPhrases.15minutes'), toI18nText('meetingPhrases.30minutes'), toI18nText('meetingPhrases.letMeKnow'), toI18nText('meetingPhrases.meeting'), toI18nText('meetingPhrases.chat'), toI18nText('meetingPhrases.schedule'), toI18nText('meetingPhrases.reschedule')]);
};
export var getDocumentsPhrases = function getDocumentsPhrases() {
  return ImmutableSet([toI18nText('documentPhrases.attach')]);
};
export var getSpammyWords = function getSpammyWords() {
  return ImmutableSet([toI18nText('spammyPhrases.final'), toI18nText('spammyPhrases.reminder'), toI18nText('spammyPhrases.sale'), toI18nText('spammyPhrases.tempting'), toI18nText('spammyPhrases.specials'), toI18nText('spammyPhrases.complimentary'), toI18nText('spammyPhrases.help'), toI18nText('spammyPhrases.donation'), toI18nText('spammyPhrases.dont'), toI18nText('spammyPhrases.exciting'), toI18nText('spammyPhrases.unique'), toI18nText('spammyPhrases.discount'), toI18nText('spammyPhrases.solution'), toI18nText('spammyPhrases.partner')]);
};
export var getSpammyPhrases = function getSpammyPhrases() {
  return ImmutableSet([toI18nText('spammyPhrases.stateOfTheArt')]);
};