'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import { Map as ImmutableMap } from 'immutable';
import { TASK_BODY_MAX_CHAR } from '../../constants/TaskFormInputProperties';
import FormattedMessage from 'I18n/components/FormattedMessage';
export function bodyMustBeUnderCharacterLimit(task) {
  var subject = task.getIn(['properties', 'hs_task_body', 'value']);

  if (!subject) {
    return ImmutableMap();
  }

  var valid = Boolean(subject.length < TASK_BODY_MAX_CHAR);

  if (!valid) {
    return ImmutableMap({
      errors: ImmutableMap({
        hs_task_body: true
      }),
      messages: ImmutableMap({
        hs_task_body: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "taskFormsLib.validators.bodyMustBeUnderCharacterLimit",
          options: {
            count: subject.length - TASK_BODY_MAX_CHAR
          }
        })
      })
    });
  }

  return ImmutableMap();
}