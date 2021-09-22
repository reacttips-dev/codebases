import keysToConstants from 'js/lib/keysToConstants';

// should be in sync with
// https://github.com/webedx-spark/infra-services/blob/main/libs/models/src/main/scala/org/coursera/opencourse/model/package.scala#L13-L21
const CourseRoles = keysToConstants([
  'BROWSER', // user made progress but not yet enrolled (default)
  'NOT_ENROLLED', // user was enrolled before but explicitly removed themselves
  'PRE_ENROLLED_LEARNER', // user has pre enrolled in a course that has yet to launch
  'LEARNER', // user is enrolled as a learner
  'MENTOR', // user is enrolled and a community TA
  'TEACHING_STAFF',
  'COURSE_ASSISTANT',
  'UNIVERSITY_ADMIN',
  'INSTRUCTOR',
  'DATA_COORDINATOR',
]);

export const {
  BROWSER,
  NOT_ENROLLED,
  PRE_ENROLLED_LEARNER,
  LEARNER,
  MENTOR,
  TEACHING_STAFF,
  COURSE_ASSISTANT,
  UNIVERSITY_ADMIN,
  INSTRUCTOR,
  DATA_COORDINATOR,
} = CourseRoles;

export default CourseRoles;
