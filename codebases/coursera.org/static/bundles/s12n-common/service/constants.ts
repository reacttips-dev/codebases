import config from 'js/app/config';
import path from 'js/lib/path';
import PRODUCT_VARIANT from 'bundles/s12n-common/constants/s12nProductVariants';

const exported = {
  config,
  maxShow: 4,
  certImgUrl: path.join(config.url.resource_assets, 'specialization_capstone_promotion/speccert.png'),
  s12nRoot: '/specializations',
  s12nMembershipsApi: '/api/onDemandSpecializationMemberships.v1',
  galleryImgPath: 'https://s3.amazonaws.com/coursera_assets/specialization_projects/',
  testImgPath: 'https://s3.amazonaws.com/coursera_assets/sdp_page/',
  googleShare: 'https://plus.google.com/share?url=',
  twitterShare: 'http://twitter.com/home?status=',
  siteRoot: 'coursera.org',
  instructorPhotoSize: 150,
  financialAidLink: 'https://learner.coursera.help/hc/articles/209819033',
  refundPolicyLink: 'https://www.coursera.org/about/terms/refund',
  coursePhotoSize: 72,

  // d2j5ihb19pt1hq corresponds to `coursera_assets.s3.amazonaws.com`
  // NOTE this path does not get swapped by Edge's dynamic CDN selector
  genericS12nHeaderImage: 'http://d2j5ihb19pt1hq.cloudfront.net/sdp_page/header_images_2/generic_header.jpg',

  learnerStatus: {
    certificateEarned: 'certificateEarned',
    capstoneNotEligible: 'capstoneNotEligible',
    capstoneEligibleNotEnrolled: 'capstoneEligibleNotEnrolled',
    courseNotLaunched: 'courseNotLaunched',
    enrolledNotStarted: 'enrolledNotStarted',
    learnerStarted: 'learnerStarted',
    coursePreLaunched: 'coursePreLaunched',
    courseHasSessions: 'courseHasSessions',
  },

  partnerNameOverrides: {
    whartonfoundations: {
      'University of Pennsylvania': 'The Wharton School, University of Pennsylvania',
    },
  },

  sparkSpecializationIds: {},
  productVariant: PRODUCT_VARIANT,
};

export default exported;
export { config };

export const {
  maxShow,
  certImgUrl,
  s12nRoot,
  s12nMembershipsApi,
  galleryImgPath,
  testImgPath,
  googleShare,
  twitterShare,
  siteRoot,
  instructorPhotoSize,
  financialAidLink,
  refundPolicyLink,
  coursePhotoSize,
  genericS12nHeaderImage,
  learnerStatus,
  partnerNameOverrides,
  sparkSpecializationIds,
  productVariant,
} = exported;
