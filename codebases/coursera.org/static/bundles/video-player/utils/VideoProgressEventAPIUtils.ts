import user from 'js/lib/user';
import path from 'js/lib/path';
import URI from 'jsuri';
import API from 'js/lib/api';

import VideoContent from 'bundles/video-player/models/VideoContent';

const openCourseAPI = API('/api/opencourse.v1', { type: 'rest' });

const VideoProgressEventAPIUtils = {
  sendEvent(videoContent: VideoContent, type: string) {
    const options = {
      data: {
        contentRequestBody: {},
      },
    };
    const { itemMetadata } = videoContent;

    const courseSlug = itemMetadata.get('course.slug');
    const itemId = itemMetadata.getId();

    const uri = new URI(
      path.join('user', `${user.get().id}`, 'course', courseSlug, 'item', itemId, 'lecture/videoEvents', type)
    );
    // we must add this to make sure learners don't accidentally get auto-enrolled.
    uri.addQueryParam('autoEnroll', 'false');

    return openCourseAPI.post(uri.toString(), options);
  },
};

export default VideoProgressEventAPIUtils;

export const { sendEvent } = VideoProgressEventAPIUtils;
