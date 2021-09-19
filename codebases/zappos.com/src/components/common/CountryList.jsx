import React from 'react';
import countries from 'iso-3166-country-list';

import useMartyContext from 'hooks/useMartyContext';
import marketplace from 'cfg/marketplace.json';

const { checkout: { shippingCountriesWhitelist, embargoedCountries } } = marketplace;

const canUseCountriesList = countries.filter(country => embargoedCountries.indexOf(country.code) < 0).map(country => <option key={country.code} value={country.code}>{country.name}</option>);

const shippingCountriesList = canUseCountriesList.filter(country => shippingCountriesWhitelist.indexOf(country.props.value) > -1);

// build initial Array of keys for shipping countries
const shippingCountriesArray = shippingCountriesList.map(shippingCountryList => shippingCountryList.key);

// accessor function that determines if a given country is shippable
export function isCountryShippable(countryCode) {
  return shippingCountriesArray.includes(countryCode);
}

export const CountryList = ({ defaultValue, disabled, id, isBilling, name, onChange, autoComplete = 'country' }) => {
  const { testId } = useMartyContext();
  return (
    <select
      autoComplete={autoComplete}
      id={id}
      name={name}
      disabled={disabled}
      value={defaultValue}
      onChange={onChange}
      data-test-id={testId('countrySelect')}>
      { isBilling ? canUseCountriesList : shippingCountriesList }
    </select>
  );
};

export default CountryList;
