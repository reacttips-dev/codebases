import React from 'react';

import InContextNotification from 'bundles/course-notifications-v2/components/in-context/InContextNotification';
import _t from 'i18n!nls/course-notifications-v2';

const GradeDisclaimerNotification = () => {
  const message = _t(`These grades are provisional and may change. Final overall
      grades will be published after the exam board has met.`);

  return (
    <div className="rc-GradeDisclaimerNotification">
      <InContextNotification trackingName="grade_disclaimer_notification" type="info" message={message} />
    </div>
  );
};

export default GradeDisclaimerNotification;
