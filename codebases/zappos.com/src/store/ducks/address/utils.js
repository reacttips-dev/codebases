export const toFormatted = address => {
  const {
    addressId,
    addressLine1,
    addressLine2,
    city,
    countryCode,
    fullName,
    postalCode,
    primaryVoiceNumber,
    stateOrRegion,
    isPrimary
  } = address;

  return {
    addressId,
    isDefaultShippingAddress: isPrimary,
    mailingAddress: { addressLine1, addressLine2, city, countryCode, postalCode, stateOrRegion },
    name: { fullName },
    phone: { voice: { primary: { number: primaryVoiceNumber } } }
  };
};
