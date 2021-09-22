import _ from 'lodash';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import Course from 'pages/open-course/common/models/course';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import CourseMaterials from 'pages/open-course/common/models/courseMaterials';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { getCourseModeOverride, courseModes } from 'bundles/ondemand/utils/courseModeOverrideUtils';
import { premiumExperienceVariants } from 'bundles/payments/common/constants';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { GradePolicy } from 'bundles/ondemand/constants/Constants';
import path from 'js/lib/path';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';

import { GradedAssignmentGroupNormalized } from 'bundles/learner-progress/types/GradedAssignmentGroup';
import { CourseType, CourseTypeMetadata } from 'bundles/naptimejs/resources/courseTypeMetadata.v1';

const SERIALIZED_PROPS: (keyof CourseStore$DehydratedState)[] = [
  'loaded',
  'courseIdentifiersLoaded',
  'domains',
  'courseId',
  'courseSlug',
  'courseCertificates',
  'courseTypeMetadata',
  'rawCourseMaterials',
];

type CourseStore$DehydratedState = {
  loaded: boolean;
  courseIdentifiersLoaded: boolean;
  domains: any;
  courseId: string;
  courseSlug: string;
  courseCertificates: Array<string>;
  courseTypeMetadata: CourseTypeMetadata;
  rawCourseMaterials: any;
};

/**
 * This store is intended to encapsulate any and all questions
 * regarding the materials and metadata of a course.
 */
class CourseStore extends BaseStore implements CourseStore$DehydratedState {
  static storeName = 'CourseStore';

  static handlers = {
    LOAD_COURSE_MATERIALS: 'onLoadMaterials',
    LOAD_COURSE_SCHEDULE: 'onLoadCourseSchedule',
    LOAD_DOMAINS: 'onLoadDomains',
    SET_COURSE_IDENTIFIERS: 'onSetCourseIdentifiers',
  };

  onLoadCourseSchedule() {
    this.dispatcher.waitFor('CourseScheduleStore', () => {
      this.setModuleWeeks();
    });
  }

  onLoadDomains(domains: $TSFixMe /* TODO: type domains */) {
    this.domains = domains;
    this.emitChange();
  }

  onSetCourseIdentifiers({
    courseId,
    courseSlug,
    courseCertificates,
    courseTypeMetadata,
  }: {
    courseId: string;
    courseSlug: string;
    courseCertificates: Array<string>;
    courseTypeMetadata: CourseTypeMetadata;
  }) {
    this.courseId = courseId;
    this.courseSlug = courseSlug;
    this.courseCertificates = courseCertificates;
    this.courseTypeMetadata = courseTypeMetadata;
    this.courseIdentifiersLoaded = true;
    this.emitChange();
  }

  loaded = false;

  courseIdentifiersLoaded = false;

  domains: any;

  courseId!: string;

  courseSlug!: string;

  courseCertificates!: Array<string>;

  courseTypeMetadata!: CourseTypeMetadata;

  rawCourseMaterials: any = {};

  materials: any = new CourseMaterials({}, { course: new Course() });

  dehydrate(): CourseStore$DehydratedState {
    return _.pick(this, ...SERIALIZED_PROPS);
  }

  rehydrate(state: CourseStore$DehydratedState) {
    Object.assign(this, _.pick(state, ...SERIALIZED_PROPS));
    this.initializeMaterials();
  }

  onLoadMaterials({ rawCourseMaterials }: { rawCourseMaterials: any }) {
    this.loaded = true;
    this.rawCourseMaterials = rawCourseMaterials;

    this.initializeMaterials();
  }

  initializeMaterials() {
    const { courseData, courseMaterialsData } = this.rawCourseMaterials;
    const course = new Course(courseData, { parse: true });

    this.materials = new CourseMaterials(courseMaterialsData, {
      course,
      parse: true,
    });

    // NOTE: non-react exam pages depend on weeks to be set up.
    // can remove once converted to react.
    // emitChange happens in setModuleWeeks()
    this.setModuleWeeks();
  }

  setModuleWeeks() {
    const schedule = this.dispatcher.getStore('CourseScheduleStore').getSchedule();

    this.getMaterials()
      .getModules()
      .forEach((module: $TSFixMe /* TODO: type CourseMaterials */) => {
        module.set('week', schedule.getWeekForModuleId(module.get('id')));
      });

    this.emitChange();
  }

  hasLoaded(): boolean {
    return this.loaded;
  }

  haveCourseIdentifiersLoaded(): boolean {
    return this.courseIdentifiersLoaded;
  }

  getCourseId(): string {
    return this.courseId;
  }

  getCourseSlug(): string {
    return this.courseSlug;
  }

  getCourseName(): string {
    return this.materials.get('course.name');
  }

  getRootPath(): '/learn' {
    return '/learn';
  }

  getCourseRootPath(): string {
    return path.join('/learn', this.courseSlug);
  }

  getCourseAdminPath(): string {
    return path.join('/teach', this.courseSlug);
  }

  getModule(moduleId: string): any {
    return this.materials.getModules().get(moduleId);
  }

  getMaterials(): any {
    return this.materials;
  }

  hasSessions(): boolean {
    return this.getMetadata().hasSessions();
  }

  hasLaunched(): boolean {
    return this.getMetadata().hasLaunched();
  }

  isReal(): boolean {
    return this.getMetadata().get('isReal');
  }

  isGuidedProject(): boolean {
    return this.courseTypeMetadata && this.courseTypeMetadata.typeName === CourseType.RHYME_PROJECT;
  }

  getMetadata(): any {
    if (this.materials) {
      return this.materials.get('course');
    }

    return undefined;
  }

  getWeekMaterials(week: number): any {
    if (this.materials) {
      return this.materials.getRequiredModules().at(week - 1);
    }

    return undefined;
  }

  isCumulativeGradePolicy() {
    return !!this.getGradePolicy()[GradePolicy.CUMULATIVE];
  }

  isMasteryGradePolicy() {
    return !!this.getGradePolicy()[GradePolicy.MASTERY];
  }

  isMixedGradePolicy() {
    return this.isCumulativeGradePolicy() && this.hasItemsRequiredForPassing();
  }

  /*
   * TODO (@sgogia)
   * This should be part of the backend!!
   * This is business logic on the frontend!!
   */
  getGradePolicyType(): 'mixed' | 'cumulative' | 'mastery' {
    if (this.isMixedGradePolicy()) {
      return 'mixed';
    }
    if (this.isCumulativeGradePolicy()) {
      return 'cumulative';
    }
    return 'mastery';
  }

  getGradePolicy() {
    return this.materials.get('gradePolicy');
  }

  getGradingParameters() {
    return this.materials.get('gradingParameters');
  }

  hasItemsRequiredForPassing() {
    return (
      this.materials
        .getGradableItemMetadatas()
        .filter((itemMetadata: $TSFixMe /* TODO: type CourseMaterials */) => itemMetadata.isPassRequiredForCourse())
        .length > 0
    );
  }

  getPassingThreshold() {
    return this.isCumulativeGradePolicy() ? this.getGradePolicy()[GradePolicy.CUMULATIVE].passingThreshold : undefined;
  }

  /**
   * @returns {Instructors} Instructors who should be displayed (e.g. on the CDP)
   */
  getInstructorsToDisplay(): any {
    if (this.materials && this.getMetadata().get('instructors')) {
      return this.getMetadata()
        .get('instructors')
        .filter((instr: $TSFixMe /* TODO: type CourseMaterials */) => instr.shouldDisplay());
    }

    return undefined;
  }

  isPreEnrollEnabledForCourse(): boolean {
    return this.getMetadata().isPreEnrollEnabled();
  }

  isPreEnrollEnabledForUser(): boolean {
    const isEnrolled = this.dispatcher.getStore('CourseMembershipStore').isEnrolled();

    return (
      !isEnrolled &&
      this.isPreEnrollEnabledForCourse() &&
      (!getCourseModeOverride() || getCourseModeOverride() === courseModes.PRE_ENROLL)
    );
  }

  isSubtitleTranslationEnabledForCourse(): boolean {
    return this.getMetadata().getIsSubtitleTranslationEnabled();
  }

  hasGradableItems(): boolean | undefined {
    if (this.materials) {
      return this.materials.getGradableItemMetadatas().length > 0;
    }

    return undefined;
  }

  getGradableItems(): any {
    if (this.materials) {
      return this.materials.getGradableItemMetadatas();
    }

    return undefined;
  }

  getGradableItemCount(): number {
    const gradableItems = this.getGradableItems();
    return gradableItems && gradableItems.length ? gradableItems.length : 0;
  }

  hasPeerReviewAssignments(): boolean {
    const peerReviewMaterials = this.materials.getPeerReviewItemMetadatas();
    return !!peerReviewMaterials.models.length;
  }

  getCoreGradableItems(): any {
    if (this.materials) {
      const gradableItems = this.getGradableItems();
      const coreItems = gradableItems.filter((itemMetadata: $TSFixMe /* TODO: type CourseMaterials */) =>
        itemMetadata.isCore()
      );
      return coreItems;
    }

    return undefined;
  }

  getHonorsGradableItems(): any {
    if (this.materials) {
      const gradableItems = this.getGradableItems();
      const honorsItems = gradableItems.filter((itemMetadata: $TSFixMe /* TODO: type CourseMaterials */) =>
        itemMetadata.isHonors()
      );
      return honorsItems;
    }

    return undefined;
  }

  getGradedAssignmentGroups(): Array<GradedAssignmentGroupNormalized> {
    const { gradedAssignmentGroups } = this.getGradingParameters();
    const gradedAssignmentGroupIds = Object.keys(gradedAssignmentGroups);
    return gradedAssignmentGroupIds.map((id) => {
      const gradedAssignmentGroup = gradedAssignmentGroups[id];
      return { id, ...gradedAssignmentGroup };
    });
  }

  hasTeamAssignments(): boolean {
    const teamAssignmentsMaterials = this.materials.getTeamAssignmentMetadata();
    return !!teamAssignmentsMaterials.models.length;
  }

  hasProgrammingAssignments(): boolean {
    const programmingMaterials = this.materials.getProgrammingItemMetadatas();
    return !!programmingMaterials.models.length;
  }

  isFirstPeerReview(peerReviewId: string): boolean {
    if (this.materials) {
      const peerReviewMaterials = this.materials.getPeerReviewItemMetadatas();
      if (peerReviewMaterials.models.length) {
        return peerReviewMaterials.models[0].get('id') === peerReviewId;
      }
    }

    return false;
  }

  isFirstProgrammingAssignment(progAssignmentId: string): boolean {
    if (this.materials) {
      const progMaterials = this.materials.getProgrammingItemMetadatas();
      if (progMaterials.models.length) {
        return progMaterials.models[0].get('id') === progAssignmentId;
      }
    }

    return false;
  }

  getDomainTypes(): any {
    if (this.materials && this.domains && this.domains.length > 0) {
      return this.materials
        .get('course.domainTypes')
        .map((domainType: $TSFixMe /* TODO: type CourseMaterials */) =>
          this.domains.find((domain: $TSFixMe /* TODO: type CourseMaterials */) => domain.id === domainType.domainId)
        );
    }

    return undefined;
  }

  isClosedCourse(): boolean {
    const premiumExperienceVariant = this.materials.get('course.premiumExperienceVariant');
    return !!(premiumExperienceVariant && premiumExperienceVariant === premiumExperienceVariants.premiumCourse);
  }

  hasCertificates(): boolean {
    return this.courseCertificates && this.courseCertificates.length > 0;
  }

  getTotalGradingWeight(): number {
    return this.materials.get('totalGradingWeight');
  }
}

export default CourseStore;
