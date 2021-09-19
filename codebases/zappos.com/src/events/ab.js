/**
 * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/ABTestEnrollment.proto
 *
 * @param {string} test
 * @param {string} phase
 * @param {string} group
 */
export const evABTestEnrollment = ({ test, phase, group }) => ({
  abTestEnrollment: {
    name: test,
    phase,
    testGroup: group
  }
});
