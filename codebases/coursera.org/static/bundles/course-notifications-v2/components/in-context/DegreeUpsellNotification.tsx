import React from 'react';

import InContextNotification from 'bundles/course-notifications-v2/components/in-context/InContextNotification';
import type { DegreeUpsellNotification as DegreeUpsellNotificationType } from 'bundles/course-notifications-v2/types/CourseNotification';
import { buildDegreeUrlRelative } from 'bundles/common/utils/urlUtils';
import { TrackedA } from 'bundles/page/components/TrackedLink2';

import _t from 'i18n!nls/course-notifications-v2';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

const DegreeName = ({ degreeSlug, degreeName }: $TSFixMe) => {
  return (
    <TrackedA
      trackingName="degreeUpsellDdpLink"
      href={buildDegreeUrlRelative(degreeSlug, '?utm_medium=coursera&utm_source=open_content_lex_banner')}
      target="_blank"
      rel="noopener noreferrer"
    >
      {degreeName}
    </TrackedA>
  );
};

const DegreeUpsellNotification = ({ notification }: { notification: DegreeUpsellNotificationType }) => {
  const {
    definition: { degreeSlug, degreeName, partnerName },
  } = notification;

  const message = (
    <FormattedMessage
      degree={<DegreeName degreeSlug={degreeSlug} degreeName={degreeName} />}
      partnerName={partnerName}
      message={_t(
        `This course is part of the {degree} from {partnerName}. If you apply and are accepted, your courses count towards your degree learning.`
      )}
    />
  );

  return (
    <div className="rc-DegreeUpsellNotification">
      <InContextNotification trackingName="degree_upsell_notification" type="info" message={message} />
    </div>
  );
};

export default DegreeUpsellNotification;
