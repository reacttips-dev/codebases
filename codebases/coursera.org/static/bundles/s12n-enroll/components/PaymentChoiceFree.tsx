import PropTypes from 'prop-types';
import React from 'react';
import PaymentChoice from 'bundles/s12n-enroll/components/PaymentChoice';
import UserS12n from 'bundles/s12n-common/service/models/userS12n';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { showPremiumGrading } from 'bundles/ondemand/utils/premiumGradingExperimentUtils';

import _t from 'i18n!nls/s12n-enroll';

const getAuditOptionName = () => _t('Audit only');

const PremiumFreePaymentChoice = ({ currentType, onClick }: $TSFixMe) => {
  const body = _t('You will have access to all course materials except graded items.');

  return (
    <PaymentChoice title={getAuditOptionName()} type="free" currentType={currentType} onClick={onClick}>
      <span className="freeChoice">{body}</span>
    </PaymentChoice>
  );
};

const NonPremiumFreePaymentChoice = ({ currentType, onClick }: $TSFixMe) => {
  const body = _t("You won't get a certificate or be in the Specialization, but you can always upgrade later.");

  const title = _t('Full course, no certificate');

  return (
    <PaymentChoice title={title} type="free" currentType={currentType} onClick={onClick}>
      <span className="freeChoice">{body}</span>
    </PaymentChoice>
  );
};

class PaymentChoiceFree extends React.Component {
  static propTypes = {
    currentType: PropTypes.oneOf(['full', 'single', 'free', 'program']).isRequired,
    onClick: PropTypes.func,
  };

  static contextTypes = {
    userS12n: PropTypes.instanceOf(UserS12n),
  };

  render() {
    let paymentChoice;
    if (showPremiumGrading(this.context.userS12n.metadata)) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentType' does not exist on type 'Rea... Remove this comment to see the full error message
      paymentChoice = <PremiumFreePaymentChoice currentType={this.props.currentType} onClick={this.props.onClick} />;
    } else {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'currentType' does not exist on type 'Rea... Remove this comment to see the full error message
      paymentChoice = <NonPremiumFreePaymentChoice currentType={this.props.currentType} onClick={this.props.onClick} />;
    }

    return paymentChoice;
  }
}

export default PaymentChoiceFree;
