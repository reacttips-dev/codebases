import type S12nProductVariants from 'bundles/s12n-common/constants/s12nProductVariants';
import type UserAgentInfo from 'js/lib/useragent';

export enum ProductVariant {
  NormalS12n = 'NormalS12n',
  ProfessionalCertificateS12n = 'ProfessionalCertificateS12n',
  BachelorsDegree = 'BachelorsDegree',
  MastersDegree = 'MastersDegree',
  Mastertrack = 'MasterTrack',
  OnCampusProgram = 'OnCampusProgram',
}

export type Course = {
  id: string;
  name: string;
  slug: string;
  isPreEnroll?: boolean;
  isClosedCourse?: boolean;
};

export type AboutSectionTogglableContentProps = {
  skillsAndLearningObjExist?: boolean;
  userAgent: UserAgentInfo;
  trackingName: string;
  children?: React.ReactElement | string;
  renderedContentClassName: string;
};

export type PRODUCT_TYPE = 'COURSE' | 'SPECIALIZATION';

// based on SDPPageQuery_XdpV1Resource_slug_elements_xdpMetadata_XdpV1_sdpMetadataMember_sdpMetadata_partners
// from 'bundles/xdp/components/__generated__/SDPPageQuery'
export type Partner = {
  id: number;
  name: string;
  shortName: string;
  partnerMarketingBlurb: string | null;
  logo: string | null;
  landingPageBanner: string | null;
  description: string | null;
  squareLogo: string | null;
  rectangularLogo: string | null;
  primaryColor: string | null;
  productBrandingLogo: string | null;
};

// based on SDPPageQuery_XdpV1Resource_slug_elements_xdpMetadata_XdpV1_sdpMetadataMember_sdpMetadata_instructors
// from 'bundles/xdp/components/__generated__/SDPPageQuery'
export type InstructorType = {
  id: string;
  title: string | null;
  fullName: string | null;
  photo: string | null;
  shortName: string | null;
  department: string | null;
  learnersReached: number | null;
  coursesTaught: number | null;
  isTopInstructor: boolean | null;
};

export type Domain = {
  domainId: string;
  domainName: string;
  subdomainId?: string | null;
  subdomainName?: string | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Data = Record<string, any>; // Block Data can be any shape

export type BlockType = 'ENG' | 'TEMPLATE' | 'GRID' | 'SIMPLE';

export type Block = {
  id: string;
  type: BlockType;
  componentName: string;
  config: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export type PageBlockData = {
  id: string;
  name: string;
  block: Block;
  blockData: Data;
};

export type PageConfig = {
  config: {
    componentName: string;
  };
  pageBlockData: Array<PageBlockData>;
  pageBlockDataOrders: Array<string>;
};

export type MDP_API_DATA = {
  name: string;
};

export type Specialization = {
  name: string;
  slug: string;
  id: string;
  description: string;
  courses: Array<Course>;
  courseCount: number;
  partners: Array<Partner>;
  productVariant: keyof typeof S12nProductVariants;
  isProfessionalCertificate: boolean;
};

export type Degree = {
  name: string;
  shortName?: string;
  slug: string;
  headerImage?: string;
  productVariant?: ProductVariant;
};

export type StoredDegree = {
  degree: Degree;
};

// based on SDPPageQuery_XdpV1Resource_slug_elements_xdpMetadata_XdpV1_sdpMetadataMember_sdpMetadata_courses_ratings
// from 'bundles/xdp/components/__generated__/SDPPageQuery'
export type Ratings = {
  averageFiveStarRating: number | null;
  commentCount: number | null;
  ratingCount: number | null;
};

export type DifficultyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export type XDPRatingsType = {
  isThemeDark?: boolean;
  starsColor?: string;
  ratingColor?: string;
  shouldUnderlineStars?: boolean;
  isCDPPage?: boolean;
  isSDPPage?: boolean;
  sectionName?: string;
  shouldShowReviews?: boolean;
  addAsteriskToRatingCount?: boolean;
};

export type RatingsObject = {
  averageFiveStarRating?: number;
  ratingCount?: number;
  commentCount?: number;
};

// extends SDPPageQuery_XdpV1Resource_slug_elements_xdpMetadata_XdpV1_sdpMetadataMember_sdpMetadata_courses_ratings
// from 'bundles/xdp/components/__generated__/SDPPageQuery'
export type RatingsType = {
  averageFiveStarRating: number | null;
  ratingCount: number | null;
  commentCount: number | null;
  rootClassName?: string;
  a11yIdentifier?: string;
  addAsteriskToRatingCount?: boolean;
};

export type ReviewHighlight = {
  highlightText: string;
  reviewcount: number;
};

export type Testimonial = {
  authorName?: string;
  comment?: string;
  credential?: string;
  job?: string;
};

export type LearningOutcome = {
  careerOutcomeNewCareer: number;
  careerOutcomePayIncrease: number;
  tangibleCareerOutcome: number;
  isPositionedAtGlance?: boolean;
};

export type S12nGlanceItem = {
  icon: string;
  iconTitle?: string | React.ReactElement;
  title: string | React.ReactElement;
  subtitle?: string | React.ReactElement;
  hasBottomBorder?: boolean;
};

export type NavItemsMap = Map<string, { name: string; label: string } | undefined>;

export type HtmlFaqPair = {
  question: string;
  answer: string;
};

export type PrivateSessionDates = {
  courseId: string;
  session: { startsAt: number; endsAt: number };
};

export type EnterpriseProductConfiguration = {
  isSelectedForCredit?: boolean;
  isRecommendedForCredit?: boolean;
  hasMultipleOfferings?: boolean;
};
