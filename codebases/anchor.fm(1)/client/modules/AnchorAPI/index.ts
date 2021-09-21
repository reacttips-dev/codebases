import Promise from 'bluebird';
import serverRenderingUtils from '../../../helpers/serverRenderingUtils';
import { fetchCurrentUserPodcastNetwork } from './account/fetchCurrentUserPodcastNetwork';
import AnchorAPIError from './AnchorAPIError';
import { markAudioAsExternalAd } from './audios/markAudioAsExternalAd';
import { unMarkAudioAsExternalAd } from './audios/unMarkAudioAsExternalAd';
import { createVoiceMessage } from './createVoiceMessage';
import { deleteEpisode } from './deleteEpisode';
import { fetchAudioGroup, fetchBackgroundTracks } from './fetchAudioGroup';
import { fetchAudioLibrary } from './fetchAudioLibrary';
import { fetchBackgroundTrackOfAudio } from './fetchBackgroundTrackOfAudio';
import { fetchCurrentPodcastPlaysByDateRange } from './fetchCurrentPodcastPlaysByDateRange';
import { fetchCurrentPodcastsPlayData } from './fetchCurrentPodcastsPlayData';
import { fetchCurrentPodcastsPlaysByAgeRange } from './fetchCurrentPodcastsPlaysByAgeRange';
import { fetchCurrentPodcastsPlaysByApp } from './fetchCurrentPodcastsPlaysByApp';
import { fetchCurrentPodcastsPlaysByDevice } from './fetchCurrentPodcastsPlaysByDevice';
import { fetchCurrentPodcastsPlaysByGender } from './fetchCurrentPodcastsPlaysByGender';
import { fetchCurrentPodcastsPlaysByGeo } from './fetchCurrentPodcastsPlaysByGeo';
import { fetchCurrentPodcastsTopPlayedEpisodes } from './fetchCurrentPodcastsTopPlayedEpisodes';
import { fetchCurrentPodcastsWallet } from './fetchCurrentPodcastsWallet';
import { fetchCurrentUsersPodcast } from './fetchCurrentUsersPodcast';
import { fetchEpisodePerformance } from './fetchEpisodePerformance';
import { fetchEpisodePlaysByDateRange } from './fetchEpisodePlaysByDateRange';
import { fetchEpisodePlaysComparison } from './fetchEpisodePlaysComparison';
import { fetchEpisodesDeprecated } from './fetchEpisodesDeprecated';
import { fetchEpisodeTotalPlayCount } from './fetchEpisodeTotalPlayCount';
import { fetchLogin } from './fetchLogin';
import { fetchMoneyStatus } from './user/fetchMoneyStatus';
import { fetchMoneyWallet } from './fetchMoneyWallet';
import { fetchMyPodcastMetadata } from './podcast/fetchMyPodcastMetadata';
import { fetchPodcastCategories } from './fetchPodcastCategories';
import { fetchInteractivityPoll } from './v3/episodes/fetchInteractivityPoll';
import { createInteractivityPoll } from './v3/episodes/createInteractivityPoll';
import { fetchListenerQuestion } from './v3/episodes/fetchListenerQuestion';
import { fetchListenerQuestionReplies } from './v3/episodes/fetchListenerQuestionReplies';
import { createListenerQuestion } from './v3/episodes/createListenerQuestion';
import { deleteListenerQuestion } from './v3/episodes/deleteListenerQuestion';
import { modifyListenerQuestionReply } from './v3/episodes/modifyListenerQuestionReply';
import { blockSpotifyUser } from './v3/interactivity/blockSpotifyUser';
import { updateContactabilityStatus } from './v3/settings/updateContactabilityStatus';
import { fetchContactabilityLocationRule } from './contactability/fetchContactabilityLocationRule';
import { fetchPodcastMetadata } from './v3/stations/fetchPodcastMetadata';
import { fetchPodcastStatus } from './fetchPodcastStatus';
import { fetchSignupAndLogin } from './fetchSignupAndLogin';
import { fetchSocialUrls } from './fetchSocialUrls';
import { fetchVideoTranscriptionRequestStatus } from './fetchVideoTranscriptionRequestStatus';
import { fetchVideoTranscriptionRequestStatusByWebAudioId } from './fetchVideoTranscriptionRequestStatusByWebAudioId';
import { generateVideoTranscriptionRequest } from './generateVideoTranscriptionRequest';
import { hideCallIn } from './hideCallIn';
import { logoutCurrentUser } from './logoutCurrentUser';
import { optOutOfPodcastDistribution } from './optOutOfPodcastDistribution';
import { requestSpotifyOnlyDistribution } from './podcast/requestSpotifyOnlyDistribution';
import { retryAudioTransformation } from './retryAudioTransformation';
import { transformAudioWithBackgroundTrack } from './transformAudioWithBackgroundTrack';
import { updateCurrentUserEmail } from './updateCurrentUserEmail';
import { updatePodcastMetadata } from './v3/stations/updatePodcastMetadata';
import { updateSocialUrls } from './updateSocialUrls';
import { updateTranscription } from './updateTranscription';
import { fetchPendingEmail } from './user/fetchPendingEmail';
import { fetchPodcastNetworkStations } from './user/fetchPodcastNetworkStations';
import { fetchUserVerificationState } from './user/fetchUserVerificationState';
import { requestPasswordReset } from './user/requestPasswordReset';
import { resendVerificationEmail } from './user/resendVerificationEmail';
import { submitPasswordReset } from './user/submitPasswordReset';
import { verifyUserEmail } from './user/verifyUserEmail';
import { fetchPartnerIds } from './user/fetchPartnerIds';
import {
  fetchUserDeletionRequest,
  requestUserDeletion,
} from './userDeletionRequest';
import { fetchEpisodeAggregatedPerformance } from './v3/analytics/fetchEpisodeAggregatedPerformance';
import { createMusicSegment } from './v3/music/createMusicSegment';
import { fetchSearchResults } from './v3/music/fetchSearchResults';
import { fetchSpotifyAuthenticationStatus } from './v3/music/fetchSpotifyAuthenticationStatus';
import { fetchSpotifyPlaylists } from './v3/music/fetchSpotifyPlaylists';
import { fetchSpotifyPlaylistTracks } from './v3/music/fetchSpotifyPlaylistTracks';
import { fetchDistributionData } from './v3/settings/fetchDistributionData';
import { fetchUser } from './v3/settings/fetchUser';
import { updateDistributionData } from './v3/settings/updateDistributionData';
import { fetchAudioProcessingStatus } from './v3/upload/fetchAudioProcessingStatus';
import { fetchSignedUrl } from './v3/upload/fetchSignedUrl';
import { startAudioProcessing } from './v3/upload/startAudioProcessing';
import { uploadFile } from './v3/upload/uploadFile';
import { fetchWaveformData } from './v3/waveform/fetchWaveformData';
import { createWaveformData } from './v3/waveform/createWaveformData';
import { uploadFileMultipart } from './v3/upload/uploadFileMultipart';
import { fetchAllEnabledFeatureFlags } from './v3/featureFlag/fetchAllEnabledFeatureFlags';
import { uploadImage } from './uploadImage';
import { fetchMediaProcessingStatus } from './v3/upload/fetchMediaProcessingStatus';
import { startMediaProcessing } from './v3/upload/startMediaProcessing';
import { optOutListenerSupport } from './optOutListenerSupport';
import { deleteImportItem } from './v3/stations/deleteImportItem';
import { importRssFeed } from './v3/stations/importRssFeed';
import { fetchImportStatus } from './v3/stations/fetchImportStatus';
import { fetchWrappedStatus } from './v3/stations/fetchWrappedStatus';
import {
  createWordPressImportJob,
  fetchNewWordPressPostsCount,
  fetchWordPressImportJobStatus,
  fetchWordPressPostMetadata,
  importNewWordPressPosts,
} from './v3/wordpress';
import { createEpisode, updateEpisodeMetadata, fetchEpisode } from './episode';
import { fetchVideoPreviewStatus } from './v3/upload/fetchVideoPreviewStatus';
import { createVideoPreview } from './v3/upload/createVideoPreview';
import {
  createSpeechSynthesisTask,
  fetchSpeechSynthesisTask,
  fetchAdCuePoints,
  fetchEpisodeAudio,
  fetchEpisodeVideo,
  fetchEpisodes,
  fetchIsInPublishedMTEpisode,
  removeVideoFromEpisode,
  saveAdCuePoints,
  saveAudioToEpisode,
  saveVideoToEpisode,
  updateEpisodeMedia,
} from './v3/episodes';
import {
  fetchPaywallsPrices,
  fetchListenerCountryCode,
  fetchLocalPaywallPrices,
  fetchPaywallMetadata,
  fetchPaywallAnalytics,
  updatePaywallEpisodes,
  updatePaywall,
  disablePaywall,
  createPaywallSubscription,
} from './v3/paywalls';
import { getCsrfToken } from './getCsrfToken';
import {
  createPodcastSubscription,
  cancelPodcastSubscription,
  optIntoPodcastSubscriptionEmails,
  fetchSubscriberEmailList,
} from './v3/podcastSubscriptions';
import { Metadata } from '../../types/Metadata';
import { activateListenerSupport } from './activateListenerSupport';
import { fetchProductsForListenerSupport } from './products/fetchProductsForListenerSupport';
import { fetchSponsorships } from './v3/sponsor/fetchSponsorships';
import { updateSponsorshipCampaigns } from './v3/sponsor/updateSponsorshipCampaigns';
import { fetchSpanStatus } from './v3/span/fetchSpanStatus';
import { fetchTermsAndConditions } from './v3/span/fetchTermsAndConditions';
import { updateSpanStatus } from './v3/span/updateSpanStatus';
import { fetchPodcastProfile } from './fetchPodcastProfile';
import { updateInteractivityPoll } from './v3/episodes/updateInteractivityPoll';
import { deleteInteractivityPoll } from './v3/episodes/deleteInteractivityPoll';
import { getGeoRegion } from './compliance/getGeoRegion';
import { updateBirthdate } from './updateBirthdate';

function getIsMobile() {
  return serverRenderingUtils.isIOS() || serverRenderingUtils.isAndroidChrome();
}

const convertDataToFormData = (data: any) => {
  const formData = new FormData();

  // eslint-disable-next-line no-restricted-syntax
  for (const k in data) {
    if (k === 'file') {
      const isFileValueAnArray = Array.isArray(data[k]);
      const file = isFileValueAnArray ? data[k][0] : data[k];
      if (isFileValueAnArray) {
        const fileValueArrayIncludesFilename = !!data[k][1];
        if (fileValueArrayIncludesFilename) {
          const fileName = data[k][1];
          formData.append(k, file, fileName);
        }
      }
      formData.append(k, file);
    } else {
      formData.append(k, data[k]);
    }
  }
  return formData;
};

const AnchorAPI = {
  cancelSupportForStation: (
    stationId: string,
    cancelCode: string,
    _csrf: string
  ) =>
    new Promise((resolve, reject) => {
      fetch(`/api/station/${stationId}/support/cancel`, {
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        method: 'POST',
        body: JSON.stringify({
          cancelCode,
          _csrf,
        }),
      })
        .then(response => {
          if (response.ok) {
            resolve(response);
          } else {
            throw new AnchorAPIError(
              response,
              `Non 200 response status: ${response.status}`
            );
          }
        })
        .catch(err => {
          reject(err);
        });
    }),
  getStationIdForVanityName: (vanitySlug: string): Promise<string> =>
    new Promise((resolve, reject) => {
      fetch(`/api/vanityslug?url=${vanitySlug}`, {
        credentials: 'same-origin',
        method: 'GET',
      })
        .then(response => {
          if (response.status === 200) {
            response.json().then(responseJSON => {
              const { stationId } = responseJSON;
              if (stationId) {
                resolve(stationId);
              } else {
                reject(new AnchorAPIError(response, `No station found.`));
              }
            });
          } else {
            reject(
              new AnchorAPIError(
                response,
                `Non 200 response status: ${response.status}`
              )
            );
          }
        })
        .catch(err => {
          reject(err);
        });
    }),
  // Note: The onUploadProgressUpdate callback represents the status of the file
  //       or blob uploading to the server and does not include the processing. So
  //       for example, you may get a callback will 100 (100%) complete, this represents
  //       that file or blob has been upload to the server, but it doesn't mean the request
  //       is done, because the next step is processing. The request stays open until
  //       this processing is complete.
  //       TLDR: 100% does not represent the request is complete, and sometimes, depeneding
  //             on how much processing needs to happen, the request can stay open for a long
  //             time after 100% upload is complete, because the processing is happening.
  uploadAudioFile: (
    // @ts-ignore
    fileOrBlob,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onUploadProgressUpdated = (percentComplete: number) => null,
    onProcessingDidStart = () => null,
    caption: string,
    options = {}
  ) =>
    new Promise((resolve, reject) => {
      const isFile = typeof fileOrBlob.name === 'string';
      const isBlob = !isFile;

      // @ts-ignore
      const getFileNameForBlob = blob => {
        const fileType = blob.type === 'audio/wav' ? 'wav' : 'webm';
        const fileName = `blob-${Date.now()}.${fileType}`;
        return fileName;
      };
      // @ts-ignore
      const getFileNameForFile = file => {
        const fileName = file.name.replace(/[^a-zA-Z0-9-.]/g, '-'); // unix-safe file path name
        return fileName;
      };
      // NOTE: Should we set caption
      const path = isBlob ? '/api/audio/recording' : '/api/audio/file';
      const fileName = isBlob
        ? getFileNameForBlob(fileOrBlob)
        : isFile
        ? getFileNameForFile(fileOrBlob)
        : '';

      const data = {
        file: [fileOrBlob, fileName],
        ...(caption ? { caption } : {}),
        ...options,
      };
      const formData = convertDataToFormData(data);
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener(
        'progress',
        evt => {
          if (evt.lengthComputable) {
            const percentComplete = parseInt(
              `${100 * (evt.loaded / evt.total)}`,
              10
            );
            onUploadProgressUpdated(percentComplete);
            if (percentComplete === 100) {
              onProcessingDidStart();
            }
          }
        },
        false
      );
      xhr.open('POST', path);
      xhr.onload = function onXhrLoad() {
        // What should be here
        if (xhr.status === 200) {
          try {
            resolve(JSON.parse(xhr.response));
          } catch (err) {
            reject(err);
          }
        }
        if (xhr.status === 401) {
          reject(
            new AnchorAPIError(
              {}, // This is usually the response object. What should it be?
              `Non 200 response status: ${xhr.status}`
            )
          );
        }
      };
      // TODO: new error state. (usually CORS problem)
      xhr.onerror = reject;

      xhr.send(formData);
    }),
  getPodcastMetadata: (stationId: string): Promise<Metadata> =>
    new Promise((resolve, reject) => {
      fetch(`/api/v3/profile/${stationId}`, {
        credentials: 'same-origin',
      })
        .then(response => {
          if (response.status === 200) {
            response.json().then(responseJSON => {
              const { podcastMetadata } = responseJSON;
              resolve(podcastMetadata);
            });
          } else {
            reject(
              new AnchorAPIError(
                response,
                `Non 200 response status: ${response.status}`
              )
            );
          }
        })
        .catch(err => {
          reject(err);
        });
    }),
  getGeoRegion,
  getStation: (stationId: string) =>
    new Promise((resolve, reject) =>
      fetch(`/api/station/${stationId}`, {
        credentials: 'same-origin',
      })
        .then(response => {
          if (response.status === 200) {
            response.json().then(responseJSON => {
              const { stations } = responseJSON;
              const station = stations[0];
              resolve(station);
            });
          } else {
            reject(
              new AnchorAPIError(
                response,
                `Non 200 response status: ${response.status}`
              )
            );
          }
        })
        .catch(err => {
          reject(err);
        })
    ),
  getUserEmailAddress: (): Promise<string> =>
    new Promise((resolve, reject) =>
      fetch('/api/user/email', {
        credentials: 'same-origin',
      })
        .then(response => {
          if (response.status === 200) {
            response.json().then(responseJSON => {
              const { emailAddress } = responseJSON;
              resolve(emailAddress);
            });
          } else {
            reject(
              new AnchorAPIError(
                response,
                `Non 200 response status: ${response.status}`
              )
            );
          }
        })
        .catch(err => {
          reject(err);
        })
    ),
  removeAllMusicInEpisodesForUser: () =>
    new Promise((resolve, reject) =>
      fetch(`/api/user/removemusic`, {
        credentials: 'same-origin',
        method: 'POST',
      })
        .then(response => {
          if (response.status === 200) {
            resolve();
            return;
          }
          reject(
            new AnchorAPIError(
              response,
              `Non 200 response status: ${response.status}`
            )
          );
        })
        .catch(err => {
          reject(err);
        })
    ),
  updatePodcastMetadataDeprecated: (data = {}) => {
    // TODO: the backend expects data.externalLinks and it chokes if you dont send it. We should modify the backend to handle the request when externalLinks doesn't exists. For now, we're handling it below.
    // data shape:
    // {
    //   externalLinks: []
    //   ?????
    // }
    // @ts-ignore
    const { externalLinks = [] } = data;
    const putData = { ...data, externalLinks };
    return fetch('/api/podcast/metadata', {
      method: 'PUT',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(putData),
    }).then(response => {
      if (response.status === 200) {
        return response.json();
      }
      throw new AnchorAPIError(
        response,
        `Non 200 response status: ${response.status}`
      );
    });
  },
  updateCoverArtAttribution: (data = {}) =>
    new Promise((resolve, reject) =>
      fetch('/api/podcast/image/attribution', {
        method: 'PUT',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(data),
      })
        .then(response => {
          if (response.ok) {
            resolve(); // no metadata
          } else {
            reject(
              new AnchorAPIError(
                response,
                `Non 200 response status: ${response.status}`
              )
            );
          }
        })
        .catch(err => {
          reject(err);
        })
    ),
  // Takes an image url and returns urls to proccessed versions of the image.
  // Returns responseJSON shape:
  // {
  //   podcastImage: string -- url
  //   podcastImage400: string -- url
  // }
  createAnchorImagesFromImageUrl: (url: string, options = {}) => {
    // options shape:
    // {
    //   hasAnchorBranding: bool
    //   isEpisode: bool
    //   doOverrideSize: bool
    // }
    const formData = new FormData();
    formData.append('fileUrl', url);

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const k in options) {
      // @ts-ignore
      formData.append(k, options[k]);
    }
    return new Promise((resolve, reject) => {
      fetch('/api/onboarding/image', {
        method: 'POST',
        credentials: 'same-origin',
        body: formData,
      })
        .then(response => {
          if (response.status === 200) {
            response
              .json()
              .then(responseJSON => {
                resolve(responseJSON);
              })
              .catch(() => {
                reject(new Error(`Response doesnt include json`));
              });
          } else if (response.status === 400) {
            reject(new AnchorAPIError(response, `Missing image`));
          } else {
            reject(
              new AnchorAPIError(
                response,
                `Non 200 response status: ${response.status}`
              )
            );
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  publishPodcast: () =>
    new Promise((resolve, reject) => {
      fetch('/api/podcast/publish', {
        method: 'POST',
        credentials: 'same-origin',
      })
        .then(response => {
          if (response.ok) {
            resolve(response);
          } else {
            reject(
              new AnchorAPIError(
                response,
                `Non 200 response status: ${response.status}`
              )
            );
          }
        })
        .catch(err => {
          reject(err);
        });
    }),
  optOutOfPodcastDistribution,
  fetchPodcastEpisode: (episodeId: string) =>
    new Promise((resolve, reject) => {
      fetch(`/api/podcastepisode/${episodeId}`, {
        credentials: 'same-origin',
      })
        .then(response => {
          if (response.status === 200) {
            response.json().then(responseJSON => {
              resolve(responseJSON);
            });
          } else {
            reject(
              new AnchorAPIError(
                response,
                `Non 200 response status: ${response.status}`
              )
            );
          }
        })
        .catch(err => {
          reject(err);
        });
    }),

  fetchPodcastEpisodes: (page = null, limit = null) => {
    const baseUrlPath = '/api/podcastepisode';
    let urlPath = baseUrlPath;
    if (page) {
      urlPath =
        limit === null
          ? `${baseUrlPath}?page=${page}`
          : `${baseUrlPath}?page=${page}&limit=${limit}`;
    }

    return fetch(urlPath, {
      credentials: 'same-origin',
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        if (response.status === 400) {
          return Promise.reject(new AnchorAPIError(response, `Missing image`));
        }
        return Promise.reject(
          new AnchorAPIError(
            response,
            `Non 200 response status: ${response.status}`
          )
        );
      })
      .catch(err => {
        throw err;
      });
  },
  fetchPodcastStatus,
  fetchMyPodcastMetadata,
  fetchPodcastNetworkStations,
  // data shape
  // {
  //   vanitySlug: string
  //   betaCode: string
  //   feedUrl: string
  //   name: string
  //   email: string
  //   password: string
  // }
  createAccount: (data: any) =>
    new Promise((resolve, reject) =>
      fetch('/api/user/account/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(data),
      })
        .then(response => {
          if (response.status === 200) {
            response.json().then(responseJSON => {
              resolve(responseJSON);
            });
          } else if (response.status === 400) {
            reject(new AnchorAPIError(response, `Missing image`));
          } else {
            reject(
              new AnchorAPIError(
                response,
                `Non 200 response status: ${response.status}`
              )
            );
          }
        })
        .catch(err => {
          reject(err);
        })
    ),
  fetchCoverArtImageChoices: (searchText: string, offset: number) =>
    // note -- not "v3"
    fetch(`/api/proxy/images/search?query=${searchText}&offset=${offset}`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    }).then(response => {
      if (response.status === 200) {
        return response
          .json()
          .then(responseJSON => responseJSON && responseJSON.results);
      }
      if (response.status === 400) {
        return Promise.reject(new AnchorAPIError(response, `Missing image`));
      }
      return Promise.reject(
        new AnchorAPIError(
          response,
          `Non 200 response status: ${response.status}`
        )
      );
    }),
  fetchCoverArtTextOverlay: ({
    podcastName,
    fontName,
    webStationId,
  }: {
    podcastName: string;
    fontName: string;
    webStationId: string;
  }) =>
    new Promise((resolve, reject) =>
      // note -- not "v3"
      fetch('/api/proxy/images/overlays', {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          webStationId,
          podcastName,
          expectedFonts: [fontName],
        }),
      })
        .then(response => {
          if (response.status === 200) {
            response.json().then(responseJSON => {
              resolve(responseJSON && responseJSON.overlays);
            });
          } else if (response.status === 400) {
            reject(new AnchorAPIError(response, `Missing image`));
          } else {
            reject(
              new AnchorAPIError(
                response,
                `Non 200 response status: ${response.status}`
              )
            );
          }
        })
        .catch(err => {
          reject(err);
        })
    ),
  fetchCroppedImage: ({
    imageUrl,
    x,
    y,
    width,
    height,
  }: {
    imageUrl: string;
    x: any;
    y: any;
    width: any;
    height: any;
  }) => {
    const data = {
      x: parseInt(x, 10),
      y: parseInt(y, 10),
      ...(imageUrl ? { imageUrl } : {}),
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    };
    return new Promise((resolve, reject) =>
      fetch('/api/proxy/images/crop', {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(data),
      })
        .then(response => {
          if (response.status === 200) {
            response.json().then(responseJSON => {
              resolve(responseJSON);
            });
          } else if (response.status === 400) {
            reject(new AnchorAPIError(response, `Missing image`));
          } else {
            reject(
              new AnchorAPIError(
                response,
                `Non 200 response status: ${response.status}`
              )
            );
          }
        })
        .catch(err => {
          reject(err);
        })
    );
  },
  fetchSplitAudio: ({
    webAudioId,
    splitsAtMilliseconds,
    mergeFiles,
  }: {
    webAudioId: string;
    splitsAtMilliseconds: {
      offset: number;
      caption: string;
      ignore: boolean;
    }[];
    mergeFiles: boolean;
  }) =>
    new Promise((resolve, reject) =>
      fetch(`/api/audio/${webAudioId}/transformation/request/split`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          mergeFiles,
          points: splitsAtMilliseconds.map(({ offset, caption, ignore }) => ({
            offset,
            caption,
            ignore,
          })),
        }),
      })
        .then(response => {
          if (response.status === 200) {
            response.json().then(responseJSON => {
              resolve(responseJSON);
            });
          } else if (response.status === 400) {
            reject(new AnchorAPIError(response, `Missing image`));
          } else {
            reject(
              new AnchorAPIError(
                response,
                `Non 200 response status: ${response.status}`
              )
            );
          }
        })
        .catch(err => {
          reject(err);
        })
    ),
  fetchFinalCoverArtImage: ({
    podcastName,
    fontName,
    imageUrl,
    x,
    y,
    width,
    height,
    fillHex,
    horizontalAlignment,
    verticalAlignment,
    text,
  }: any) => {
    const data = {
      imageUrl,
      podcastName,
      fontName,
      x: parseInt(x, 10),
      y: parseInt(y, 10),
      width: parseInt(width, 10),
      height: parseInt(height, 10),
      fillHex,
      horizontalAlignment,
      verticalAlignment,
      text,
    };

    return new Promise((resolve, reject) =>
      fetch('/api/proxy/images/render', {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(data),
      })
        .then(response => {
          if (response.status === 200) {
            response.json().then(responseJSON => {
              resolve(responseJSON);
            });
          } else if (response.status === 400) {
            reject(new AnchorAPIError(response, `Missing image`));
          } else {
            reject(
              new AnchorAPIError(
                response,
                `Non 200 response status: ${response.status}`
              )
            );
          }
        })
        .catch(err => {
          reject(err);
        })
    );
  },
  updateSponsorshipsPreference: ({
    webStationId,
    sponsorshipsFeaturePreference,
  }: {
    webStationId: string;
    sponsorshipsFeaturePreference: string;
  }): Promise<Response> =>
    new Promise((resolve, reject) => {
      return fetch(
        `/api/proxy/v3/sponsor/webStationId:${webStationId}/updateSponsorshipsPreference`,
        {
          method: 'POST',
          credentials: 'same-origin',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            sponsorshipsFeaturePreference,
          }),
        }
      )
        .then(res => {
          return resolve(res);
        })
        .catch(reject);
    }),
  // @ts-ignore
  publishExistingAudioAsAd: ({ adCampaignId, webStationId, webAudioId } = {}) =>
    new Promise((resolve, reject) => {
      fetch(`/api/proxy/v3/sponsor/webStationId:${webStationId}/existing`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          adCampaignId,
          webAudioId,
        }),
      })
        .then(resolve)
        .catch(reject);
    }).then(response => {
      // @ts-ignore
      const { status } = response;
      if (status === 200 || status === 400) {
        // @ts-ignore
        return response.json();
      }
      return Promise.reject(new AnchorAPIError(response, 'Server error.'));
    }),
  enableSponsorshipsOnAllEpisodes: (webStationId: string) =>
    new Promise((resolve, reject) => {
      fetch(
        `/api/proxy/v3/sponsor/webStationId:${webStationId}/sponsorstate/enableall`,
        {
          method: 'POST',
          credentials: 'same-origin',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        }
      )
        .then(resolve)
        .catch(reject);
    }).then(response => {
      // @ts-ignore
      if (response.ok) {
        return {};
      }
      return Promise.reject(new AnchorAPIError(response, 'Server error.'));
    }),
  // @ts-ignore
  updateEpisodeAdState: ({ webEpisodeId, isAdSlotEnabled } = {}) =>
    new Promise((resolve, reject) => {
      fetch(
        `/api/proxy/v3/sponsor/episode/webEpisodeId:${webEpisodeId}/sponsorstate`,
        {
          method: 'POST',
          credentials: 'same-origin',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            isEnabled: isAdSlotEnabled,
          }),
        }
      )
        .then(resolve)
        .catch(reject);
    }).then(response => {
      // @ts-ignore
      const { status } = response;
      if (status === 200) {
        // @ts-ignore
        return response.json();
      }
      throw new AnchorAPIError(
        response,
        // @ts-ignore
        `Non 200 response status: ${response.status}`
      );
    }),
  fetchAdCampaignForStation: (campaignId: string, webStationId: string) =>
    new Promise((resolve, reject) => {
      fetch(
        `/api/proxy/v3/sponsor/webStationId:${webStationId}/campaigns/${campaignId}`,
        {
          credentials: 'same-origin',
          method: 'GET',
        }
      )
        .then(resolve)
        .catch(reject);
    })
      .then(response => {
        // @ts-ignore
        const { status } = response;
        if (status === 200 || status === 400) {
          // @ts-ignore
          return response.json();
        }
        return Promise.reject(new AnchorAPIError(response, 'Server error.'));
      })
      .then(responseJson => responseJson),
  deleteCampaign: ({
    webStationId,
    userId,
    campaignId,
  }: {
    webStationId: string;
    userId: number;
    campaignId: string;
  }) =>
    new Promise((resolve, reject) => {
      fetch(`/api/proxy/v3/sponsor/delete`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({
          userId,
          webStationId,
          adCampaignId: campaignId,
        }),
      })
        .then(response => {
          if (response.status === 200) {
            resolve();
            return;
          }
          reject(
            new AnchorAPIError(
              response,
              `Non 200 response status: ${response.status}`
            )
          );
        })
        .catch(err => {
          reject(err);
        });
    }),
  fetchAllEnabledFeatureFlagsDeprecated: (baseUrl = '') =>
    new Promise((resolve, reject) => {
      fetch(`${baseUrl}/api/featureflag/enabled`, {
        credentials: 'same-origin',
      })
        .then(resolve)
        .catch(reject);
    }).then(response => {
      // @ts-ignore
      if (response.status === 200) {
        // @ts-ignore
        return response.json();
      }
      throw new AnchorAPIError(
        response,
        // @ts-ignore
        `Non 200 response status: ${response.status}`
      );
    }),
  checkAndPersistRedirect: (webStationId: string, userId: number) =>
    new Promise((resolve, reject) => {
      fetch(
        `/api/proxy/v3/stations/webStationId:${webStationId}/checkAndPersistRedirect`,
        {
          credentials: 'same-origin',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          method: 'POST',
          body: JSON.stringify({
            userId,
          }),
        }
      )
        .then(resolve)
        .catch(reject);
    }).then(response => {
      // @ts-ignore
      if (!response.ok) {
        return new AnchorAPIError(
          response,
          // @ts-ignore
          `Non 200 response status: ${response.status}`
        );
      }
      // @ts-ignore
      return response.json();
    }),
  joinRWFCall: (
    conferenceCallId: string,
    inviteCode: string,
    displayName: string,
    isLoggedIn: boolean,
    emailAddress: string
  ) =>
    new Promise((resolve, reject) => {
      const body = {
        displayName,
        deviceKind: getIsMobile() ? 'mobile' : 'desktop',
        ...(!isLoggedIn ? { emailAddress } : {}),
      };
      fetch(
        isLoggedIn
          ? `/api/proxy/jrtrot/${conferenceCallId}/join`
          : `/api/proxy/jrtrot/${inviteCode}/joinanon`,
        {
          credentials: 'same-origin',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          method: 'POST',
          body: JSON.stringify(body),
        }
      )
        .then(response => {
          if (response.status === 200) {
            response.json().then(responseJSON => {
              resolve(responseJSON);
            });
          } else {
            reject(
              new AnchorAPIError(
                response,
                `Non 200 response status: ${response.status}`
              )
            );
          }
        })
        .catch(err => {
          reject(err);
        });
    }),
  registerSessionConnection: ({
    conferenceCallId,
    sessionId,
    anonUserUUID,
  }: {
    conferenceCallId: string;
    sessionId: string;
    anonUserUUID: string;
  }) =>
    new Promise((resolve, reject) => {
      const postData = {
        connectionId: sessionId,
        ...(anonUserUUID ? { uuid: anonUserUUID } : {}),
      };
      fetch(`/api/proxy/jrtrot/${conferenceCallId}/connection`, {
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        method: 'POST',
        body: JSON.stringify(postData),
      })
        .then(response => {
          if (response.status === 200) {
            response.json().then(responseJSON => {
              resolve(responseJSON);
            });
          } else {
            reject(
              new AnchorAPIError(
                response,
                `Non 200 response status: ${response.status}`
              )
            );
          }
        })
        .catch(err => {
          reject(err);
        });
    }),
  fetchConferenceCallInfo: (inviteCode: string) =>
    new Promise((resolve, reject) => {
      fetch(`/api/proxy/jrtrot/invited/${inviteCode}`, {
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        method: 'GET',
      })
        .then(response => {
          if (response.status === 200) {
            response.json().then(responseJSON => {
              resolve(responseJSON);
            });
          } else {
            reject(
              new AnchorAPIError(
                response,
                `Non 200 response status: ${response.status}`
              )
            );
          }
        })
        .catch(err => {
          reject(err);
        });
    }),
  fetchConferenceCallParticipants: (conferenceCallId: string) =>
    new Promise((resolve, reject) => {
      fetch(`/api/proxy/jrtrot/${conferenceCallId}`, {
        credentials: 'same-origin',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        method: 'GET',
      })
        .then(response => {
          if (response.status === 200) {
            response.json().then(responseJSON => {
              resolve(responseJSON);
            });
          } else {
            reject(
              new AnchorAPIError(
                response,
                `Non 200 response status: ${response.status}`
              )
            );
          }
        })
        .catch(err => {
          reject(err);
        });
    }),

  fetchEpisodesDeprecated,
  fetchUserDeletionRequest,
  requestUserDeletion,
  deleteEpisode,
  fetchCurrentUsersPodcast,
  fetchCurrentPodcastsPlayData,
  fetchCurrentPodcastsWallet,
  fetchCurrentPodcastPlaysByDateRange,
  fetchCurrentPodcastsTopPlayedEpisodes,
  fetchCurrentPodcastsPlaysByAgeRange,
  fetchCurrentPodcastsPlaysByApp,
  fetchCurrentPodcastsPlaysByDevice,
  fetchCurrentPodcastsPlaysByGeo,
  fetchCurrentPodcastsPlaysByGender,
  fetchEpisodeTotalPlayCount,
  fetchEpisodePlaysByDateRange,
  fetchEpisodePlaysComparison,
  fetchEpisodePerformance,
  fetchLogin,
  fetchSignupAndLogin,
  fetchMoneyStatus,
  fetchMoneyWallet,
  updateCurrentUserEmail,
  createVoiceMessage,
  logoutCurrentUser,
  fetchAudioGroup,
  fetchBackgroundTracks,
  fetchAudioLibrary,
  transformAudioWithBackgroundTrack,
  fetchBackgroundTrackOfAudio,
  retryAudioTransformation,
  fetchPodcastCategories,
  updateTranscription,
  generateVideoTranscriptionRequest,
  fetchVideoTranscriptionRequestStatus,
  fetchVideoTranscriptionRequestStatusByWebAudioId,
  hideCallIn,
  updatePodcastMetadata,
  fetchPodcastMetadata,
  updateSocialUrls,
  fetchSocialUrls,
  requestPasswordReset,
  submitPasswordReset,
  verifyUserEmail,
  resendVerificationEmail,
  fetchUserVerificationState,
  fetchPendingEmail,
  updateDistributionData,
  fetchDistributionData,
  fetchUser,
  fetchEpisodeAggregatedPerformance,
  fetchSignedUrl,
  createMusicSegment,
  startAudioProcessing,
  uploadFile,
  uploadFileMultipart,
  fetchCurrentUserPodcastNetwork,
  fetchAudioProcessingStatus,
  fetchSearchResults,
  fetchSpotifyPlaylists,
  fetchSpotifyPlaylistTracks,
  fetchSpotifyAuthenticationStatus,
  fetchWaveformData,
  createWaveformData,
  createEpisode,
  fetchEpisode,
  fetchAllEnabledFeatureFlags,
  uploadImage,
  updateEpisodeMetadata,
  fetchAdCuePoints,
  saveAdCuePoints,
  fetchMediaProcessingStatus,
  startMediaProcessing,
  markAudioAsExternalAd,
  unMarkAudioAsExternalAd,
  saveVideoToEpisode,
  fetchEpisodeVideo,
  fetchEpisodeAudio,
  removeVideoFromEpisode,
  updateEpisodeMedia,
  requestSpotifyOnlyDistribution,
  saveAudioToEpisode,
  optOutListenerSupport,
  fetchEpisodes,
  fetchIsInPublishedMTEpisode,
  deleteImportItem,
  importRssFeed,
  fetchImportStatus,
  fetchWrappedStatus,
  fetchContactabilityLocationRule,
  updateContactabilityStatus,
  createWordPressImportJob,
  fetchNewWordPressPostsCount,
  fetchWordPressImportJobStatus,
  fetchWordPressPostMetadata,
  importNewWordPressPosts,
  fetchVideoPreviewStatus,
  createVideoPreview,
  createSpeechSynthesisTask,
  fetchSpeechSynthesisTask,
  fetchPartnerIds,
  fetchPaywallsPrices,
  fetchListenerCountryCode,
  fetchLocalPaywallPrices,
  fetchPaywallMetadata,
  fetchPaywallAnalytics,
  updatePaywallEpisodes,
  updatePaywall,
  disablePaywall,
  createPaywallSubscription,
  createPodcastSubscription,
  cancelPodcastSubscription,
  optIntoPodcastSubscriptionEmails,
  fetchSubscriberEmailList,
  getCsrfToken,
  activateListenerSupport,
  fetchProductsForListenerSupport,
  fetchSponsorships,
  fetchSpanStatus,
  fetchTermsAndConditions,
  fetchInteractivityPoll,
  createInteractivityPoll,
  updateSponsorshipCampaigns,
  updateSpanStatus,
  fetchPodcastProfile,
  updateInteractivityPoll,
  deleteInteractivityPoll,
  fetchListenerQuestion,
  fetchListenerQuestionReplies,
  createListenerQuestion,
  deleteListenerQuestion,
  modifyListenerQuestionReply,
  blockSpotifyUser,
  updateBirthdate,
};

// eslint-disable-next-line import/no-default-export
export { AnchorAPI as default, AnchorAPI, AnchorAPIError };
