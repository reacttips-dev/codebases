type JsonResponse = { audio: MusicAudio };
type MusicAudio = {
  duration: number;
  url: string;
  spotifyTrackId: string;
  thirdPartyTrackName: string;
  thirdPartyArtistName: string;
  audioId?: string;
  thirdPartyDuration: string;
  albumImageUrl: string;
};
type Parameters = {
  webStationId: string;
  audio: MusicAudio;
};

export async function createMusicSegment({
  webStationId,
  audio,
}: Parameters): Promise<JsonResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/stations/webStationId:${webStationId}/upload/music`,
      {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          thirdPartyDuration: audio.thirdPartyDuration,
          previewAudioUrl: audio.url,
          thirdPartyTrackId: audio.spotifyTrackId,
          thirdPartyTrackName: audio.thirdPartyTrackName,
          thirdPartyArtistName: audio.thirdPartyArtistName,
          thirdPartyImageUrl: audio.albumImageUrl,
        }),
      }
    );
    if (response.ok) {
      const { audioId } = await response.json();
      return {
        audio: {
          ...audio,
          audioId,
        },
      };
    }
    throw new Error('Unable to add music segment to to episode');
  } catch (err) {
    throw new Error(err.message);
  }
}
