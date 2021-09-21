import React from 'react';
import ShareableSegment from './ShareableSegment';
import { NonPlayableEpisode } from '../EpisodeSegmentPlayer/NonPlayableEpisode';
import EpisodeSegmentPlayer from '../EpisodeSegmentPlayer';

export const ShareableEpisodeSegmentPlayer = ({
  episodePreview,
  station,
  actions,
  playbackSpeed,
  episodeShareUrl,
  shareUrl,
  shareEmbedHtml,
  isEmbedded,
  onClickShare,
  onClickCopyUrl,
  handleAudioEnded,
  profileColor,
}) => {
  const { creator, duration, episodes, title } = episodePreview;
  const {
    countdown,
    isPlaying,
    isSharing,
    audios,
    activeIndex,
    playedDuration,
    podcastMetadata,
    stationDuration,
    stationId,
    episodeId,
    volumeData,
    podcastUrlDictionary,
    vanitySlug,
  } = station;
  const currentEpisode = episodes.find(e => episodeId === e.episodeId);
  if (!currentEpisode) return null;

  const stationName = podcastMetadata.podcastName || creator.name;
  const { isMT, isPW } = currentEpisode;

  return (
    <ShareableSegment
      isSharing={isSharing}
      onCopyShareUrl={onClickCopyUrl}
      onHide={actions.stopShare}
      onShareAction={onClickShare}
      shareUrl={episodeShareUrl}
      shareEmbedHtml={shareEmbedHtml}
      stationName={creator && creator.name}
      episodeName={currentEpisode.title}
      prompt={isMT ? 'Share this show:' : 'Share this podcast:'}
      segmentJSX={
        isMT || isPW ? (
          <NonPlayableEpisode
            key={title}
            isEmbedded={isEmbedded}
            stationId={stationId}
            volumeData={volumeData}
            startShare={actions.startShare}
            episodeTitle={title}
            episode={currentEpisode}
            podcastMetadata={podcastMetadata}
            shareUrl={episodeShareUrl}
            stationName={stationName}
            spotifyShowUrl={podcastUrlDictionary.spotify}
            vanitySlug={vanitySlug}
            isShowSpotifyButton={isMT}
          />
        ) : (
          <EpisodeSegmentPlayer
            profileColor={profileColor}
            isEmbedded={isEmbedded}
            isPlaying={isPlaying}
            stationId={stationId}
            audios={audios}
            activeIndex={activeIndex}
            playedDuration={playedDuration}
            stationDuration={stationDuration}
            volumeData={volumeData}
            playOrPause={actions.playOrPause}
            pause={actions.pause}
            startShare={actions.startShare}
            endAudio={actions.endAudio}
            previousAudio={actions.previousAudio}
            restartAudio={actions.restartAudio}
            countdown={countdown}
            playbackSpeed={playbackSpeed}
            setPlaybackSpeed={actions.setPlaybackSpeed}
            episodeTitle={title}
            episode={currentEpisode}
            podcastMetadata={podcastMetadata}
            shareUrl={episodeShareUrl}
            supportUrl={
              podcastMetadata.hasSupportersEnabled
                ? `${shareUrl}/support`
                : null
            }
            stationName={stationName}
            episodeDuration={duration}
            onEpisodeEnded={
              isEmbedded
                ? actions.replayEpisodeAndPause
                : actions.playNextEpisodeOrReplayAndPause
            }
            onAudioEnded={handleAudioEnded}
            vanitySlug={vanitySlug}
          />
        )
      }
    />
  );
};
