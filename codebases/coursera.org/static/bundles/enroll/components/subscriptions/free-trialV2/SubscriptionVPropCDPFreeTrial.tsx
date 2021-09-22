import React from 'react';
import { compose } from 'recompose';
import Naptime from 'bundles/naptimejs';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import OnDemandCoursesV1 from 'bundles/naptimejs/resources/onDemandCourses.v1';
import { freeTrial } from 'bundles/payments/common/constants';
import { getProfessionalCertifcateS12nDisplayName } from 'bundles/s12n-common/lib/professionalCertificateS12nUtils';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

import _t from 'i18n!nls/enroll';
import 'css!./__styles__/SubscriptionVPropCDPFreeTrial';

type InputProps = {
  s12nId: string;
  courseId: string;
};

type Props = InputProps & {
  s12n: OnDemandSpecializationsV1;
  course: OnDemandCoursesV1;
};

class SubscriptionVPropCDPFreeTrial extends React.Component<Props> {
  static contextTypes = {
    enableIntegratedOnboarding: PropTypes.bool,
  };

  renderContent() {
    const { s12n, course } = this.props;

    const productDisplayName = s12n.isProfessionalCertificate
      ? getProfessionalCertifcateS12nDisplayName(s12n)
      : _t('#{productName} Specialization', { productName: s12n.name });
    const { enableIntegratedOnboarding } = this.context;
    const wrapperClassNames = classNames({
      'integrated-onboarding-caption': enableIntegratedOnboarding,
    });

    return (
      <p className={wrapperClassNames}>
        <FormattedMessage
          className="headline-1-text"
          message={_t(
            '{courseName} is part of the larger {productDisplayName}. Your {numDays}-day free trial includes:'
          )}
          courseName={course.name}
          numDays={freeTrial.numDays}
          productDisplayName={productDisplayName}
        />
      </p>
    );
  }

  render() {
    return <div className="rc-SubscriptionVPropCDPFreeTrial">{this.renderContent()}</div>;
  }
}

export default compose<Props, InputProps>(
  Naptime.createContainer<Omit<Props, 's12n'>, InputProps>(({ courseId }) => {
    return {
      course: OnDemandCoursesV1.get(courseId, {
        fields: ['id', 'name'],
      }),
    };
  }),
  Naptime.createContainer<Props, Omit<Props, 's12n'>>(({ s12nId }) => {
    return {
      s12n: OnDemandSpecializationsV1.get(s12nId, {
        fields: ['name', 'courseIds', 'productVariant'],
      }),
    };
  })
)(SubscriptionVPropCDPFreeTrial);
