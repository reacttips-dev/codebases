import Q from 'q';

import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import user from 'js/lib/user';
import URI from 'jsuri';
import API from 'js/lib/api';

import { VideoProgress } from 'bundles/video-player/types/VideoProgress';

const onDemandVideoProgressesAPI = API('/api/onDemandVideoProgresses.v1', { type: 'rest' });

export type OnDemandVideoProgressV1Data = {
  elements: VideoProgress[];
};

const OnDemandVideoProgressesAPIUtils = {
  getVideoProgressId(courseId: string, videoId: string) {
    return tupleToStringKey([user.get().id, courseId, videoId]);
  },

  get(courseId: string, videoId: string): Q.Promise<OnDemandVideoProgressV1Data> {
    const videoProgressId = this.getVideoProgressId(courseId, videoId);
    // Don't save progress for logged out users
    if (!user.isAuthenticatedUser()) {
      return Q.reject();
    }
    const uri = new URI(videoProgressId);
    return Q(onDemandVideoProgressesAPI.get(uri.toString()));
  },

  update(courseId: string, videoId: string, viewedUpTo: number) {
    const videoProgressId = this.getVideoProgressId(courseId, videoId);
    const data = {
      viewedUpTo,
      videoProgressId,
    };
    const uri = new URI(videoProgressId);
    return Q(onDemandVideoProgressesAPI.put(uri.toString(), { data }));
  },
};

export default OnDemandVideoProgressesAPIUtils;

export const { get, update } = OnDemandVideoProgressesAPIUtils;
