import config from 'js/app/config';

const ids = {
  Specialization: ['kLWnFWsyEeeVdhKUpvOPZg'],
  VerifiedCertificate: [
    'zErmN5rZEeajJhIEs83WWg',
    'RpCqbucEEeaH9Q51wS-wDA',
    'GZluGec0EeaqHRKenm-C8A',
    '10W6Te_sEea7DBK-0BPzLg',
  ],
};

const courseIdToCertDpURLMap = {
  zErmN5rZEeajJhIEs83WWg: `${config.url.base}professional-certificate/applied-project-management?showEnrollModal=true`,
  'RpCqbucEEeaH9Q51wS-wDA': `${config.url.base}professional-certificate/applied-project-management?showEnrollModal=true`,
  'GZluGec0EeaqHRKenm-C8A': `${config.url.base}professional-certificate/applied-project-management?showEnrollModal=true`,
  '10W6Te_sEea7DBK-0BPzLg': `${config.url.base}professional-certificate/applied-project-management?showEnrollModal=true`,
};

export const isCartForCertificatePilot = (cart) => {
  if (!cart) {
    return false;
  }

  return cart.topLevelCartItems.every(
    ({ cartItem }) =>
      cartItem.productType && ids[cartItem.productType] && ids[cartItem.productType].includes(cartItem.productItemId)
  );
};

export const isS12nPartOfCertificatePilot = (s12nId) => {
  return ids.Specialization.includes(s12nId);
};

export const isCoursePartOfCertificatePilot = (courseId) => {
  return ids.VerifiedCertificate.includes(courseId);
};

export const certDpURLForCertificatePilotCourse = (courseId) => {
  return courseIdToCertDpURLMap[courseId];
};

export const getPriceMultiplierForBulkPay = (courseOwnerships) => {
  const numOfCoursesOwned = courseOwnerships.filter((courseOwnership) => courseOwnership.owns).length;
  return 1 - numOfCoursesOwned / courseOwnerships.length;
};

export const getCoursesLeftString = (courseOwnerships) => {
  const numOfCoursesTotal = courseOwnerships.length;
  const numOfCoursesOwned = courseOwnerships.filter((courseOwnership) => courseOwnership.owns).length;
  const numOfCoursesLeft = numOfCoursesTotal - numOfCoursesOwned;
  return numOfCoursesLeft === numOfCoursesTotal
    ? numOfCoursesTotal.toString()
    : ' remaining ' + numOfCoursesLeft.toString();
};
