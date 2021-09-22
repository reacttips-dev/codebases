import path from 'js/lib/path';
import Q from 'q';
import _ from 'underscore';

/**
 * @constructor
 * @param {*} contentRequester - A ContentRequester for the video item.
 * @param {*} sessionId - The sessionId for the assessment
 */
const Requester = function (contentRequester, sessionId) {
  this._contentRequester = contentRequester;
  this._sessionId = sessionId;
};

Requester.prototype.action = function (name, argument) {
  return this._contentRequester
    .request(path.join('inVideoQuiz', 'session', this._sessionId, 'action', name), {
      argument,
    })
    .then(_.property('return')); // Extract the 'return' property from the assessment's response.
};

export default Requester;
