import Bluebird from 'bluebird';
import { getEpochTime } from '../Date';
import { AnchorAPI } from '.';
import { Podcast, PodcastBase } from '../../types';
import { MoneyStatusResponse } from './user/fetchMoneyStatus';
import { FetchPodcastStatusResponse } from './fetchPodcastStatus';
import { Metadata } from '../../types/Metadata';
import { FetchPodcastEpisodesResponse } from '../../hooks/usePodcastEpisodes';
import { FetchPodcastProfileResponse } from './fetchPodcastProfile';

const getSponsorshipsActivationStatus = (
  doHideDefaultAdSlotsInEpisodes?: boolean,
  hasEverEnabledSponsorships?: boolean
) => {
  if (
    !hasEverEnabledSponsorships &&
    doHideDefaultAdSlotsInEpisodes === undefined
  ) {
    return 'notYetActivated';
  }
  if (
    hasEverEnabledSponsorships &&
    doHideDefaultAdSlotsInEpisodes === undefined
  ) {
    return 'activated';
  }
  if (hasEverEnabledSponsorships && doHideDefaultAdSlotsInEpisodes) {
    return 'deactivated';
  }
  if (hasEverEnabledSponsorships && !doHideDefaultAdSlotsInEpisodes) {
    return 'activated';
  }
  if (!hasEverEnabledSponsorships && doHideDefaultAdSlotsInEpisodes) {
    return 'deactivated';
  }
  if (!hasEverEnabledSponsorships && !doHideDefaultAdSlotsInEpisodes) {
    return 'activated';
  }
  return 'notYetActivated';
};

export type PodcastObject = {
  money: MoneyStatusResponse;
  status: FetchPodcastStatusResponse;
  metadata: Metadata;
  profile: FetchPodcastProfileResponse;
  webStationId: string;
  stationId: string;
  episodesById: {};
  podcastEpisodeIds: string[];
} & FetchPodcastEpisodesResponse;

async function fetchAndConstructPodcastObject(
  page = null,
  limit = null
): Promise<PodcastObject> {
  try {
    const myPodcastMetadataJson = await AnchorAPI.fetchMyPodcastMetadata();
    const { webStationId } = myPodcastMetadataJson;

    // webStationId can be undefined according to the types
    if (!webStationId) {
      throw new Error('webStationId is not defined');
    }

    const [
      podcastEpisodesJson,
      moneyStatusJson,
      podcastStatusJson,
      podcastProfileJson,
    ] = await Promise.all([
      AnchorAPI.fetchPodcastEpisodes(page, limit),
      AnchorAPI.fetchMoneyStatus(),
      AnchorAPI.fetchPodcastStatus(),
      AnchorAPI.fetchPodcastProfile(webStationId),
    ]);
    const { podcastEpisodes, allEpisodeWebIds } = podcastEpisodesJson;

    return {
      ...podcastEpisodesJson,
      episodesById: {},
      podcastEpisodes,
      podcastEpisodeIds: allEpisodeWebIds,
      money: moneyStatusJson,
      status: podcastStatusJson,
      metadata: myPodcastMetadataJson,
      webStationId,
      stationId: webStationId,
      profile: podcastProfileJson,
    };
  } catch (err) {
    throw new Error(`Unable to fetchAndConstructPodcastObject ${err}`);
  }
}

const decodePodcastObjectIntoPodcast = (podcast: PodcastObject): Podcast => {
  // A lot of things do not work if a podcast doesn't have a vanity slug: public profile, sharing links
  //   We either need to figure out a way to enforce every podcast has a vanity slug or
  //   work with product to determine what we do when a vanity slugs doesn't exist
  if (!podcast.metadata.vanitySlug) {
    setTimeout(() => {
      throw new Error(
        `Podcast (webId: ${podcast.podcastId}) doesnt have a vanitySlug`
      );
    }, 300);
  }
  const podcastBaseType: PodcastBase = {
    id: { kind: 'webId', webId: podcast.podcastId },
    createdEpochTime: getEpochTime(new Date(podcast.stationCreatedDate)),
    hasAcceptedTOSMonetization: Boolean(
      podcast.metadata.hasAcceptedTOSMonetization
    ),
    hasSeenSponsorshipsReminderModal: !!podcast.metadata
      .hasSeenSponsorshipsReminderModal,
    isAutoPairable: podcast.status.isAutoPairable,
    feedUrl: podcast.metadata.feedUrl || '',
    hasAnchorBranding: !!podcast.metadata.hasAnchorBranding,
    isExplicit: Boolean(podcast.metadata.isExplicit),
    iTunesCategory: podcast.metadata.itunesCategory,
    name: podcast.metadata.podcastName,
    vanitySlug: podcast.metadata.vanitySlug || '',
    description: podcast.metadata.podcastDescription,
    safePodcastDescription: podcast.metadata.safePodcastDescription,
    coverartImage:
      podcast.metadata.podcastImage || podcast.metadata.podcastImageFull
        ? {
            normalSize: podcast.metadata.podcastImage
              ? {
                  url: podcast.metadata.podcastImage,
                }
              : undefined,
            fullSize: podcast.metadata.podcastImageFull
              ? {
                  url: podcast.metadata.podcastImageFull,
                }
              : undefined,
          }
        : undefined,
    listeningPlatforms: [
      ...Object.keys(podcast.profile.podcastUrlDictionary).map(
        podcastUrlDictionaryKey => ({
          name: podcastUrlDictionaryKey,
          url: podcast.profile.podcastUrlDictionary[podcastUrlDictionaryKey],
        })
      ),
      {
        name: 'anchor',
        url: '????',
      },
    ],
    episodeIds: podcast.podcastEpisodeIds.map((webId: string) => ({
      kind: 'webId',
      webId,
    })),
    hasAuthenticatedStripe: Boolean(podcast.money.hasAuthenticatedStripe),
    // TODO: Confirm this logic.... seems like a lot just to determine is sponsorships is enabled...
    sponsorshipsActivationStatus: getSponsorshipsActivationStatus(
      podcast.metadata.doHideDefaultAdSlotsInEpisodes,
      podcast.metadata.hasEverEnabledSponsorships
    ),
    hasSupportersEnabled: Boolean(podcast.money.hasSupportersEnabled),
    doEnableListenerSupportLinkInEpisodes: Boolean(
      podcast.metadata.doEnableListenerSupportLinkInEpisodes
    ),
    podcastLanguage: podcast.profile.podcastMetadata.podcastLanguage,
    distributionRequestStatus: podcast.status.podcastStatus
      ? podcast.status.podcastStatus
      : 'noActionTaken',
    playDataRemoteData: { kind: 'notAsked' },
    walletRemoteData: { kind: 'notAsked' },
    disablePaywallsOn:
      podcast.profile.podcastMetadata.stationPaywall?.disableOn,
    // totalPlaysAllTime: ?????
    // availableBalanceInCents: number;
    // centsPending: number;
  };
  const {
    podcastExternalSource,
    podcastExternalSourceRedirected,
    podcastExternalSourceExpired,
  } = podcast.metadata;
  const externalSource: string =
    podcastExternalSource ||
    podcastExternalSourceRedirected ||
    podcastExternalSourceExpired ||
    '';
  const podcastType: Podcast = externalSource
    ? {
        kind: 'importedPodcast',
        redirectStatus: podcastExternalSourceRedirected
          ? 'redirected'
          : podcastExternalSourceExpired
          ? 'ignored'
          : 'pending',
        externalSource,
        ...podcastBaseType,
      }
    : {
        kind: 'nonImportedPodcast',
        ...podcastBaseType,
      };
  return podcastType;
};

const fetchCurrentUsersPodcast = () =>
  fetchAndConstructPodcastObject().then(decodePodcastObjectIntoPodcast);

export { fetchCurrentUsersPodcast, fetchAndConstructPodcastObject };
