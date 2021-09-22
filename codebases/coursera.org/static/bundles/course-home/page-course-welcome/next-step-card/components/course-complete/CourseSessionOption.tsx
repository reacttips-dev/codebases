import React from 'react';
import TrackedButton from 'bundles/page/components/TrackedButton';

import _t from 'i18n!nls/course-home';

type Props = {
  canSwitchSession: boolean;
  onClick: () => void;
};

const CourseSessionOption: React.SFC<Props> = (props) => {
  const { canSwitchSession, onClick } = props;

  return (
    <TrackedButton className="nostyle" onClick={onClick} trackingName="gle_dropdown_session_switch">
      {canSwitchSession ? _t('Switch Session') : _t('Join Session')}
    </TrackedButton>
  );
};

export default CourseSessionOption;
