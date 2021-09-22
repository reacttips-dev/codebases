/* VerificationProgresses is a model for responses from verificationProgresses API
 * of the verification Phoenix service
 *
 * Its attributes match exactly attributes returned by the API:
 * - id (string in the format: 'verifiableId' + '~' + 'userId')
 * - isApprovedForVerificationState (boolean)
 * - nextVerificationState ('KeystrokeRecognition', 'FaceRecognition', 'Delayed' or 'Success')
 * - userId (integer)
 * - verifiableId (string)
 */

import Backbone from 'backbone';

const VerificationProgresses = Backbone.Model.extend({});

export default VerificationProgresses;
