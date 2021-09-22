import _ from 'underscore';

import language from 'js/lib/language';
import videoDataPromise from 'pages/open-course/common/data/videoData';
import VideoContent from 'bundles/video-player/models/VideoContent';

/** Map new API resolution keys to old ones. */
const formatMapping = {
  mp4VideoUrl: 'video/mp4',
  webMVideoUrl: 'video/webm',
};

/** Key of poster URLs in new API's sources response. */
const posterKey = 'previewImageUrl';

export default (options) => {
  const itemMetadata = options.metadata;
  const itemId = itemMetadata.get('id');
  const courseId = itemMetadata.get('course.id');
  const courseSlug = itemMetadata.get('course.slug');

  // Note: This API is accessible to logged out users, too.
  return videoDataPromise({ itemId, courseId, courseSlug }).then((data) => {
    const parsedVideoData = {};

    parsedVideoData.itemMetadata = itemMetadata;

    parsedVideoData.videoId = data.id;

    parsedVideoData.sources = _(data.sources.byResolution).mapObject((newSource) => {
      const oldSource = {};
      _(formatMapping).each((oldFormat, newFormat) => {
        if (newFormat in newSource) {
          oldSource[oldFormat] = newSource[newFormat];
        }
      });

      return oldSource;
    }, {});

    // `reduce` iterator to build subtitle maps.
    const subtitlesMapReducer = (subtitles, url, languageCode) => {
      return {
        ...subtitles,
        [languageCode]: {
          label: language.languageCodeToName(languageCode),
          url,
        },
      };
    };

    parsedVideoData.subtitles = _(data.subtitles).reduce(subtitlesMapReducer, {});
    parsedVideoData.subtitlesVtt = _(data.subtitlesVtt).reduce(subtitlesMapReducer, {});
    parsedVideoData.subtitlesTxt = _(data.subtitlesTxt).reduce(subtitlesMapReducer, {});

    parsedVideoData.posters = _(data.sources.byResolution).mapObject((source) => source[posterKey], {});

    return new VideoContent(parsedVideoData);
  });
};
