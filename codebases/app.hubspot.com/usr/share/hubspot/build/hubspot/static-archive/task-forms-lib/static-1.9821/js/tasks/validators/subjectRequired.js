'use es6';

import { Map as ImmutableMap } from 'immutable';
export default function subjectRequired(task) {
  var subject = task.getIn(['properties', 'hs_task_subject', 'value']);
  var valid = Boolean(subject && subject.trim().length > 0);

  if (!valid) {
    return ImmutableMap({
      errors: ImmutableMap({
        hs_task_subject: true
      })
    });
  }

  return ImmutableMap();
}