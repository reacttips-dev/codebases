import Q from 'q';
import API from 'js/lib/api';

import user from 'js/lib/user';
import CourseUtils from 'bundles/teach-course/lib/CourseUtils';
import courseDataPromise from 'pages/open-course/common/data/courseData';
import courseMembershipsPromise from 'pages/open-course/common/promises/memberships';

const reportsAPI = API('/api/reports.v1', { type: 'rest' });

const LOCALSTORAGE_TIMESTAMP_KEY = 'teachVisitedAt';
const DISMISSAL_MINUTES = 10080; // 1 week = 10080 minutes

const TeachBannerUtils = {
  getBannerData() {
    return this.getTeachingCourse().spread((membership, course) => {
      return [membership, course, this.getLearnerCounts(membership, course)];
    });
  },

  getVisitedTimestamp() {
    return localStorage[LOCALSTORAGE_TIMESTAMP_KEY];
  },

  setVisitedTimestamp() {
    localStorage[LOCALSTORAGE_TIMESTAMP_KEY] = Date.now();
  },

  shouldShow() {
    const dismissedAt = this.getVisitedTimestamp();

    if (dismissedAt) {
      const dismissedAtDate = new Date(parseInt(dismissedAt));
      const currentDate = new Date(Date.now());

      const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
      const dismissedAtMinutes = dismissedAtDate.getHours() * 60 + dismissedAtDate.getMinutes();

      const diff = currentMinutes - dismissedAtMinutes;

      return diff > DISMISSAL_MINUTES;
    } else {
      return true;
    }
  },

  getTeachingCourse() {
    const userId = user.get().id;

    if (!userId) {
      return Q.reject();
    }

    return courseMembershipsPromise(userId)
      .then((memberships) => {
        const teachedCourseMembership = memberships.find((membership) => {
          return membership.hasTeachingRole();
        });

        // Don't show the banner to University Admins
        if (teachedCourseMembership && teachedCourseMembership.get('courseRole') !== 'UNIVERSITY_ADMIN') {
          const courseId = teachedCourseMembership.get('courseId');
          return [teachedCourseMembership, courseDataPromise.fromId(courseId)];
        } else {
          return Q.reject();
        }
      })
      .spread((membership, course) => {
        if (CourseUtils.isLaunched(course)) {
          return [membership, course];
        } else {
          return Q.reject();
        }
      });
  },

  // Report APIs

  getLearnerCounts(membership, course) {
    return Q(reportsAPI.get(`Course~${course.id}~activity_learner_counts`)).then((response) => {
      if (this.validateLearnerCountsResponse(response)) {
        return response.elements[0].body;
      } else {
        return Q.reject({
          membership,
          course,
        });
      }
    });
  },

  validateLearnerCountsResponse(response) {
    return (
      response.elements &&
      response.elements[0] &&
      response.elements[0].body &&
      response.elements[0].body.latest &&
      response.elements[0].body.latest.starter_ever_count &&
      response.elements[0].body.latest.active_learner_past_1w_count &&
      response.elements[0].body.latest.visitor_ever_count &&
      response.elements[0].body['1w_ago'] &&
      response.elements[0].body['1w_ago'].starter_ever_count
    );
  },

  getWeeklyNewLearnerCount(learnerCounts) {
    return learnerCounts.latest.starter_ever_count - learnerCounts['1w_ago'].starter_ever_count;
  },

  getWeeklyActiveLearnerCount(learnerCounts) {
    return learnerCounts.latest.active_learner_past_1w_count;
  },

  getTotalLearnerCount(learnerCounts) {
    return learnerCounts.latest.visitor_ever_count;
  },
};

export default TeachBannerUtils;

export const {
  getBannerData,
  getVisitedTimestamp,
  setVisitedTimestamp,
  shouldShow,
  getTeachingCourse,
  getLearnerCounts,
  validateLearnerCountsResponse,
  getWeeklyNewLearnerCount,
  getWeeklyActiveLearnerCount,
  getTotalLearnerCount,
} = TeachBannerUtils;
