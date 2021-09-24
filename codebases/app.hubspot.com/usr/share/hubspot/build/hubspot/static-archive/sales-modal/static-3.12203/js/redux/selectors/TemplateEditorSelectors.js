'use es6';

import { createSelector } from 'reselect';
import { Editor } from 'draft-extend';
import apiClient from 'hub-http/clients/apiClient';
import { getIsPrimarySequence } from './EnrollmentStateSelectors';
import { getGateMap, getScopeMap, hasOneToOneVideoAccess } from './permissionSelectors';
import { getPlatform } from './SenderSelectors';
import { GMAIL, OUTLOOK, OUTLOOK_365 } from 'sales-modal/constants/Platform';
import getEditorPlugins from 'SalesTemplateEditor/plugins/compositePlugins/getEditorPlugins';
import createSalesModalConfig from 'draft-content-plugins/plugins/insertGroup/createSalesModalConfig';
import imageUrl from 'bender-url!sales-modal/images/pql-meetings.png';
import { RENDERED as SNIPPETS_RENDERED } from 'draft-plugins/plugins/snippets/SnippetsOutputTypes';
import { RENDERED as DOCUMENTS_RENDERED } from 'draft-plugins/plugins/documents/DocumentLinkOutputTypes';
import { UsageTracker } from 'sales-modal/utils/enrollModal/UsageLogger';
import getBodyConversionPlugins from 'sales-modal/components/enrollModal/plugins/bodyConversionPlugins';
import getSubjectConversionPlugins from 'sales-modal/components/enrollModal/plugins/subjectConversionPlugins';
import SignaturePlugin from 'draft-signature-plugin/SignaturePlugin';
import SignatureUnsubscribePlugin from 'EmailSignatureEditor/plugins/SignatureUnsubscribePlugin';
import compose from 'transmute/compose';
var signaturePlugins = [SignaturePlugin({
  allowEditing: false
}), SignatureUnsubscribePlugin];
var getReadOnlyTemplateBodyEditor = createSelector([getGateMap, getScopeMap], function (gates, scopes) {
  return compose.apply(void 0, [getEditorPlugins('bodyPlugins', true, gates, true, scopes)].concat(signaturePlugins))(Editor);
});
var getReadOnlyTemplateSubjectEditor = createSelector([getGateMap, getScopeMap], function (gates, scopes) {
  return getEditorPlugins('subjectPlugins', true, gates, true, scopes)(Editor);
});
var getEditableTemplateSubjectEditor = createSelector([], function () {
  return getSubjectConversionPlugins()(Editor);
});
export var getInsertGroupConfig = createSelector([hasOneToOneVideoAccess], function (hasVideo) {
  var videoConfig = hasVideo ? {
    video: {
      useInsertPopover: true,
      insertPopoverPlacement: 'top left',
      usePopover: false,
      shepherdUserSettingKey: 'sales-content-has-viewed-video-integration-shepherd'
    }
  } : {};
  return createSalesModalConfig(Object.assign({
    snippets: {
      outputType: SNIPPETS_RENDERED,
      tracker: function tracker(eventName) {
        return UsageTracker.track('sequencesUsage', {
          action: eventName,
          subscreen: 'enroll'
        });
      }
    },
    documents: {
      fetch: apiClient.post,
      track: function track(eventName) {
        return UsageTracker.track('sequencesUsage', {
          action: eventName,
          subscreen: 'enroll'
        });
      },
      outputType: DOCUMENTS_RENDERED
    },
    meetings: {
      onInsertMeetingsLink: function onInsertMeetingsLink() {
        return UsageTracker.track('sequencesUsage', {
          action: 'Inserted meeting link',
          subscreen: 'enroll'
        });
      },
      zeroStateImageUrl: imageUrl
    }
  }, videoConfig));
});
export var getEditableTemplateBodyEditorPlugins = createSelector([getInsertGroupConfig, getPlatform], function (insertGroupConfig, platform) {
  // TODO We should be able to remove this after sales-clients fix. See issue
  // https://git.hubteam.com/HubSpot/sales-rep-engagement/issues/695
  var publicImages = platform === OUTLOOK || platform === OUTLOOK_365 || platform === GMAIL;
  return getBodyConversionPlugins(insertGroupConfig, publicImages);
});
export var getEditableTemplateBodyEditor = createSelector([getEditableTemplateBodyEditorPlugins], function (editorPlugins) {
  return editorPlugins(Editor);
});

var getIsReadOnly = function getIsReadOnly(state, ownProps) {
  return ownProps.readOnly;
};

export var getTemplateBodyEditor = createSelector([getIsPrimarySequence, getIsReadOnly, getReadOnlyTemplateBodyEditor, getEditableTemplateBodyEditor], function (isPrimarySequence, readOnly, readOnlyTemplateBodyEditor, editableTemplateBodyEditor) {
  return isPrimarySequence || readOnly ? readOnlyTemplateBodyEditor : editableTemplateBodyEditor;
});
export var getTemplateSubjectEditor = createSelector([getIsPrimarySequence, getIsReadOnly, getReadOnlyTemplateSubjectEditor, getEditableTemplateSubjectEditor], function (isPrimarySequence, readOnly, readOnlyTemplateSubjectEditor, editableTemplateSubjectEditor) {
  return isPrimarySequence || readOnly ? readOnlyTemplateSubjectEditor : editableTemplateSubjectEditor;
});