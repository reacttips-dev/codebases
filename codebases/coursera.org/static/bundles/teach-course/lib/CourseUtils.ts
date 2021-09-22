import type { AuthoringCourse, AuthoringCourseRaw } from 'bundles/author-common/models/AuthoringCourse';

import type { Course, PlaceholderCourse } from 'bundles/admin/constants/types';
import type { PartnerTypeMetadata } from 'bundles/teach-course/stores/TeachAppStore';
import { shouldHideCatalogContexts } from 'bundles/authoring/course-level/utils/contextUtils';
import { CourseCatalogType } from 'bundles/author-course/utils/types';

/**
 * CourseUtils
 * Utility methods for the course object.
 */
const CourseUtils = {
  /**
   * Return true if the course is launched.
   * @param {object} course The course model - we have various representations of course model currently
   */
  isLaunched(course: AuthoringCourse | Course | PlaceholderCourse | AuthoringCourseRaw): boolean {
    return !!course.launchedAt && course.launchedAt <= Date.now();
  },

  isPreEnrollmentEnabled(course: AuthoringCourse): boolean {
    return !this.isLaunched(course) && 'preEnrollmentEnabledAt' in course;
  },

  isSessionsModeEnabled(course: AuthoringCourse): boolean {
    return typeof course.sessionsEnabledAt !== 'undefined' && course.sessionsEnabledAt <= Date.now();
  },

  /**
   * Return true if the course has verification enabled.
   * @param {object} course The course model in JSON
   */
  isVerificationEnabled(course: AuthoringCourse): boolean {
    return course.verificationEnabledAt ? course.verificationEnabledAt <= Date.now() : false;
  },

  /**
   * Course is considered private if the catalog instances are to be hidden.
   * See http://go.dkandu.me/course-audience-settings
   * @param {object} course The course model
   * @return boolean
   */
  isPrivate(course: AuthoringCourse): boolean {
    return shouldHideCatalogContexts(course);
  },

  /**
   * Whether a partner is a "full C4C partner" based on their partnerTypeMetadata.
   * See http://go.dkandu.me/course-audience-settings
   * @param {object} partnerTypeMetadata partnerTypeMetadata for this course
   * @return boolean
   */
  isFullC4CPartner({ isC4CPartner, isPrivateAuthoringPartner }: PartnerTypeMetadata): boolean {
    return isC4CPartner && !isPrivateAuthoringPartner;
  },

  /**
   * Get the catalog type (public, private, or enterprise) of the course
   * @param {AuthoringCourse} course the course object
   * @returns {CourseCatalogType} the catalog type of the course
   */
  getCourseCatalogType(course: AuthoringCourse): CourseCatalogType {
    let catalogType = CourseCatalogType.PUBLIC;

    if (CourseUtils.isPrivate(course)) {
      catalogType = CourseCatalogType.PRIVATE;
    } else if (course.isLimitedToEnterprise) {
      catalogType = CourseCatalogType.ENTERPRISE;
    }

    return catalogType;
  },
};

export default CourseUtils;

export const {
  isLaunched,
  isPreEnrollmentEnabled,
  isSessionsModeEnabled,
  isVerificationEnabled,
  isPrivate,
  isFullC4CPartner,
  getCourseCatalogType,
} = CourseUtils;
