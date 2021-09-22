import { compose } from 'underscore';

import discussionsForumsHOC from 'bundles/discussions/components/discussionsForumsHOC';
import withCustomLabelsByUserAndCourse from 'bundles/custom-labels/hoc/withCustomLabelsByUserAndCourse';

import { ControlsBar } from './ControlsBar';

const controlsBarComponent = compose(
  discussionsForumsHOC({
    fields: ['link', 'title', 'description', 'lastAnsweredAt', 'forumQuestionCount'],
  }),
  // NOTE: `courseId` is injected by discussionsForumsHOC
  withCustomLabelsByUserAndCourse
)(ControlsBar);

export { controlsBarComponent as ControlsBar };
