import moment from 'moment';

import { LONG_DATE_ONLY_DISPLAY, formatDateTimeDisplay } from 'js/utils/DateTimeUtils';
import _ from 'lodash';
import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import config from 'js/app/config';
import language from 'js/lib/language';
import path from 'js/lib/path';
import NaptimeResource from './NaptimeResource';

/**
 * @deprecated
 * Use courseTypeMetadata.v1 instead
 */
type RhymeProjectMetadata = {
  rhymeProject: {
    typeNameIndex: string;
  };
};

/**
 * @deprecated
 * Use courseTypeMetadata.v1 instead
 */
type StandardCourseMetadata = {
  standardCourse: {
    typeNameIndex: string;
  };
};

/**
 * @deprecated
 * Use courseTypeMetadata.v1 instead
 */
type CourseTypeMetadata = StandardCourseMetadata | RhymeProjectMetadata;

class Course extends NaptimeResource {
  static RESOURCE_NAME: 'courses.v1' = 'courses.v1';

  static RECENT_COURSE_CUTOFF = 7;

  static sortCourses = function (courses: Array<any>, options?: { boostPrimaryLanguage?: boolean }) {
    const recentCutoff = moment().subtract(Course.RECENT_COURSE_CUTOFF, 'days');
    const boostPrimaryLanguage = options && options.boostPrimaryLanguage;

    const onDemandCourses = courses.filter((course) => course.isOnDemand);

    const upcomingCourses = _.sortBy(
      _.filter(courses, (course) => course.startMoment && course.startMoment.isAfter(recentCutoff)),
      (course) => course.startMoment
    );

    const pastCourses = _.sortBy(
      _.filter(courses, (course) => course.startMoment && course.startMoment.isBefore(recentCutoff)),
      (course) => -1 * course.startMoment
    );

    const coursesWithoutStartDate = courses.filter((course) => course.startMoment === undefined);

    const activeCourses = _.union(onDemandCourses, upcomingCourses);
    const activeCoursesInSelectLanguage = boostPrimaryLanguage
      ? activeCourses.filter(
          (course) => course.primaryLanguages && course.primaryLanguages.indexOf(language.getLanguageCode()) > -1
        )
      : activeCourses;

    return _.union(activeCoursesInSelectLanguage, activeCourses, pastCourses, coursesWithoutStartDate);
  };

  // These properties are always included.
  slug!: string;

  id!: string;

  name!: string;

  courseType!: string;

  // These properties must be requested.
  courseStatus!: 'preenroll' | 'draft' | 'launched' | 'inactive' | void;

  certificates?: Array<any>;

  description?: string;

  premiumExperienceVariant?: string;

  headerImageUrl?: string;

  photoUrl?: string;

  startDate?: number;

  upcomingSessionStartDate?: number;

  faqs?: Array<Record<string, any> | string>;

  promoPhoto?: string;

  s12nIds?: Array<string>;

  partnerIds?: Array<string>;

  targetAudience?: string;

  instructorIds?: Array<string>;

  workload?: string;

  primaryLanguages?: Array<string>;

  subtitleLanguages?: Array<string>;

  domainTypes?: Array<any>;

  hardwareRequirement?: string;

  level?: string;

  courseMode?: string;

  plannedLaunchDate?: string;

  display?: boolean;

  /**
   * @deprecated
   * This field does not exist on courses.v1. courseTypeMetadata is a separate resource.
   * If you are using graphql to fetch for course and courseTypeMetadata then generate the type
   * for your query. Don't rely on this.
   */
  courseTypeMetadata?: { courseTypeMetadata: CourseTypeMetadata };

  @requireFields('slug')
  get link(): string {
    return path.join('/', this.isOnDemand ? 'learn' : 'course', this.slug);
  }

  @requireFields('link')
  get fullLink(): string {
    return path.join(config.url.base, this.link);
  }

  /**
   * Link to the learning home for phoenix courses
   */
  @requireFields('slug', 'courseStatus')
  get learnerPhoenixHomeLink(): string {
    return this.isPreEnroll ? this.link : path.join(this.link, 'home', 'welcome');
  }

  @requireFields('slug')
  get phoenixHomeLink(): string {
    return path.join(this.link, 'home', 'welcome');
  }

  /**
   * Link to the learning home
   */
  @requireFields('slug')
  get homeLink(): string {
    return this.isOnDemand ? this.phoenixHomeLink : this.link;
  }

  /**
   * Link to the course admin
   */
  @requireFields('slug')
  get teachLink(): string | null {
    return this.isOnDemand ? path.join('/teach', this.slug) : null;
  }

  @requireFields('courseStatus')
  get isPreEnroll(): boolean {
    return this.courseStatus === 'preenroll';
  }

  @requireFields('courseStatus')
  get isDraft(): boolean {
    return this.courseStatus === 'draft';
  }

  @requireFields('certificates')
  get hasCert(): boolean {
    return !_.isEmpty(this.certificates || []);
  }

  /**
   * Returns the minimum length string that is 1) 60+ characters and 2) a full sentence.
   */
  @requireFields('description')
  get desc60(): string | undefined {
    const descLen = 60;
    if (this.description && this.description.length > descLen && this.description.indexOf('.', descLen) !== -1) {
      return this.description.slice(0, this.description.indexOf('.', descLen) + 1);
    } else {
      return this.description;
    }
  }

  /**
   * Flags whether or not course is Premium Grading
   * @return {boolean} true if course is Premium Grading, false otherwise
   */
  @requireFields('premiumExperienceVariant', 'certificates')
  get isPremiumGrading(): boolean {
    return _.includes(this.certificates || [], 'VerifiedCert') && this.premiumExperienceVariant === 'PremiumGrading';
  }

  /**
   * Flags whether or not course is Closed Course
   * @return {boolean} true if course is Closed Course, false otherwise
   */
  @requireFields('premiumExperienceVariant', 'certificates')
  get isClosedCourse(): boolean {
    return _.includes(this.certificates || [], 'VerifiedCert') && this.premiumExperienceVariant === 'PremiumCourse';
  }

  @requireFields('courseStatus')
  get isLaunched(): boolean {
    return this.courseStatus === 'launched';
  }

  @requireFields('photoUrl', 'headerImageUrl')
  get headerImageOrPhotoUrl(): string | undefined {
    return this.headerImageUrl || this.photoUrl;
  }

  @requireFields('courseStatus')
  get isInactive(): boolean {
    return this.courseStatus === 'inactive';
  }

  @requireFields('courseType')
  get isSpark(): boolean {
    return this.courseType != null && this.courseType.indexOf('v1') === 0;
  }

  @requireFields('courseType')
  get isCapstone(): boolean {
    return this.courseType === 'v2.capstone';
  }

  /**
   * Suitable for icon display, across all "offering" resource types
   * @return {String} URL to an icon representing this offering
   */
  @requireFields('photoUrl')
  get iconSrc(): string | undefined {
    return this.photoUrl;
  }

  @requireFields('courseType')
  get isOnDemand(): boolean {
    return this.courseType === 'v2.ondemand' || this.courseType === 'v2.capstone';
  }

  @requireFields('startDate')
  get hasStarted(): boolean {
    const { startDate } = this;
    if (startDate != null) {
      return moment().isAfter(startDate);
    }

    return false;
  }

  @requireFields('upcomingSessionStartDate')
  get hasRunningSession(): boolean {
    const { upcomingSessionStartDate } = this;
    if (upcomingSessionStartDate != null) {
      return moment().isAfter(upcomingSessionStartDate);
    } else {
      return false;
    }
  }

  @requireFields('startDate')
  get startMoment(): moment.Moment | null {
    return this.startDate != null ? moment.utc(this.startDate) : null;
  }

  @requireFields('upcomingSessionStartDate')
  get upcomingSessionStartDateString(): string | null {
    return this.upcomingSessionStartDate != null
      ? formatDateTimeDisplay(this.upcomingSessionStartDate, LONG_DATE_ONLY_DISPLAY)
      : null;
  }

  @requireFields('display')
  get isPublic(): boolean {
    return this.display === true;
  }

  static bySessionId(sessionId: string, fields: Array<string> = []) {
    return this.finder(
      'sessionId',
      {
        params: { sessionId },
        fields,
      },
      (sessions) => sessions[0]
    );
  }

  static bySlug(courseSlug: string, opts: { [key: string]: string | number | boolean | Array<string> }) {
    return this.finder(
      'slug',
      Object.assign(
        {
          params: {
            slug: courseSlug,
            showHidden: true,
          },
        },
        opts
      ),
      (courses) => courses[0]
    );
  }
}

export default Course;
