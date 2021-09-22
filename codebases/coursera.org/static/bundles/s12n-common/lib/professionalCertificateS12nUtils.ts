import OnDemandSpecializationsV1 from 'bundles/naptimejs/resources/onDemandSpecializations.v1';

import _t from 'i18n!nls/s12n';

export const getProfessionalCertifcateS12nDisplayName = (profCertS12n: OnDemandSpecializationsV1 | string): string => {
  const name = typeof profCertS12n === 'string' ? profCertS12n : profCertS12n.name;

  return _t('#{professionalCertificateName} Professional Certificate', { professionalCertificateName: name });
};

export default {
  getProfessionalCertifcateS12nDisplayName,
};
