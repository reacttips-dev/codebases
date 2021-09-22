class S12n {
  constructor(props) {
    this.s12n = props.s12n;
    this.ownership = props.ownership;
    this.membership = props.s12n.get('membership');
  }

  /**
   * @returns {Backbone S12n} The Backbone s12n model. Only use this for compatibility with legacy components.
   */
  getBackboneModel() {
    return this.s12n;
  }

  getOwnership() {
    return this.ownership;
  }

  getId() {
    return this.s12n.get('id');
  }

  getName() {
    return this.s12n.get('name');
  }

  getLink() {
    return this.s12n.getLink();
  }

  getDescription() {
    return this.s12n.get('description');
  }

  getLogo() {
    return this.s12n.get('logo');
  }

  getCourse(courseId) {
    return this.s12n.get('courses').get(courseId);
  }

  getCourseNumber(courseId) {
    return this.s12n.get('courseIds').indexOf(courseId) + 1;
  }

  getNumCourses() {
    return this.s12n.get('courseIds').length;
  }

  getNextCourseId(courseId) {
    const courseIds = this.s12n.get('courseIds');
    const index = courseIds.indexOf(courseId);
    if (index + 1 < courseIds.length) {
      return courseIds[index + 1];
    }
  }

  getNextCourse(courseId) {
    const nextCourseId = this.getNextCourseId(courseId);
    if (nextCourseId) {
      return this.s12n.get('courses').get(nextCourseId);
    }
  }

  /**
   * @returns {Course} - The first course after `startAtCourseId` in the s12n that is incomplete
   * and that the user is allowed to take. If `startAtCourseId` is undefined or if it refers to
   * a course that is not in the capstone, then we start looking at the first course.
   *
   * Examples:
   *
   * If there are 4 non-capstone courses in the s12n and the user has only completed #3, then
   *   getNextIncompleteCourse(course1id) = course2
   *   getNextIncompleteCourse(course3id) = course4
   *
   * If the first 4 courses in the s12n, the first 3 are not capstones, the last is a capstone,
   * and the user has only completed #3, then
   *   getNextIncompleteCourse(course3id) = course1
   * because the user is not allowed to take course4 (the capstone) until they have completed all the courses.
   */
  getNextIncompleteCourse(startAtCourseId) {
    let membership;

    if (this.isEligibleForCapstone()) {
      const capstone = this.s12n.getCapstone();
      if (!capstone) return null;
      membership = capstone.get('memberships').last();

      // Assuming the learner is eligible for a capstone, if they have finished the capstone
      // there are no incomplete courses, otherwise the capstone is the only incomplete course left.
      return membership && membership.hasPassed() ? null : capstone;
    }

    const courses = this.s12n.get('courses');
    const currentCourseIdx = courses.indexOf(courses.get(startAtCourseId));

    // Cycle the list of courses so that the course at `currentCourseIdx + 1` is the first course.
    // The behavior at these edge cases is intentional:
    //   `currentCourseIdx == -1` -> Use the uncycled list of courses.
    //   `currentCourseIdx == courses.size() - 1` -> Use the uncycled list of courses.
    const cycledCourses = [].concat(courses.slice(currentCourseIdx + 1), courses.slice(0, currentCourseIdx + 1));

    const nextIncompleteCourse = cycledCourses.find((course) => {
      // skip capstone as learner is not eligible
      if (!course.isCapstone()) {
        membership = course.get('memberships').last();

        // Return course if the learner is not enrolled / has not passed
        if (!(membership && membership.hasPassed())) {
          return true;
        }
      }
      return false;
    });

    return nextIncompleteCourse || null;
  }

  /**
   * @returns {string} - A status string that is passed into the course settings view to display
   * the appropriate specialization status badge for the current course.
   */
  getEnrollmentStatus(isEnrolledInCourse) {
    return this.isTakingS12n() ? 'registered' : isEnrolledInCourse ? 'free-enrolled' : 'browsing';
  }

  isTakingS12n() {
    return this.membership && this.membership.isEnrolled();
  }

  hasBulkPaid() {
    return this.ownership && this.ownership.hasBulkPaid();
  }

  ownsCourse(courseId) {
    return this.ownership && this.ownership.ownsCourse(courseId);
  }

  isCapstone(courseId) {
    // Get the catalogP version of the course model, which has capstone information.
    const course = this.s12n.get('courses').get(courseId);
    if (course) {
      return course.isCapstone();
    }
    return false;
  }

  isEligibleForCapstone() {
    return this.s12n.isEligibleForCapstone();
  }

  getCapstone() {
    return this.s12n.get('courses').find((course) => course.isCapstone());
  }

  ownsCapstone(courseId) {
    const capstone = this.getCapstone();
    return this.ownsCourse(capstone.get('id'));
  }

  getCertificateLogos() {
    return this.s12n.getCertificateLogos();
  }

  getHeaderImage() {
    return this.s12n.get('metadata').headerImage;
  }

  getNumberOfCourses() {
    return this.s12n.getNumCourses();
  }

  getNumberOfCoursesCompleted() {
    return this.s12n
      .get('courses')
      .chain()
      .filter((course) => {
        const membership = course.get('memberships').last();
        return membership && membership.hasPassed();
      })
      .size()
      .value();
  }
}

export default S12n;
