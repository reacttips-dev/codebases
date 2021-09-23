type FetchEpisodeAudioParams = {
  webEpisodeId: string;
};

type ThirdPartySource = {
  type: 'applemusic' | 'spotify';
  trackId?: string;
  trackUrl?: string;
};

type Video = {
  ratio: string;
  url: string;
  fileSize: number;
};

type Url = {
  url: string;
  sampleRate: number;
  channels: number;
  fileSize: number;
};

type Reaction = {
  timestamp: number;
  applauseCount: number;
};

// https://github.com/AnchorFM/server-common/blob/449dbf3dd0bc42c26119e5f0ed5a431bf3d4d9a9/utilities/audio/constants.js#L2-L9
export type AudioType =
  | 'ad'
  | 'default'
  | 'interlude'
  | 'music'
  | 'shoutout'
  | 'library'
  | 'callin';

export type Audio = {
  audioId: number;
  userId: number | null;
  caption: string | null;
  duration: number;
  downloadRule:
    | 'neverDownload'
    | 'prioritizeDownloadingOnWifi'
    | 'prioritizeDownloading'
    | 'alwaysDownload';
  type: AudioType;
  isPlayed: boolean;
  isExportable: boolean;
  isNotAllowedComments: boolean;
  isNotAllowedVideos: boolean;
  isJointRecording: boolean;
  secondsSinceCreation: number;
  creationEpochTime: number;
  language: string | null;
  attributionUrl?: string;
  attributionDescription?: string;
  thirdPartySources?: ThirdPartySource[];
  thirdPartyTrackName?: string;
  thirdPartyAlbumTitle?: string;
  thirdPartyArtistName?: string;
  thirdPartyDuration?: number;
  thirdPartyImageUrl?: string;
  previewDuration?: number;
  previewAudioUrl?: string;
  videos?: Video[];
  urls: Url[];
  reactions?: Reaction[];
  extendedReactions?: Reaction[];
  audioTransformationSourceType?: 'merge' | 'trim' | 'backgroundTrack' | null;
  audioTransformationStatus?:
    | 'waiting'
    | 'started'
    | 'failed'
    | 'finished'
    | null;
  audioTransformationEstimatedSecondsLeft?: number | null;
  mayTransformWithTrim?: boolean;
  mayTransformWithSplit?: boolean;
  mayExport: boolean;
  isNotAllowedEchoes?: boolean;
  userName?: string;
  isGreenroomContent: boolean;
};

export type Episode = {
  cohostUserIds: string[];
  episodeId: number;
  stationId: number;
  userId: number;
  title: string;
  description: string | null;
  duration: number;
  secondsSinceCreation: number;
  creationEpochTime: number;
  creationHourOffset: number;
  publishEpochTime: number | null;
  secondsSincePublish: number;
  isPlayed: boolean;
  isDistributedExternally: boolean;
  isNotDistributedOnAnchor: boolean;
  isPublished: boolean;
  isScheduled: boolean | null;
  hasEnabledAdSlot: boolean;
  language: string;
  imageUrl: string;
  shareUrl: string;
  playCount: number;
  platformPlays: { displayName: string; count: number }[]; // this might be wrong
  episodeAudios: EpisodeAudio[];
  spotifyUrl: string;
  spotifyUri: string;
  episodeType?: string;
  questionId: number | null;
  status: {
    episodeDistributionStatus: string;
    episodeSponsorshipsStatus: string;
    episodeCallToAction: string;
  };
  tags: string[];
  containsMusicSegments: boolean;
};

type EpisodeAudio = {
  adPlacement: any;
  doCreditOriginalUserId: boolean;
  isAdSlotEnabled: boolean;
  playCount: number;
  shareUrl: string;
  timelineColor: string;
} & Pick<Audio, 'audioId' | 'caption' | 'type'>;

export type User = {
  userId: number;
  name: string;
  creationEpochTime: number;
  firstName: string | null;
  podcastName: string;
  emailAddress: string;
  bio: string | null;
  url: string | null;
  isFollowing: boolean;
  doesFollowYou: boolean;
  didRecordWithYou: boolean;
  MTFeatureStatus: string;
  contactabilityStatus: string | null;
  qAndAFeatureStatus: string | null;
  stations: [
    {
      stationId: number;
      color1: string | null;
      color2: string | null;
      color3: string | null;
      shareUrl: string;
      imageUrl: string;
      fullResImageUrl: string;
      name: string;
      isPodcastSetup: boolean;
      rssFeedUrl: string | null;
      hasAnchorBrandingRemoved: boolean;
      doDisableAnchorPostRollEpisodeOutro: boolean;
      podcastSettingsDistributionStatus?: string | null;
      podcastDistributionStatus: string;
      isExplicit: boolean;
      isDistributedThroughAnchor: boolean;
      description: string | null;
      vanitySlug: string;
      podcastCategory: { value: string; display: string } | null;
      doHideDefaultAdSlotsInEpisodes: boolean;
      sponsorshipsFeaturePreference: string | null;
      hasSupportersEnabled: boolean;
      hasEverEnabledSponsorships: boolean;
      supportedDistributionPlatformDisplayNames: string[];
      doHideCreateTrailerPrompt: boolean;
      spotifyDistributionStatus: 'off' | 'on';
      callInShareUrl: string;
      language: string;
      category: string;
      externalUrls: {
        displayName: string;
        host: string;
        isPending: boolean;
        url?: string;
      }[];
      isRssFeedEnabled: boolean;
      podcastTrailerEpisodeId: number;
      isUserEmailInRss: boolean;
      spotifyDistributionCelebratoryState: 'celebration' | 'pending' | null;
    }
  ];
  followingCount: number;
  followerCount: number;
  subscribedCohostTopics: string[];
  moneyStatus: {
    isAllowedToConnectStripe: boolean;
    isStripeConnected: boolean;
  };
  acceptedTOS: any[];
  moneyPermissibleRegions: string[];
  moneyPermissibleTimezones: string[];
  episodeTagSearchPermissibleLanguages: string[];
  maxEpisodeTags: number;
  pendingEmailAddress: string | null;
  userVerificationState: string;
};

export type FetchEpisodeAudioResponse = {
  audios: Audio[];
  episodes: Episode[];
  users: User[];
};

export async function fetchEpisodeAudio({
  webEpisodeId,
}: FetchEpisodeAudioParams): Promise<FetchEpisodeAudioResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/episodes/webEpisodeId:${webEpisodeId}`,
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error('Could not fetch episode audio');
  } catch (err) {
    throw new Error(err.messages);
  }
}
