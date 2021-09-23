'use es6';

import once from 'transmute/once';
import I18n from 'I18n';
import { MergeTagTypes, MergeTagI18n } from 'draft-plugins/lib/mergeTagConstants';
export default once(function (mergeTags) {
  return mergeTags.map(function (tag) {
    return {
      text: I18n.text(MergeTagI18n[tag]),
      value: MergeTagTypes[tag]
    };
  });
});