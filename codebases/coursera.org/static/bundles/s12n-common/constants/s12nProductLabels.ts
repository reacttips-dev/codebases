import _t from 'i18n!nls/s12n';

const getLabels = (): {
  SPECIALIZATION_LABEL: string;
  PROFESSIONAL_CERTIFICATE_LABEL: string;
} => ({
  SPECIALIZATION_LABEL: _t('Specialization'),
  PROFESSIONAL_CERTIFICATE_LABEL: _t('Professional Certificate'),
});

export default getLabels;
