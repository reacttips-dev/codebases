/*
 * isValidTestTreatment()
 *
 * @param testName: String
 * @param testTrigger: Array
 * @param testTreatment: Object
 * @param isRecognized: Boolean
 * @param hasAssignmentTriggered: Boolean
 *
 * Returns: Boolean value determining if a test assignment should be triggered or not.
 */
export const isValidTestTreatment = ({ testName = null, testTrigger = null, testTreatment = null, isRecognized = false, hasAssignmentTriggered = false }) => {
  const validTest = typeof testName === 'string' && Array.isArray(testTrigger) && typeof testTreatment === 'object';
  const triggers = Array.isArray(testTrigger) ? testTrigger : [];
  const testUnrecognized = triggers.includes('UnrecognizedCustomer') && !isRecognized;
  const testRecognized = triggers.includes('RecognizedCustomer') && isRecognized;
  // Accounting for Previously misspelling that was missed. Since the string was initially misspelled, we'll keep this OR statement until it's fixed.
  const testRecognizedCustomerPreviouslyOptedIn = (triggers.includes('RecognizedCustomerPreveouslyOptedIn') || triggers.includes('RecognizedCustomerPreviouslyOptedIn')) && hasAssignmentTriggered && isRecognized;

  return validTest && (testUnrecognized || testRecognized || testRecognizedCustomerPreviouslyOptedIn);
};
