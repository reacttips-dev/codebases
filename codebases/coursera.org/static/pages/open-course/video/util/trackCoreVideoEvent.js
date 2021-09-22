import multitracker from 'js/app/multitrackerSingleton';

const trackCoreVideoEvent = function (courseId, itemId, canPlayVideo, didDownload) {
  /* eslint-disable camelcase */
  multitracker.pushV2([
    'core.video_access',
    {
      client: 'web',
      generation: 'phoenix',
      course_id: courseId,
      course_item_id: itemId,
      playable: canPlayVideo, // pass in false if you are restricting the video from being played
      download: didDownload,
    },
  ]);
  /* eslint-enable camelcase */
};

export default trackCoreVideoEvent;
