/* Defines the model for an AuthoringCourse */
import Partner from 'bundles/author-common/models/Partner';
import type { PremiumExperience } from 'bundles/naptimejs/resources/__generated__/OnDemandSpecializationsV1';
import type { AuthoringCourseAssetLibraryAccessibilitySettings } from 'bundles/naptimejs/resources/__generated__/AuthoringCoursesV2';

export class AuthoringCourse {
  id: string;

  description?: string;

  domainTypes?: Array<{ subdomainId?: string; domainId?: string }>;

  faqs?: Array<{
    question: string;
    answer: string;
  }>;

  hardwareRequirement?: string;

  headerImage?: string;

  instructorIds?: Array<number>;

  isPrivate?: boolean;

  isReal?: boolean;

  assetLibraryAccessibilitySettings?: AuthoringCourseAssetLibraryAccessibilitySettings;

  isRestrictedMembership?: boolean;

  isLimitedToEnterprise?: boolean; // whether only available in the Enterprise catalog for organizations

  isSubtitleTranslationEnabled?: boolean;

  isVerificationEnabled?: boolean;

  learningObjectives?: Array<string>;

  launchedAt?: number | undefined;

  name: string;

  overridePartnerLogos?: Record<string, string>;

  partners?: Array<Partner>;

  partnerIds: Array<number>;

  premiumExperiences?: Array<PremiumExperience>;

  previewUserIds?: Array<string>;

  primaryLanguageCodes?: Array<string>;

  promoPhoto?: { bucket?: string; key?: string };

  s3Prefix?: string;

  sessionSchedule?: {
    repeatFrequency?: {
      typeName?: string;
      definition?: {
        dayOfWeek?: number;
        n?: number;
      };
    };
    postStartEnrollmentDuration?: number;
    startsOn?: number;
  };

  sessionsEnabledAt?: number | undefined;

  slug: string;

  subtitleLanguageCodes?: Array<string>;

  verificationEnabledAt?: number;

  constructor({
    description = '',
    domainTypes = [],
    faqs = [],
    hardwareRequirement = '',
    headerImage = '',
    id = '',
    instructorIds = [],
    isPrivate = false,
    isReal = false,
    assetLibraryAccessibilitySettings = undefined,
    isRestrictedMembership = false,
    isLimitedToEnterprise = false,
    isSubtitleTranslationEnabled = false,
    isVerificationEnabled = false,
    learningObjectives = [],
    launchedAt = undefined,
    name = '',
    overridePartnerLogos = {},
    partners = [],
    partnerIds = [],
    premiumExperiences = [],
    previewUserIds = [],
    primaryLanguageCodes = [],
    promoPhoto,
    s3Prefix = '',
    sessionSchedule = {},
    sessionsEnabledAt = undefined,
    slug = '',
    subtitleLanguageCodes = [],
    verificationEnabledAt = undefined,
  }: AuthoringCourseRaw) {
    this.description = description;
    this.domainTypes = domainTypes;
    this.faqs = faqs;
    this.hardwareRequirement = hardwareRequirement;
    this.headerImage = headerImage;
    this.id = id;
    this.isPrivate = isPrivate;
    this.isReal = isReal;
    this.assetLibraryAccessibilitySettings = assetLibraryAccessibilitySettings;
    this.isRestrictedMembership = isRestrictedMembership;
    // whether only available in the Enterprise catalog for organizations
    this.isLimitedToEnterprise = isLimitedToEnterprise;
    this.isSubtitleTranslationEnabled = isSubtitleTranslationEnabled;
    this.isVerificationEnabled = isVerificationEnabled;
    this.launchedAt = launchedAt;
    this.learningObjectives = learningObjectives;
    this.name = name;
    this.overridePartnerLogos = overridePartnerLogos;
    this.partners = partners && partners.map((partner) => new Partner(partner));
    this.partnerIds = partnerIds;
    this.instructorIds = instructorIds;
    this.premiumExperiences = premiumExperiences;
    this.previewUserIds = previewUserIds;
    this.primaryLanguageCodes = primaryLanguageCodes;
    this.promoPhoto = promoPhoto;
    this.s3Prefix = s3Prefix;
    this.sessionSchedule = sessionSchedule;
    this.sessionsEnabledAt = sessionsEnabledAt;
    this.slug = slug;
    this.subtitleLanguageCodes = subtitleLanguageCodes;
    this.verificationEnabledAt = verificationEnabledAt;
  }

  /**
   * Returns the universities field used in CourseAuthoringTool
   */
  get universities(): Array<Partner> | undefined {
    return this.partners;
  }

  /**
   * Mimics backbone get function to preserve backward compatibility
   */
  get(fieldName: keyof this) {
    return this[fieldName];
  }

  get isLaunched(): boolean {
    return !!this.launchedAt && this.launchedAt <= Date.now();
  }
}

// all properties here are optional because we have several partial usages of using AuthoringCourse,
// such as updating course settings where only a small subset of these are needed.
export type AuthoringCourseRaw = {
  id?: string;

  description?: string;

  domainTypes?: Array<{ subdomainId: string; domainId: string }>;

  faqs?: Array<{
    question: string;
    answer: string;
  }>;

  hardwareRequirement?: string;

  headerImage?: string;

  instructorIds?: Array<number>;

  isPrivate?: boolean;

  isReal?: boolean;

  assetLibraryAccessibilitySettings?: AuthoringCourseAssetLibraryAccessibilitySettings;

  isRestrictedMembership?: boolean;

  isLimitedToEnterprise?: boolean; // whether only available in the Enterprise catalog for organizations

  isSubtitleTranslationEnabled?: boolean;

  isVerificationEnabled?: boolean;

  learningObjectives?: Array<string>;

  launchedAt?: number | undefined;

  name?: string;

  overridePartnerLogos?: Record<string, string>;

  partners?: Array<Partner>;

  partnerIds?: Array<number>;

  premiumExperiences?: Array<PremiumExperience>;

  previewUserIds?: Array<string>;

  primaryLanguageCodes?: Array<string>;

  promoPhoto?: { bucket?: string; key?: string };

  s3Prefix?: string;

  sessionSchedule?: {
    repeatFrequency?: {
      typeName?: string;
      definition?: {
        dayOfWeek?: number;
        n?: number;
      };
    };
    postStartEnrollmentDuration?: number;
    startsOn?: number;
  };

  sessionsEnabledAt?: number | undefined;

  slug?: string;

  subtitleLanguageCodes?: Array<string>;

  verificationEnabledAt?: number;

  betaTestingSchedule?: { startedAt?: number } | null;
};

export default AuthoringCourse;
