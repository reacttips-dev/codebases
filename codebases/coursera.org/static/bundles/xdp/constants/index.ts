import _t from 'i18n!nls/xdp';

import config from 'js/app/config';

export type FeaturedInfo = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
};

export const MOBILE_BREAKPOINT_PX = 768;
export const EXP_TOGGLABLE_CONTENT_HEIGHT_PX = 212;

export const GOOGLE_GATEWAY_CERT_IDS = [
  'child~L8zv1y16EeiOGQoLfyCjcg',
  'uvWXX6NMEem8VwqbwgpIcA',
  'QE4tKYGmEem2fgrSf7QW9A',
  'Z-5wCcbTEeqeNBKhfgCLyw',
  'kr43OcbTEeqeNBKhfgCLyw',
  'fq9UWMbTEeqpthJ2RmWGow',
];

export const GOOGLE_GATEWAY_CERTS_MONTHS_TO_LEARN = 6;
export const GOOGLE_GATEWAY_CERTS_HOURS_PER_WEEK = 10;

export const PRODUCTS = {
  course: 'COURSE',
  specialization: 'SPECIALIZATION',
} as const;

export const MIN_NUM_OF_SKILLS_TO_SHOW = 2;

export const BASE_META_IMAGE_URL = 'https://coursera_assets.s3.us-east-1.amazonaws.com/metatag-images/xdp-optimized';

export const META_IMAGE_EXTENSION = 'jpg';

export const XDP_CERTIFICATE_IMAGES = {
  [PRODUCTS.course]: `${config.url.resource_assets}growth/xdp/certificateCDP.jpg`,
  [PRODUCTS.specialization]: `${config.url.resource_assets}growth/xdp/certificateSDP.jpg`,
} as const;

export const XDP_EXPERTISE_ICONS = {
  instructor: `${config.url.resource_assets}xdp/expertise/icons/SvgInstructor.svg`,
  learners: `${config.url.resource_assets}xdp/expertise/icons/SvgMembers.svg`,
  courseBook: `${config.url.resource_assets}xdp/expertise/icons/SvgBook.svg`,
} as const;

export const XDP_EXPERTISE_EXPERIMENT_RATING_TYPES = {
  instructor: 'INSTRUCTOR',
  contentSatisfaction: 'CONTENT-SATISFACTION',
} as const;

export type RatingType = 'CONTENT-SATISFACTION' | 'INSTRUCTOR';

export const XDP_META_DESC_LENGTH_LIMIT = 160;
export const getXdpMetaDescriptionSuffix = () => _t('Enroll for free.');

export const productTypesTranslated = () => ({
  get COURSE() {
    return _t('course');
  },
  get SPECIALIZATION() {
    return _t('specialization');
  },
});

export const getDefaultBackgroundLevelCml = () => ({
  get BEGINNER() {
    return _t('No prior experience required.');
  },
  get INTERMEDIATE() {
    return _t('Some related experience required.');
  },
  get ADVANCED() {
    return _t('Designed for those already in the industry.');
  },
});

export const navItemsEnum = {
  about: 'about',
  instructorsTop: 'instructors-top',
  featured: 'featured',
  howItWorks: 'howItWorks',
  courses: 'courses',
  instructors: 'instructors',
  enroll: 'enroll',
  faq: 'faq',
  syllabus: 'syllabus',
  reviews: 'reviews',
  courseraPlus: 'courseraPlus',
};

export const BANNER_REVIEW_COUNT_EXPT = {
  CONTROL: 'control',
  SHOW_REVIEW_COUNT: 'show-review-count',
  SHOW_NOTHING: 'show-nothing',
};

/* eslint camelcase: ["error", {allow: ["gVpG7_yEEeijdwpv8TGaaA", "INwJmyYkEemBxQoEr_JuHA", "rUHfSakHEeeQ3gpuC4Fs_g", "jqiHLNbqEeeeugriPTTa_A"]}] */
export const getFeaturedData = (): Record<string, FeaturedInfo> => ({
  QEXoJRBmEeWhsgqB1eduww: {
    slug: 'happiness',
    get title() {
      return _t('Motivational Teaching');
    },
    get subtitle() {
      return _t('Learn from a dynamic instructor');
    },
    get description() {
      return _t(
        "Raj Raghunathan gives a practical and engaging lesson on how to lead a fulfilling life. You'll finish this course with a fresh outlook and smile on your face."
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/happiness.png`,
  },
  gVpG7_yEEeijdwpv8TGaaA: {
    slug: 'introduction-blockchain-technologies',
    get title() {
      return _t('Mind-expanding Perspective');
    },
    get subtitle() {
      return _t('Learn from a dynamic instructor');
    },
    get description() {
      return _t(
        "Don Tapscott, best-selling author and top-ranking Digital Thinker, brilliantly illuminates blockchain technology and how it's poised to transform every industry."
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/blockchain_course1.png`,
  },
  INwJmyYkEemBxQoEr_JuHA: {
    slug: 'transacting-blockchain',
    get title() {
      return _t('Industry Insights');
    },
    get subtitle() {
      return _t('Guest speakers share their experiences');
    },
    get description() {
      return _t(
        "Through video interviews, you'll hear what excites technology leaders about blockchain, how they are utilizing it today, and why they think it's revolutionary."
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/blockchain_course2.png`,
  },
  ER3aJiffEemfRQrtPorF0A: {
    slug: 'blockchain-business',
    get title() {
      return _t('Learning to Lead');
    },
    get subtitle() {
      return _t("Navigate blockchain's hype and potential");
    },
    get description() {
      return _t(
        'Put yourself in every role of the C-suite to understand key decisions leaders face as blockchain unfolds within a business.'
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/blockchain_course3.png`,
  },
  RQgakSffEemxwQ7aDvte0A: {
    slug: 'blockchain-opportunity-analysis',
    get title() {
      return _t('Real-world Project');
    },
    get subtitle() {
      return _t('Transform your business with blockchain');
    },
    get description() {
      return _t(
        "Create a Blockchain Opportunity Analysis customized for your organization. You'll finish this course with a high-impact plan to add to your business portfolio."
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/blockchain_course4.png`,
  },
  Clt2FokTEeiYQAqwENY34g: {
    slug: 'basic-data-processing-visualization-python',
    get title() {
      return _t('Understand the Basics');
    },
    get subtitle() {
      return _t('Process and visualize data');
    },
    get description() {
      return _t(
        'Ilkay Altintas and Julian McAuley concisely breakdown the fundamental concepts behind data products in this easy-to-follow course.'
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/python_course1.png`,
  },
  l4DXG4kSEeilVg59zCpqsg: {
    slug: 'design-thinking-predictive-analytics-data-products',
    get title() {
      return _t('Start Building');
    },
    get subtitle() {
      return _t('Design predictive models');
    },
    get description() {
      return _t(
        'Discover the fundamental concepts of statistical learning as you learn about the various methods of building predictive models.'
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/python_course2.png`,
  },
  '3VZYG4kSEeiCEBJK_HZFrg': {
    slug: 'meaningful-predictive-modeling',
    get title() {
      return _t('Advance Your Skills');
    },
    get subtitle() {
      return _t('Improve your predictive models');
    },
    get description() {
      return _t(
        'Evaluate and compare classifiers and performance measures for use in different regression and classification scenarios.'
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/python_course3.png`,
  },
  jqiHLNbqEeeeugriPTTa_A: {
    slug: 'deploying-machine-learning-models',
    get title() {
      return _t('Real-world Project');
    },
    get subtitle() {
      return _t('Deploy data products');
    },
    get description() {
      return _t('Use the tools and techniques required to deploy working recommender systems on real-world datasets.');
    },
    imageSrc: `${config.url.resource_assets}growth_featured/python_course4.png`,
  },
  '6MvmTJFlEeauIxKYfUIOvQ': {
    slug: 'compassionate-leadership-jane-goodall',
    get title() {
      return _t('Get Inspired');
    },
    get subtitle() {
      return _t('"The way she saw the world, changed the world."');
    },
    get description() {
      return _t(
        "Don't miss the opportunity to learn from the legendary Dr. Jane Goodall and understand how being a mission-driven individual can empower you and your community."
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/jane_goodall.png`,
  },
  p2jYHVPxEein9xItvIlMSA: {
    slug: 'intro-self-driving-cars',
    get title() {
      return _t('Tour a Self-Driving Car');
    },
    get subtitle() {
      return _t("Go beyond the driver's seat");
    },
    get description() {
      return _t(
        'Steven Waslander and Jonathan Kelly give you an in-depth look at a self-driving car that is fully equipped with a suite of radar, sonar, lidar, inertial, and vision sensors.'
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/sdc_course1.png`,
  },
  Hb0M4lPyEeiNrg7HoBf7gA: {
    slug: 'state-estimation-localization-self-driving-cars',
    get title() {
      return _t('Industry Insights');
    },
    get subtitle() {
      return _t('Guest speakers share their experiences');
    },
    get description() {
      return _t(
        "Through video interviews, you'll hear from engineers who are working on autonomous vehicle technology to understand what skills you need to advance in the industry."
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/sdc_course2.png`,
  },
  'Pr5NLlPyEei-RQ6pitSIHg': {
    slug: 'visual-perception-self-driving-cars',
    get title() {
      return _t('State-of-the-Art Teaching');
    },
    get subtitle() {
      return _t('Access ground-breaking research');
    },
    get description() {
      return _t(
        'Steven Waslander takes you through the importance of object detection in a 3D environment—complete with cars, pedestrians, trees, and weather.'
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/sdc_course3.png`,
  },
  'sx-y31PyEeiuag4cjofrng': {
    slug: 'motion-planning-self-driving-cars',
    get title() {
      return _t('Real-world Project');
    },
    get subtitle() {
      return _t('Learn in a highly realistic driving environment');
    },
    get description() {
      return _t(
        'Interact with data sets from an autonomous vehicle, build your own software stack for a self-driving car, and complete your final project using the CARLA simulator.'
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/sdc_course4.png`,
  },
  v9CQdBkhEeWjrA6seF25aw: {
    slug: 'modern-art-ideas',
    get title() {
      return _t('Inspiring and Elaborative Teaching');
    },
    get subtitle() {
      return _t('Expand your understanding of modern art');
    },
    get description() {
      return _t(
        "Through fascinating lectures and thought-provoking readings, you'll dive into ideas, themes, artists and movements that will give you a fresh perspective and new outlook."
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/modern_art_ideas.png`,
  },
  oEqrMXqhEear9RKoJLO5Cw: {
    slug: 'positive-psychology-methods',
    get title() {
      return _t('Informative and Insightful Teaching');
    },
    get subtitle() {
      return _t('Understand the concept of "Grit"');
    },
    get description() {
      return _t(
        'Combine research methods and design as you gain new perspectives on achieving success from two celebrity instructors and a host of guest lecturers.'
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/positive_psychology_methods.png`,
  },
  iQZflcZ7EeOoFhIxOQQuEA: {
    slug: 'childnutrition',
    get title() {
      return _t('Expert and Informative Teaching');
    },
    get subtitle() {
      return _t('Learn about nutrition and how to cook');
    },
    get description() {
      return _t(
        'Dr. Maya Adam breaks down complex concepts into simple, elementary blocks of information through creative illustration, cooking demo videos, and discussions.'
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/child_nutrition.png`,
  },
  bzhAuJ9sEeWJORITtzkPnQ: {
    slug: 'company-future-management',
    get title() {
      return _t('Real-world Projects');
    },
    get subtitle() {
      return _t('Take a novel approach to traditional case studies');
    },
    get description() {
      return _t(
        'Using technical concepts, Julian Birkinshaw provides a thought-provoking perspective on how to analyze modern business practices and find new ways to manage.'
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/company_future_management.png`,
  },
  rUHfSakHEeeQ3gpuC4Fs_g: {
    slug: 'the-science-of-well-being',
    get title() {
      return _t('Life-changing Tools');
    },
    get subtitle() {
      return _t("Experience Yale's most popular course");
    },
    get description() {
      return _t(
        `Through a series of unique "rewirements," you'll learn how to apply scientific principles to increase your own personal happiness.`
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/science_of_well_being.png`,
  },
  'tjqUXz-5EeWpogr5ZO8qxQ': {
    slug: 'global-financial-crisis',
    get title() {
      return _t('Insider Perspective');
    },
    get subtitle() {
      return _t('Blend financial theory with practical experience');
    },
    get description() {
      return _t(
        'Learn lessons from the 2008 financial crisis, as told by featured guest lecturer Timothy Geithner, former U.S. Secretary of Treasury.'
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/global_financial_crisis.png`,
  },
  Ux2WtmBXEemE2Q6eJy4pcg: {
    slug: 'wharton-fintech-overview-payments-regulations',
    get title() {
      return _t('Insightful Teaching');
    },
    get subtitle() {
      return _t('Learn from expert instructors');
    },
    get description() {
      return _t(
        'Natasha Sarin and Chris Geczy introduce you to the various ways technological innovations in finance are playing a role in the future of investing.'
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/fintech_course1.png`,
  },
  gTB3hmBTEemmohK7SwfByg: {
    slug: 'wharton-cryptocurrency-blockchain-introduction-digital-currency',
    get title() {
      return _t('Real-world Applications');
    },
    get subtitle() {
      return _t('Understand the intricacies of financial technologies');
    },
    get description() {
      return _t(
        'Develop effective strategies to begin incorporating cryptocurrency into your investment plans through in-depth video lectures and quizzes.'
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/fintech_course2.png`,
  },
  '0BhbnWBTEemJSwqhjZsp9g': {
    slug: 'wharton-crowdfunding-marketplace-lending-modern-investing',
    get title() {
      return _t('Cutting-edge Topics');
    },
    get subtitle() {
      return _t('Optimize your portfolio while managing risk');
    },
    get description() {
      return _t(
        'Follow David Musto as you uncover fundamental frameworks around crowd funding, robo-advising, and marketplace lending.'
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/fintech_course3.png`,
  },
  'ncl-_2BXEemlLwq5e4U1PA': {
    slug: 'wharton-ai-application-insurtech-real-estate-technology',
    get title() {
      return _t('Industry Insights');
    },
    get subtitle() {
      return _t('Guest speakers share their experiences');
    },
    get description() {
      return _t(
        'Learn how the insurance and real-estate landscapes are being transformed by fintech solutions with Warren Pennington from Vanguard.'
      );
    },
    imageSrc: `${config.url.resource_assets}growth_featured/fintech_course4.png`,
  },
});
