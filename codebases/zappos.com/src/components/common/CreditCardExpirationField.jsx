import PropTypes from 'prop-types';

import { formatDate } from 'helpers/dateUtils';

// setup variables that will be reused
const thisYear = new Date().getYear() + 1900;
const NUMBER_OF_YEARS_IN_FUTURE = 15;
const options = [];
for (let i = 0; i < NUMBER_OF_YEARS_IN_FUTURE; i++) {
  const year = thisYear + i;
  options.push(<option key={year} value={year}>{year}</option>);
}
const defaultMonth = formatDate('MM');

export const CreditCardExpirationYear = ({ disabled, value, id, name = 'expirationYear', onChange = f => f }, { testId = f => f }) => (
  <select
    autoComplete="cc-exp-year"
    disabled={disabled}
    name={name}
    id={id}
    value={value}
    onChange={onChange}
    required
    data-test-id={testId('ccExpYearSelect')}>
    <option value="">Year</option>
    {options}
  </select>
);

CreditCardExpirationYear.contextTypes = {
  testId: PropTypes.func
};

export const CreditCardExpirationMonth = ({ disabled, value = defaultMonth, id, name = 'expirationMonth', onChange = f => f }, { testId = f => f }) => (
  <select
    autoComplete="cc-exp-month"
    disabled={disabled}
    name={name}
    id={id}
    value={value}
    onChange={onChange}
    required
    data-test-id={testId('ccExpMonthSelect')}>
    <option value="">Month</option>
    <option value="01">01 - Jan</option>
    <option value="02">02 - Feb</option>
    <option value="03">03 - Mar</option>
    <option value="04">04 - Apr</option>
    <option value="05">05 - May</option>
    <option value="06">06 - Jun</option>
    <option value="07">07 - Jul</option>
    <option value="08">08 - Aug</option>
    <option value="09">09 - Sep</option>
    <option value="10">10 - Oct</option>
    <option value="11">11 - Nov</option>
    <option value="12">12 - Dec</option>
  </select>
);

CreditCardExpirationMonth.contextTypes = {
  testId: PropTypes.func
};
