import CatalogModel from 'bundles/catalogP/models/catalogModel';

/**
 * @class VcMembership
 * @property {string} [certificateCode] - The certificate code for a learner's certificate.
 * @property {object} [courseGradeRecord] - The full course grade record for this learner.
 * @property {number} [courseGradeRecord.timestamp] - The time when this grade was achieved..
 * @property {string} [courseGradeRecord.passingState] - The passing state of this particular grade.
 * @property {boolean} [courseGradeRecord.distinction] - Whether or not they passed with distinction.
 * @property {boolean} [isSparkCourse] - Whether or not this is a Spark Course. Spark courses require different
 * logic for checking if a user has passed the course or earned a certificate because it was on the old platform
 */
const VcMembership = CatalogModel.extend(
  {
    fields: ['courseGradeRecord', 'certificateCode', 'grade', 'isSparkCourse'],

    includes: {},

    resourceName: 'vcMemberships.v1',
  },
  {
    COURSE_GRADE: {
      PASSED: 'PASSED',
      VERIFIED_PASSED: 'VERIFIED_PASSED',
      NOT_PASSED: 'NOT_PASSED',
      NOT_PASSABLE: 'NOT_PASSABLE',
    },
  }
);

export default VcMembership;
