'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _Triggers, _PageviewOperatorToTr;

import { PageviewOperators, PageviewOperatorToPropertyOperator } from './Operators';
/*****************************************************************
 * Constants
 ****************************************************************/

export var TriggerTypes = {
  FORM_SUBMISSION: 'FORM_SUBMISSION',
  PAGEVIEW: 'PAGEVIEW'
};
export var getDefaultFirstTrigger = function getDefaultFirstTrigger() {
  return {};
};
export var FORM_SUBMISSION_SPECIFIC_FORM_PLACEHOLDER = '__specific_form';
var FormSubmission = {
  form: undefined,
  filterFamily: 'FormSubmission',
  // Workflows does support extra filtering by page, date, and num occurrences,
  // and by whether the form was or was not filled out,
  // but that's hidden in Sequences for a simplified interface
  operator: 'HAS_FILLED_OUT_FORM',
  page: ''
};
var Pageview = {
  filterFamily: 'PageView',
  withinTimeMode: 'PAST',
  operator: undefined,
  value: undefined
};
export var Triggers = (_Triggers = {}, _defineProperty(_Triggers, TriggerTypes.FORM_SUBMISSION, FormSubmission), _defineProperty(_Triggers, TriggerTypes.PAGEVIEW, Pageview), _Triggers);
/*****************************************************************
 * Triggers that are not customizable by users
 *
 * These aren't displayed in Sequences UI, but can be seen
 * by users if they view the workflow in Workflows UI.
 ****************************************************************/

var NowInSequenceTrue = {
  filterFamily: 'PropertyValue',
  operator: 'EQ',
  property: 'hs_sequences_is_enrolled',
  type: 'bool',
  withinTimeMode: 'PAST',
  value: true
};

var getLastSequenceEnrolledTrigger = function getLastSequenceEnrolledTrigger(sequenceId) {
  return {
    filterFamily: 'PropertyValue',
    operator: 'EQ',
    property: 'hs_latest_sequence_enrolled',
    type: 'number',
    withinTimeMode: 'PAST',
    value: sequenceId
  };
};

var SequenceEnrollIsBeforeRecentConversionDate = {
  operator: 'LT',
  compareProperty: 'recent_conversion_date',
  filterFamily: 'PropertyValue',
  withinTimeMode: 'PAST',
  type: 'datetime',
  property: 'hs_latest_sequence_enrolled_date'
};

var getPageviewLastPageSeenTrigger = function getPageviewLastPageSeenTrigger(pageviewOperator, value) {
  return {
    filterFamily: 'PropertyValue',
    withinTimeMode: 'PAST',
    type: 'string',
    property: 'hs_analytics_last_url',
    operator: PageviewOperatorToPropertyOperator[pageviewOperator],
    value: value
  };
};

var PageviewTimeLastSeenAfterSequenceEnroll = {
  compareProperty: 'hs_latest_sequence_enrolled_date',
  filterFamily: 'PropertyValue',
  withinTimeMode: 'PAST',
  operator: 'GT',
  type: 'datetime',
  property: 'hs_analytics_last_timestamp'
};
export var HiddenTriggers = {
  NowInSequenceTrue: NowInSequenceTrue,
  getLastSequenceEnrolled: getLastSequenceEnrolledTrigger,
  RecentConversionDate: SequenceEnrollIsBeforeRecentConversionDate,
  getPageviewTrigger: getPageviewLastPageSeenTrigger,
  PageviewTimeLastSeen: PageviewTimeLastSeenAfterSequenceEnroll
};
/*****************************************************************
 * ReEnrollment triggers
 ****************************************************************/

var getFormReEnrollmentTrigger = function getFormReEnrollmentTrigger(formId) {
  return [{
    type: 'FORM',
    id: formId
  }];
};

var PageviewOperatorToTriggerType = (_PageviewOperatorToTr = {}, _defineProperty(_PageviewOperatorToTr, PageviewOperators.HAS_PAGEVIEW_EQUAL, 'FULL_URL'), _defineProperty(_PageviewOperatorToTr, PageviewOperators.HAS_PAGEVIEW_CONTAINS, 'PARTIAL_URL'), _PageviewOperatorToTr);

var getPageviewReEnrollmentTrigger = function getPageviewReEnrollmentTrigger(pageviewOperator, pageURL) {
  return [{
    pageViewTriggerType: PageviewOperatorToTriggerType[pageviewOperator],
    name: pageURL,
    id: pageURL,
    type: 'PAGE_VIEW'
  }];
};

export var ReEnrollmentTriggers = {
  getForm: getFormReEnrollmentTrigger,
  getPageview: getPageviewReEnrollmentTrigger
};