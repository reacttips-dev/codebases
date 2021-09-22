import React from 'react';
import Naptime from 'bundles/naptimejs';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import OnDemandCoursesV1 from 'bundles/naptimejs/resources/onDemandCourses.v1';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import _t from 'i18n!nls/enroll';

import 'css!./__styles__/SubscriptionVPropCDP';

type InputProps = {
  s12nId: string;
  courseId: string;
};

type Props = {
  s12n: OnDemandSpecializationsV1;
  onDemandCourse: OnDemandCoursesV1;
};

class SubscriptionVPropCDP extends React.Component<Props> {
  renderContent() {
    const { s12n, onDemandCourse } = this.props;

    const s12nTitle = s12n.name;
    const courseName = onDemandCourse.name;

    return (
      <div>
        <h2 className="sub-prop-header headline-1-text">
          <strong>
            <FormattedMessage message={_t('Subscribe and get access to the entire specialization.')} />
          </strong>
        </h2>
        <div className="flex-11">
          <p className="body-1-text">
            <FormattedMessage
              message={_t(
                "{courseName} is part of the larger {s12nTitle} series. When you subscribe you'll get access to:"
              )}
              s12nTitle={<strong>{s12nTitle}</strong>}
              courseName={<strong>{courseName}</strong>}
            />
          </p>
        </div>
      </div>
    );
  }

  render() {
    return <div className="rc-SubscriptionVPropCDP">{this.renderContent()}</div>;
  }
}

export default Naptime.createContainer<Props, InputProps>(SubscriptionVPropCDP, ({ s12nId, courseId }) => {
  return {
    s12n: OnDemandSpecializationsV1.get(s12nId, {
      fields: ['name', 'courseIds', 'productVariant'],
    }),
    onDemandCourse: OnDemandCoursesV1.get(courseId, {
      fields: ['name'],
    }),
  };
});
