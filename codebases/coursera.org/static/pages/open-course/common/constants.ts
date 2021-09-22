import config from 'js/app/config';

import path from 'js/lib/path';

const learnRoot = '/learn';
const home = '/home';
let courseSlug = '';
const courseId: string | undefined = undefined;
let rootPath;

// ex. /learn/childnutrition -> {rootPath: '/learn', courseSlug: 'childnutrition'}

/* eslint-disable */
// using pathname() to expose for testing
// TODO(turadg) remove window from this file
const courseSlugMatch =
  typeof window != 'undefined' &&
  window.location.pathname.match(
    /^(\/(?:learn-2018|learn|tools\/yoda|teach|certificate|finaid\/course))(?:\/([^\/]*))?/
  );

/* eslint-enable */
if (courseSlugMatch) {
  rootPath = courseSlugMatch[1];
  if (courseSlugMatch.length > 2 && courseSlugMatch[2] !== undefined) {
    courseSlug = courseSlugMatch[2];
  }
} else {
  rootPath = learnRoot;
}

const exported = {
  // courseId injected in open-course/routes
  config,
  courseId,

  rootPath,
  learnRoot,
  learnCoursePath: path.join(learnRoot, courseSlug),
  courseHomePath: path.join(learnRoot, courseSlug, home),
  teachRoot: '/teach/',
  adminEmailApi: '/api/openCourseAdminEmails.v1',
  openCourseApi: '/api/opencourse.v1',
  assessApi: '/api/assess/v1',
  assetApi: '/api/openCourseAssets.v1',
  peerAssignmentApi: '/api/peerAssignments.v1',
  programmingAssignmentApi: '/api/programmingAssignments.v1',
  openCourseMembershipApi: '/api/openCourseMemberships.v1',
  reportsApi: '/api/reports.v1',
  coursesApi: '/api/onDemandCourses.v1',
  forumsApi: '/api/onDemandDiscussionForums.v1',
  certificateApi: '/api/certificate.v1',
  supplementCompletionApi: '/api/onDemandSupplementCompletions.v1',
  supplementStartApi: '/api/onDemandSupplementStarts.v1',
  lectureVideosApi: 'onDemandLectureVideos.v1',
  videoProgressesApi: '/api/onDemandVideoProgresses.v1',
  courseRootPath: path.join(rootPath, courseSlug),
  courseSlug,
  courseRolesWithTeachAccess: ['INSTRUCTOR', 'TEACHING_STAFF', 'UNIVERSITY_ADMIN', 'DATA_COORDINATOR'],

  courseRolesWithModeratorAccess: [
    'INSTRUCTOR',
    'TEACHING_STAFF',
    'UNIVERSITY_ADMIN',
    'DATA_COORDINATOR',
    'MENTOR',
    'COURSE_ASSISTANT',
  ],

  onboardModalStorageKey: 'showProfileModal:',

  // Items
  items: {
    gradableTypes: [
      'closedPeer',
      'exam',
      'gradedPeer',
      'gradedProgramming',
      'gradedLti',
      'phasedPeer',
      'programming',
      'splitPeerReviewItem',
      'staffGraded',
      'gradedDiscussionPrompt',
      'teammateReview',
      'wiseFlow',
      'placeholder',
    ],
    assessmentTypes: [
      'closedPeer',
      'gradedPeer',
      'phasedPeer',
      'splitPeerReviewItem',
      'quiz',
      'assessOpenSinglePage',
      'gradedProgramming',
      'programming',
      'ungradedProgramming',
      'ungradedLti',
      'ungradedWidget',
      'gradedLti',
      'peer',
      'exam',
      'staffGraded',
      'gradedDiscussionPrompt',
      'teammateReview',
    ],
  },

  // Assessments
  assessments: {
    defaultPassingFraction: 0.8,
  },

  // Assets: {
  assets: {
    rootPath: config.url.assets,
  },

  upload: {
    transloadit: {
      templates: {
        programming: '1683d830c1dd11e4a63a499495d4cf0f',
      },
    },
  },

  signatureTrack: {
    photoDisapproved: -1,

    verificationSubmitDelay: 1000,
    transitionToWebcamDuration: 3000,
    firefoxWebcamHelpImage: path.join(config.url.assets, '/images/signature/firefox_html5_webcam_help.png'),
    chromeWebcamHelpImage: path.join(config.url.assets, '/images/signature/chrome_html5_webcam_help.png'),
    webcamConstraintImage: path.join(config.url.assets, '/images/webcam/face_placeholder_L.png'),
    webcamConstraintImageWidthPercent: 16,
    webcamConstraintImageMarginPercent: 20,

    // Keystrokes thresholds
    keystroke: {
      errorAllowedPrefix: 2,
      errorAllowedSuffix: 5,
    },

    // Verification service responses
    verificationSteps: {
      keystrokes: 'KeystrokeRecognition',
      webcam: 'FaceRecognition',
      webcamManual: 'Delayed',
      authenticated: 'Success',
    },

    vcBannerImg: path.join(config.url.assets, '/images/open-course/cert_icon.png'),
    vcBannerImgLg: path.join(config.url.assets, '/images/open-course/cert_icon_lg.png'),
  },

  gallery: {
    maxTitleLength: 60,
  },

  // Progress Constants,
  progressCompleted: 'Completed',

  progressStarted: 'Started',
  progressNotStarted: 'NotStarted',
  vcLandingPagePath: path.join('/certificate', courseSlug),
  courseAdminPath: path.join('/teach', courseSlug),
  certLogoWithBlueBackground: path.join(config.url.assets, '/images/promos/cdp_cert_logo.png'),
  courseCertificateImage: 'http://s3.amazonaws.com/coursera_assets/certificates/coursecertificate.png',
  verifiedCertificateImage: path.join(config.url.assets, '/images/signature/template-cert-small.png'),
  vcLandingBulletOne: path.join(config.url.assets, '/images/open-course/LandingPage_BulletedNumbers_01.png'),
  vcLandingBulletTwo: path.join(config.url.assets, '/images/open-course/LandingPage_BulletedNumbers_02.png'),
  vcLandingBulletThree: path.join(config.url.assets, '/images/open-course/LandingPage_BulletedNumbers_03.png'),
  vcLandingLinkedInLogo: path.join(config.url.assets, '/images/open-course/linkedin_logo.png'),
  vcLandingLearnerPhoto: path.join(config.url.assets, '/images/open-course/Peter.png'),
  vcLandingCourseRecord: path.join(config.url.assets, '/images/open-course/CourseRecord.png'),
  vcLandingCourseCertificateRecord: path.join(config.url.assets, '/images/open-course/CourseCertificateExample.png'),

  // Admin Certificates
  verifiedCertificatePreviewPath: 'previewVerifiedCertificate',

  verifiedCertificateKeyType: 'OnDemandWithoutGrade',

  // Video Constants
  videoAutoPlay: true,

  // Percentage to deem that a video is completed
  videoEndPercentage: 0.9,

  // Default video player size
  // Video Player will automatically resize, these parameters aren't necessary
  // right now.
  defaultVideoPlayerWidth: '960px',

  defaultVideoPlayerHeight: '540px',

  // Default resolution for most countries
  defaultNormalBandwidthVideoPlayerResolution: '540p',

  // Default resolution for countries with low bandwidth
  defaultLowBandwidthVideoPlayerResolution: '360p',

  // Countries considered to have low bandwidth
  lowBandwidthCountries: ['CN', 'IN'],

  // This should never change
  videoPlayerAspectRatio: 9 / 16,

  // The minimum height is pretty small so that the video can resize to fit
  // small mobile screens.
  videoPlayerMinHeight: 240,

  // if playing the video from a specific time point,
  // we start the video earlier by this many seconds
  videoStartPlaybackDelay: 3,

  // Admin
  adminButtonsTopMargin: 30,

  adminJsonEditorDivTopMargin: 40,

  showLessonProgressBar: {
    development: ['childnutrition'],
    staging: ['childnutrition'],
    production: ['competitivestrategy'],
  },

  completionExperiment: {
    development: [
      'childnutrition', // childnutrition
    ],
    staging: [
      'childnutrition', // childnutrition
    ],
    production: [
      'calculus1', // calculus1
    ],
  },

  lockedAssessments: [
    'dUNIFe9gEeSIIyIAC7LOhg', // pds
  ],

  // Temporary consolidation of courseTypes until FLEX-2642
  courseTypes: {
    s12nPreEnroll: 's12nPreEnroll',
    s12nSession: 's12nSession',
    s12nOnDemand: 's12nOnDemand',
    preEnroll: 'preEnroll',
    sessions: 'sessions',
    certOnDemand: 'certOnDemand',
    onDemand: 'onDemand',
  },

  itemLockedReasonCodes: {
    PREMIUM: 'PREMIUM',
    RESIT: 'RESITTING_ITEM_LOCK_OVERRIDE',
    PASSABLE_ITEM_COMPLETION: 'PASSABLE_ITEM_COMPLETION',
    PREMIUM_ITEM: 'PREMIUM_ITEM',
    SESSION_PREVIEW: 'SESSION_PREVIEW',
    SESSION_ENDED: 'SESSION_ENDED',
    SESSION_ENDED_FOR_FLEXIBLE_SCHEDULE: 'SESSION_ENDED_FOR_FLEXIBLE_SCHEDULE',
    ENROLLMENT_PREVIEW: 'ENROLLMENT_PREVIEW',
    TIMED_RELEASE_CONTENT: 'TIMED_RELEASE_CONTENT', // locked due to it being outside of the timed availability window
  },

  itemLockedStatus: {
    LOCKED_FOR_SUBMITTING: 'LOCKED_FOR_SUBMITTING',
    LOCKED_FULLY: 'LOCKED_FULLY',
  },

  itemLockInfoTypeNames: {
    timedReleaseContentLockInfo: 'timedReleaseContentLockInfo',
  },

  transifexProjectBaseUrl: 'https://www.transifex.com/projects/p/',
};

export default exported;
export { config, rootPath, learnRoot, courseSlug };

export const {
  learnCoursePath,
  courseHomePath,
  teachRoot,
  adminEmailApi,
  openCourseApi,
  assessApi,
  assetApi,
  peerAssignmentApi,
  programmingAssignmentApi,
  openCourseMembershipApi,
  reportsApi,
  coursesApi,
  forumsApi,
  certificateApi,
  supplementCompletionApi,
  supplementStartApi,
  lectureVideosApi,
  videoProgressesApi,
  courseRootPath,
  courseRolesWithTeachAccess,
  courseRolesWithModeratorAccess,
  onboardModalStorageKey,
  items,
  assessments,
  assets,
  upload,
  signatureTrack,
  gallery,
  progressCompleted,
  progressStarted,
  progressNotStarted,
  vcLandingPagePath,
  courseAdminPath,
  certLogoWithBlueBackground,
  courseCertificateImage,
  verifiedCertificateImage,
  vcLandingBulletOne,
  vcLandingBulletTwo,
  vcLandingBulletThree,
  vcLandingLinkedInLogo,
  vcLandingLearnerPhoto,
  vcLandingCourseRecord,
  vcLandingCourseCertificateRecord,
  verifiedCertificatePreviewPath,
  verifiedCertificateKeyType,
  videoAutoPlay,
  videoEndPercentage,
  defaultVideoPlayerWidth,
  defaultVideoPlayerHeight,
  defaultNormalBandwidthVideoPlayerResolution,
  defaultLowBandwidthVideoPlayerResolution,
  lowBandwidthCountries,
  videoPlayerAspectRatio,
  videoPlayerMinHeight,
  videoStartPlaybackDelay,
  adminButtonsTopMargin,
  adminJsonEditorDivTopMargin,
  showLessonProgressBar,
  completionExperiment,
  lockedAssessments,
  courseTypes,
  itemLockedReasonCodes,
  itemLockedStatus,
  itemLockInfoTypeNames,
  transifexProjectBaseUrl,
} = exported;
