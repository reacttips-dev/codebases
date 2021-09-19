import PropTypes from 'prop-types';

import { toUSD } from 'helpers/NumberFormats';

import css from 'styles/components/checkout/OrderTotal/total.scss';

const Total = ({ total }, { testId }) => (
  <div className={css.wrapper} data-test-id={testId('orderTotalSection')}>
      Order total: { toUSD(total) }
  </div>
);

Total.contextTypes = {
  testId: PropTypes.func
};

export default Total;
