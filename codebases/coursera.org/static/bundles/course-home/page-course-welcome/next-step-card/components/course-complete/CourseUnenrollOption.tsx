import React from 'react';
import TrackedButton from 'bundles/page/components/TrackedButton';

import _t from 'i18n!nls/course-home';

type Props = {
  onClick: () => void;
};

const CourseUnenrollOption: React.SFC<Props> = (props) => {
  const { onClick } = props;

  return (
    <TrackedButton className="nostyle" onClick={onClick} trackingName="gle_dropdown_unenroll">
      {_t('Un-enroll from Course')}
    </TrackedButton>
  );
};

export default CourseUnenrollOption;
