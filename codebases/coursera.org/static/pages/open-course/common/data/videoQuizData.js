/**
 * Given an itemMetadata, returns an object containing the sessionId for a
 * video quiz session and the results of a getQuestions call on the video quiz
 * session.
 */

import Q from 'q';

import _ from 'underscore';
import path from 'js/lib/path';
import ContentRequester from 'pages/open-course/common/contentRequester';
import AssessRequester from 'pages/open-course/video/util/assessRequester';

export default function (options) {
  const contentRequester = new ContentRequester(options.metadata);
  return contentRequester
    .request(path.join('inVideoQuiz', 'session'), {})
    .then(function (sessionData) {
      const sessionId = sessionData.session.id;
      const assessRequester = new AssessRequester(contentRequester, sessionId);
      return Q.all([sessionData.session.id, assessRequester.action('getQuestions', {})]);
    })
    .spread(function (sessionId, questionData) {
      const videoQuizData = {
        sessionId,
      };
      _(videoQuizData).extend(questionData);
      return videoQuizData;
    });
}
