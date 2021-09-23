'use es6';

import composeRules from 'draft-smart-detections/composeRules';
import SuggestionGroup from 'draft-smart-detections/SuggestionGroup';
import SubjectLengthRule from 'draft-smart-detections/rules/SubjectLengthRule';
import SpammyWordsRule from 'draft-smart-detections/rules/SpammyWordsRule';
export default composeRules(SuggestionGroup(SubjectLengthRule, SpammyWordsRule));