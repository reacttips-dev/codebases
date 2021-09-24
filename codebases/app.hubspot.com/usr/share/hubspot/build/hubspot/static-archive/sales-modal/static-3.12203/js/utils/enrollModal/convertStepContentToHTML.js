'use es6';

import { convertToHTML } from 'draft-convert';
import getBodyConversionPlugins from 'sales-modal/components/enrollModal/plugins/bodyConversionPlugins';
import getSubjectConversionPlugins from 'sales-modal/components/enrollModal/plugins/subjectConversionPlugins';
import { SCHEDULE_TASK } from 'sales-modal/constants/SequenceStepTypes';
import { stepHasEmailTemplateId, EMAIL_TEMPLATE_META_PATH } from 'sales-modal/utils/enrollModal/stepsWithEmailTemplates';
import { unescape } from '../../utils/underscore';
var bodyToHTMLBeta = getBodyConversionPlugins()(convertToHTML);
var subjectToHTML = getSubjectConversionPlugins()(convertToHTML);
export default function (sequenceEnrollment) {
  var bodyToHTMLConverter = bodyToHTMLBeta;
  return sequenceEnrollment.update('steps', function (steps) {
    return steps.map(function (step) {
      var action = step.get('action');

      if (action === SCHEDULE_TASK) {
        step = step.updateIn(['actionMeta', 'taskMeta'], function (taskMeta) {
          if (!taskMeta.get('subject') && taskMeta.get('notes')) {
            var editorState = taskMeta.get('notes');
            return taskMeta.set('notes', bodyToHTMLConverter(editorState.getCurrentContent()));
          }

          return taskMeta;
        });
      }

      if (stepHasEmailTemplateId(step)) {
        var emailTemplateMetaPath = EMAIL_TEMPLATE_META_PATH[action];
        step = step.updateIn(emailTemplateMetaPath, function (emailTemplateMeta) {
          var body = bodyToHTMLConverter(emailTemplateMeta.get('body').getCurrentContent());
          var subject = unescape(subjectToHTML(emailTemplateMeta.get('subject').getCurrentContent()));
          return emailTemplateMeta.delete('originalBody').delete('originalBodyText').delete('originalSubject').merge({
            subject: subject,
            body: body
          });
        });
      }

      return step;
    });
  });
}