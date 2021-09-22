const getUserFullName = (userVerificationInformation: $TSFixMe) => {
  const { firstName, middleName, lastName } = !!userVerificationInformation && userVerificationInformation;
  return `${firstName ? firstName + ' ' : ''}${middleName ? middleName + ' ' : ''}${lastName || ''}`;
};

export default {
  getUserFullName,
};

export { getUserFullName };
