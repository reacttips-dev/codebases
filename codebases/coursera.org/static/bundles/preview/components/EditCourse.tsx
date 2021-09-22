import React from 'react';
import { compose, mapProps } from 'recompose';
import { SvgTools } from '@coursera/coursera-ui/svg';
import Action from 'bundles/preview/components/Action';
import withCustomLabelsByUserAndCourse from 'bundles/custom-labels/hoc/withCustomLabelsByUserAndCourse';
import type { ReplaceCustomContent as ReplaceCustomContentType } from 'bundles/custom-labels/types/CustomLabels';

import type AuthoringCourse from 'bundles/author-common/models/AuthoringCourse';

import 'css!bundles/preview/components/__styles__/EditCourse';

import _t from 'i18n!nls/preview';

type InputProps = {
  course: AuthoringCourse;
};

type Props = InputProps & {
  replaceCustomContent: ReplaceCustomContentType;
};

const EditCourse = ({ course, replaceCustomContent }: Props) => {
  const editCourseLabel = replaceCustomContent(_t('Edit #{capitalizedCourse}'), { returnsString: true });
  return (
    <div className="rc-EditCourse">
      <Action icon={<SvgTools />} label={editCourseLabel} href={`/teach/${course.slug}/course/overview`} />
    </div>
  );
};

export default compose<Props, InputProps>(
  mapProps<InputProps, Props>(({ course }) => ({ course, courseId: course.id })),
  withCustomLabelsByUserAndCourse
)(EditCourse);
