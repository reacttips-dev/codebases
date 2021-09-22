/* eslint-disable camelcase */
import uuid from 'bundles/common/utils/uuid';

import Retracked from 'js/app/retracked';

import { courseSlug } from 'pages/open-course/common/constants';
import type { VideoPlayer } from 'bundles/item-lecture/types';
import type { PlayerOptions } from 'bundles/video-player/types/PlayerOptions';
import type { VideoMetaData } from 'bundles/video-player/types/VideoAnalytics';

const eventDataKeys = {
  'video_progress.not_found': ['playback_rate', 'subtitle_language', 'version', 'tech', 'volume'],
  'playback_rate.change': ['playback_rate', 'subtitle_language', 'version', 'tech', 'volume'],
  'change.subtitles': ['playback_rate', 'subtitle_language', 'version', 'tech', 'volume'],
  'volume.change': ['playback_rate', 'subtitle_language', 'version', 'tech', 'volume'],
  'resolution.change': ['resolution', 'version', 'tech'],
  playback_tech: ['playback_rate', 'subtitle_language', 'version', 'tech', 'volume'],
  heartbeat: ['playback_rate', 'subtitle_language', 'version', 'tech', 'volume'],
  joining: ['playback_rate', 'version', 'tech', 'resolution', 'session_id'],
  joined: ['playback_rate', 'version', 'tech', 'resolution', 'session_id'],
  wait_metrics: ['playback_rate', 'version', 'tech', 'resolution', 'session_id'],
};

const getPlayerMetadata = (player: VideoPlayer): VideoMetaData =>
  (({
    nextItemMetadataOrItemGroup,
    title,
    courseId: course_id,
    itemId: item_id,
    moduleId: module_id,
    moduleName: module_name,
    lessonId: lesson_id,
    lessonName: lesson_name,
  }: PlayerOptions) => ({
    item_id,
    course_id,
    item_name: title,
    lesson_id,
    lesson_name,
    module_id,
    module_name,
    open_course_slug: courseSlug,
    session_id: uuid(),
    video_name: title,
    version: 2,
    linked_item_id: nextItemMetadataOrItemGroup ? nextItemMetadataOrItemGroup.getId() : '',
    linked_item_name: nextItemMetadataOrItemGroup ? nextItemMetadataOrItemGroup.getName() : '',
    timecode: Math.min(player.currentTime(), player.duration()), // timecode should never be greater than the length of the video.
    playback_rate: player.playbackRate(),
    volume: player.muted() ? 0 : player.volume(),
    resolution: player.resolution(),
    tech: player.tech_ && player.tech_.constructor.name === 'Html5' ? 'html5' : 'flash',
    subtitle_language: (() => {
      const textTracks = player.textTracks().tracks_;
      const currentTrack = textTracks ? textTracks.find((track: $TSFixMe) => track.mode === 'showing') : null;
      return currentTrack ? currentTrack.language : '';
    })(),
  }))(player.options_);

/**
 * Returns metadata given its unique key
 *
 * @param {string[]} keys
 */
export const getDataByKeys = (player: VideoPlayer, keys: string[]): VideoMetaData => {
  const metadata = getPlayerMetadata(player);

  return keys.reduce(
    (arr, key) => ({
      ...arr,
      [key]: metadata[key],
    }),
    {}
  );
};

/**
 * Returns the pass along with an analytics event given the event name
 *
 * @param {string} eventName The analytics event firing
 */
export const getTrackingDataForVideoEvent = (player: VideoPlayer, eventName: string): VideoMetaData => {
  // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  return getDataByKeys(player, eventDataKeys[eventName] || []);
};

export const createVideoEventTracker = (namespace: string, player: VideoPlayer) => {
  const tracker = Retracked.makeTracker({
    namespace,
    include: getDataByKeys(player, [
      'open_course_slug',
      'video_name',
      'course_id',
      'item_id',
      'item_name',
      'lesson_id',
      'lesson_name',
      'module_id',
      'module_name',
      'timecode',
    ]),
  });

  return (eventName: string, data: {} = {}) => {
    tracker(eventName, {
      ...getTrackingDataForVideoEvent(player, eventName),
      ...data,
    });
  };
};
