'use es6';

import composeRules from 'draft-smart-detections/composeRules';
import SuggestionGroup from 'draft-smart-detections/SuggestionGroup';
import PersonalizationTokenRule from 'draft-smart-detections/rules/PersonalizationTokenRule';
import LearnMoreRule from 'draft-smart-detections/rules/LearnMoreRule';
export default composeRules(SuggestionGroup(LearnMoreRule, PersonalizationTokenRule));