import config from 'js/app/config';

const exported = {
  config,
  paymentsApi: 'payments/redeem_free_course_voucher',

  accomplishments: {
    baseUrl: '/account/accomplishments',
    courseUrl: '/account/accomplishments/records',
    professionalCertUrl: '/account/accomplishments/professional-cert',
    specializationUrl: '/account/accomplishments/specialization',
  },
};

export default exported;
export { config };

export const { paymentsApi, accomplishments } = exported;
