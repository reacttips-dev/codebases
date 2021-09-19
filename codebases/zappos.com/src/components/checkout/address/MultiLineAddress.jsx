import cn from 'classnames';
import PropTypes from 'prop-types';

import css from 'styles/components/checkout/address/multiLineAddress.scss';

const MultiLineAddress = ({ address = {}, hideCountry = false, hideName = false, hidePhone = false, highlightName = true }, { testId = f => f }) => {
  if (!Object.keys(address).length) {
    return null;
  }

  const {
    mailingAddress: {
      addressLine1,
      addressLine2,
      city,
      countryCode,
      countryName,
      postalCode,
      stateOrRegion
    },
    name: {
      fullName
    },
    phone: {
      voice: {
        primary: {
          number: phoneNumber
        }
      }
    }
  } = address;

  if (!addressLine1) {
    return null;
  }

  const nameStyles = cn({ [css.fullName]: highlightName });

  return (
    <div className={css.wrapper} data-test-id={testId('multiLineAddress')}>
      { !hideName && <div className={nameStyles} data-test-id={testId('mlaName')}>{fullName}</div> }
      <div data-test-id={testId('mlaLine1')}>{addressLine1}</div>
      { addressLine2 && <div data-test-id={testId('mlaLine2')}>{addressLine2}</div> }
      <div data-test-id={testId('mlaLine3')}>{city}, {stateOrRegion} {postalCode}</div>
      { !hideCountry && <div data-test-id={testId('mlaCountry')}>{countryName || countryCode}</div> }
      { !hidePhone && <div data-test-id={testId('mlaPhone')}>{phoneNumber}</div> }
    </div>
  );
};

MultiLineAddress.contextTypes = {
  testId: PropTypes.func
};

export default MultiLineAddress;
