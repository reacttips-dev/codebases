import PropTypes from 'prop-types';
import { Link } from 'react-router';

import css from 'styles/components/checkout/OrderTotal/termsAndConditions.scss';

const TermsAndConditions = (_params, { testId = f => f, marketplace: { domain, checkout: { helpUrl: { conditionsOfUse, privacyNotice, privacyNoticeText, conditionsOfUseText = 'conditions of use' } } } }) => (
  <div className={css.wrapper} data-test-id={testId('termsSection')}>
    By placing your order, you agree to {domain}.com&#8217;s <Link to={privacyNotice}>{privacyNoticeText}</Link> and <Link to={conditionsOfUse}>{conditionsOfUseText}</Link>.
  </div>
);

TermsAndConditions.contextTypes = {
  testId: PropTypes.func,
  marketplace: PropTypes.object
};

export default TermsAndConditions;
