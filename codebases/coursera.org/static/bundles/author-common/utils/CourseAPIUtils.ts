/**
 * Interface with the server for Course Authoring.
 */

import API from 'js/lib/api';
import Q from 'q';
import moment from 'moment';
import URI from 'jsuri';
import epicClient from 'bundles/epic/client';

// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import { getPriceForVC } from 'bundles/payments/promises/productPrices';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import CourseServerActionCreators from 'bundles/author-course/actions/CourseServerActionCreators';
import type { CourseTypeMetadata } from 'bundles/naptimejs/resources/courseTypeMetadata.v1';

import type AuthoringCourse from 'bundles/author-common/models/AuthoringCourse';

const courseApiV1 = API('/api/authoringCourses.v1', { type: 'rest' });
const courseApiV2 = API('/api/authoringCourses.v2', { type: 'rest' });
const branchAPI = API('/api/authoringCourseBranches.v1', { type: 'rest' });
const membershipAPI = API('/api/openCourseMemberships.v1', { type: 'rest' });
const domainAPI = API('/api/domains.v1', { type: 'rest' });
const subdomainAPI = API('/api/subdomains.v1', { type: 'rest' });
const onDemandCoursesAPI = API('/api/onDemandCourses.v1', { type: 'rest' });
const betaTestingSchedulesAPI = API('/api/betaTestingSchedules.v1', { type: 'rest' });
const cloneRhymeCourseAPI = API('/api/rhymeCloneCourses.v1/?fields=destinationCourseId', { type: 'rest' });
const cloneCourseAPI = API('/api/authoringCloneCourses.v1/', { type: 'rest' });

const MAX_AVAILABLE_COURSE_SLUG_CHECKS = 5;

const emptyCourseShellEnabled = () => epicClient.get('Authoring', 'enableEmptyCourseShell');

export type AuthoringCourseCreateRequest = {
  name?: string;
  slug?: string;
  partnerIds?: Array<number>;
  instructorIds?: Array<number>;
  primaryLanguageCode: string;
  plannedLaunchDate?: number;
  isRestrictedMembership?: boolean;
  courseTypeMetadata?: CourseTypeMetadata;
};

const CourseAPIUtils = {
  /**
   * Get Course Object using id.
   * @param {String} courseId
   */
  getCourse(courseId: string) {
    const api = emptyCourseShellEnabled() ? courseApiV2 : courseApiV1;
    return Q.all([api.get(courseId), this.getBetaTestingSchedule(courseId)]).spread(
      (courseResponse, betaTestingSchedule) => {
        const courseWithMetadata = courseResponse.elements[0];
        courseWithMetadata.course.betaTestingSchedule = betaTestingSchedule;
        return courseWithMetadata;
      }
    );
  },

  getCourseRequesterId(courseId: string): Q.Promise<number | undefined> {
    const uri = new URI()
      .addQueryParam('q', 'byDestinationCourseId')
      .addQueryParam('fields', 'requesterId')
      .addQueryParam('courseId', courseId);
    return Q(cloneCourseAPI.get(uri.toString())).then(({ elements }) => elements[0]?.requesterId);
  },

  cloneGuidedProject(
    languageCode: string,
    destinationSlug: string | undefined,
    name: string | undefined,
    partnerId: number,
    description = ''
  ): Q.Promise<{ destinationCourseId: string }> {
    const data = { languageCode, destinationSlug, name, partnerId, description };
    return Q(cloneRhymeCourseAPI.post('', { data })).then(({ elements }) => elements[0]);
  },

  /**
   * Get Branch Object using id.
   * @param {String} branchId
   */
  getBranch(branchId: string) {
    return Q(branchAPI.get(branchId)).then((response) => response.elements[0]);
  },

  /**
   * Get Draft Object using branch id.
   * @param {String} branchId
   */
  getDraft(branchId: string) {
    const uri = new URI()
      .addQueryParam('action', 'getItemDraftInfo')
      .addQueryParam('branchId', branchId)
      .addQueryParam('isV2', true);

    return Q(branchAPI.post(uri.toString()));
  },

  /**
   * Create New Course
   */
  createCourse(course: AuthoringCourseCreateRequest) {
    const api = emptyCourseShellEnabled() ? courseApiV2 : courseApiV1;

    return Q(api.post('', { data: course }));
  },

  /**
   * Create default first course to associate a partner to a newly created s12n
   * @param {String} s12nSlug The specialization's slug
   * @param {Number} partnerId The partner to associate with
   * @param {Number} instructorId The instructor to associate the first course to
   */
  createDefaultFirstCourse(s12nSlug: string, partnerId: number, instructorId: number) {
    return this.getFirstAvailableCourseSlug(s12nSlug)
      .then((courseSlug: $TSFixMe) =>
        this.createCourse({
          name: courseSlug,
          slug: courseSlug,
          partnerIds: [partnerId],
          instructorIds: instructorId ? [instructorId] : [],
          primaryLanguageCode: 'en',
          plannedLaunchDate: parseInt(moment().add(1, 'year').format('X000'), 10),
          isRestrictedMembership: false,
        })
      )
      .then((response: $TSFixMe) => {
        const data = response.elements[0];
        return {
          courseId: data.id,
          substitutes: [],
        };
      });
  },

  /**
   * Save Course Draft
   * @param {String} branchid ID of the course to update
   * @param {Object} course The updated course
   * @param {Object} courseMetaData Latest available metadata for the course
   */
  saveCourse(courseId: string, course: AuthoringCourse, metadata: $TSFixMe) {
    const api = emptyCourseShellEnabled() ? courseApiV2 : courseApiV1;
    return Q(
      api.put(courseId, {
        data: { course, metadata },
      })
    ).then((response) => {
      const data = response.elements[0];
      CourseServerActionCreators.savedCourse(data);
      return data;
    });
  },

  /**
   * Update and publish the course at the superuser level
   * @param {String} courseId ID of the course to update
   * @param {Object} course The updated course
   * @param {Object} metadata Latest available metadata for the course
   */
  superuserUpdateCourse(courseId: string, course: AuthoringCourse, metadata: $TSFixMe) {
    const api = emptyCourseShellEnabled() ? courseApiV2 : courseApiV1;
    const uri = new URI().addQueryParam('action', 'superuserUpdate').addQueryParam('id', courseId);

    return Q(api.post(uri.toString(), { data: { course, metadata } }));
  },

  /**
   * Return true if the provided course slug is available.
   * @param {String} slug
   * @return {Boolean} True if the slug is available
   */
  isCourseSlugAvailable(slug: string) {
    const uri = new URI().addQueryParam('q', 'slug').addQueryParam('slug', slug);

    return Q(onDemandCoursesAPI.get(uri.toString()))
      .then((response) => {
        // Check if the slug matches the course's current slug
        const course = response.elements[0];
        const currentSlug = course.slug;
        return slug !== currentSlug;
      })
      .catch((response) => {
        const { status } = response;

        if (status === 403) {
          // 403 returned for un-launched courses.
          // We currently assume any slugs ever used by those courses as taken.
          // TODO: Use another API that can check un-launched courses.
          return false;
        } else if (status === 404) {
          // Slug was never used by a course.
          return true;
        }
      });
  },

  /**
   * Returns first unusued auto generated course slug
   * @param {String} s12nSlug The specialization's slug
   * @return {Any} Promise if already in use or an API error, string if a slug is available
   */
  getFirstAvailableCourseSlug(s12nSlug: string, i = 1): $TSFixMe {
    const courseSlug = `${s12nSlug}-first-course-${i}`;

    return this.isCourseSlugAvailable(courseSlug).then((response) => {
      if (response) {
        return courseSlug;
      } else if (response === undefined || i > MAX_AVAILABLE_COURSE_SLUG_CHECKS) {
        return Q.reject('Course could not be created.');
      } else {
        return this.getFirstAvailableCourseSlug(s12nSlug, i + 1);
      }
    });
  },

  /**
   * Get supported domains for a course
   */
  getDomains() {
    return Q(domainAPI.get('?fields=id,name,subdomainIds')).then((response) => response.elements);
  },

  getSubdomains() {
    return Q(subdomainAPI.get('?fields=id,name')).then((response) => response.elements);
  },

  /** : string
   * Get price of the Course Certificate for the course.
   */
  getVCPrice(courseId: string) {
    return Q(getPriceForVC({ courseId }));
  },

  getMembershipsByCourseRole(courseId: string, courseRole: string) {
    const uri = new URI()
      .addQueryParam('q', 'findByCourse')
      .addQueryParam('courseRole', courseRole)
      .addQueryParam('includes', 'userId')
      .addQueryParam('courseId', courseId);

    return Q(membershipAPI.get(uri.toString())).then((response) => {
      if (response.elements) {
        response.elements.map((item: $TSFixMe) => {
          const user = response.linked['users.v1'].find((userData: $TSFixMe) => {
            return userData.id === item.userId;
          });

          if (user) {
            return Object.assign(item, user);
          } else {
            return item;
          }
        });
      }

      return response.elements || [];
    });
  },

  /**
   * Get list of Course Assistants for given course
   * @param {String} courseId Course ID
   */
  getCourseAssistants(courseId: string) {
    return CourseAPIUtils.getMembershipsByCourseRole(courseId, 'COURSE_ASSISTANT');
  },

  /**
   * Get list of Teaching Assistants for given course
   * @param {String} courseId Course ID
   */
  getTeachingAssistants(courseId: string) {
    return CourseAPIUtils.getMembershipsByCourseRole(courseId, 'TEACHING_STAFF');
  },

  getBetaTestingSchedule(courseId: string) {
    return Q(betaTestingSchedulesAPI.get(courseId))
      .then((payload) => payload && payload.elements && payload.elements[0])
      .catch((err) => {
        if (err.status === 404) {
          return null;
        } else {
          throw err;
        }
      });
  },

  scheduleBetaTesting(courseId: string) {
    return Q(betaTestingSchedulesAPI.put(courseId));
  },

  unscheduleBetaTesting(courseId: string) {
    return Q(betaTestingSchedulesAPI.delete(courseId));
  },
};

export default CourseAPIUtils;

export const {
  getCourse,
  getBranch,
  getDraft,
  createCourse,
  createDefaultFirstCourse,
  saveCourse,
  superuserUpdateCourse,
  isCourseSlugAvailable,
  getFirstAvailableCourseSlug,
  getDomains,
  getSubdomains,
  getVCPrice,
  getCourseAssistants,
  getTeachingAssistants,
} = CourseAPIUtils;
