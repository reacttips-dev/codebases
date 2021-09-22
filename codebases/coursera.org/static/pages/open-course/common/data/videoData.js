import config from 'pages/open-course/common/constants';
import NaptimeItemClient from 'pages/open-course/common/naptimeItemClient';

export default ({ itemId, courseId, courseSlug }) => {
  const naptimeClient = new NaptimeItemClient({ itemId, courseId, courseSlug });

  const args = {
    includes: ['video'],
    fields: ['onDemandVideos.v1(sources,subtitles,subtitlesVtt,subtitlesTxt)'],
  };

  return naptimeClient
    .getWithCourseItemId(config.lectureVideosApi, args)
    .then((response) => response.linked['onDemandVideos.v1'][0]);
};
