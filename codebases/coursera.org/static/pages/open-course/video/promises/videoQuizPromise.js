import Q from 'q';
import _ from 'underscore';
import videoQuizData from 'pages/open-course/common/data/videoQuizData';
import VideoQuiz from 'bundles/video-quiz/models/VideoQuiz';

export default function (options) {
  const hasAssessment = options.metadata.getDefinition('hasInVideoAssessment');
  const isAuthenticated = options.authenticated;

  if (!hasAssessment || !isAuthenticated) {
    return Q.fcall(_.constant(null));
  }

  return videoQuizData(options)
    .then(function (data) {
      return new VideoQuiz(data);
    })
    .catch(function (error) {
      return Q.fcall(_.constant(null));
    });
}
