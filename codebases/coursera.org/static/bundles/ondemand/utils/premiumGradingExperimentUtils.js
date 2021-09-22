/* eslint-disable import/prefer-default-export */
export const showPremiumGrading = (s12n) => {
  return s12n && s12n.get('premiumExperienceVariant') === 'PremiumGrading';
};
