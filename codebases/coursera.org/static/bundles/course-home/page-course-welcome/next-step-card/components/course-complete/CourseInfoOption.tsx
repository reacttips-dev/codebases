import React from 'react';
import { TrackedA } from 'bundles/page/components/TrackedLink2';

import _t from 'i18n!nls/course-home';

type Props = {
  slug: string;
};

const CourseInfoOption: React.SFC<Props> = (props) => {
  const { slug } = props;

  return (
    <TrackedA className="nostyle button-styles" href={`/learn/${slug}`} trackingName="gle_dropdown_course_info">
      {_t('Course Info')}
    </TrackedA>
  );
};

export default CourseInfoOption;
