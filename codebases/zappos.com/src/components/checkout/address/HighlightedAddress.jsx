import PropTypes from 'prop-types';

import css from 'styles/components/checkout/address/highlightedAddress.scss';

const HighlightedAddress = ({ address = {}, baseAddress = {}, hideCountry }, { testId = f => f }) => {
  if (!Object.keys(address).length || !Object.keys(baseAddress).length) {
    return null;
  }

  const {
    mailingAddress: {
      addressLine1,
      addressLine2,
      city,
      countryName,
      postalCode,
      stateOrRegion
    },
    name: {
      fullName
    }
  } = address;

  const {
    mailingAddress: {
      addressLine1: baseAddressLine1,
      city: baseCity,
      postalCode: basePostalCode,
      stateOrRegion: baseStateOrRegion
    }
  } = baseAddress;

  if (!addressLine1) {
    return null;
  }

  return (
    <div className={css.wrapper} data-test-id={testId('highlightedAddress')}>
      <div className={css.fullName} data-test-id={testId('haName')}>{ fullName }</div>
      <div data-test-id={testId('haLine1')}>
        {
          addressLine1.toLowerCase() !== baseAddressLine1.toLowerCase()
            ? <span className={css.suggestedAddressHighlight}>{ addressLine1 }</span>
            : addressLine1
        }
      </div>
      { addressLine2 && <div data-test-id={testId('haLine2')}>{addressLine2}</div> }
      <div data-test-id={testId('haLine3')}>
        {
          city.toLowerCase() !== baseCity.toLowerCase()
            ? <span className={css.suggestedAddressHighlight}>{ city }</span>
            : city
        }
        {', '}
        {
          stateOrRegion.toLowerCase() !== baseStateOrRegion.toLowerCase()
            ? <span className={css.suggestedAddressHighlight}>{` ${stateOrRegion} `}</span>
            : ` ${stateOrRegion} `
        }
        {
          postalCode.toLowerCase() !== basePostalCode.toLowerCase()
            ? <span className={css.suggestedAddressHighlight}>{ postalCode }</span>
            : postalCode
        }
      </div>
      { !hideCountry && <div data-test-id={testId('haCountry')}>{ countryName }</div> }
    </div>
  );
};

HighlightedAddress.contextTypes = {
  testId: PropTypes.func
};

export default HighlightedAddress;
