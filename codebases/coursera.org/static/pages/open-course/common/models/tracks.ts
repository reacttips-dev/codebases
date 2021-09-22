/**
 * This is an enum of common trackIds, as used in courseMaterial and onDemandTrackAttainments.v1, among others. Note
 * that more tracks may be defined later and this may not be an exhaustive list. Tracks are not an enum on the backend.
 */
export type TrackId = 'core' | 'honors';

export class Tracks {
  static CORE_TRACK: TrackId = 'core';

  static HONORS_TRACK: TrackId = 'honors';
}

export const { CORE_TRACK, HONORS_TRACK } = Tracks;

export default Tracks;
