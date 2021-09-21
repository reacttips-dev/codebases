import Bluebird from 'bluebird';
import moment from 'moment';
import { sortByDate } from '../Episode';
// eslint-disable-next-line import/no-unresolved
import { Episode, EpisodeStatus } from '../../types';
import AnchorAPIError from './AnchorAPIError';

const decodeEpisodeJsonIntoEpisodeStatus = (
  episodeJson: any
): EpisodeStatus | Error => {
  const now = moment(new Date());
  if (moment(episodeJson.publishOn).isAfter(now)) {
    return {
      kind: 'scheduledToBePublished',
      date: moment(episodeJson.publishOn).toDate(),
    };
  }
  if (episodeJson.publishOn) {
    return {
      kind: 'published',
      date: moment(episodeJson.publishOn).toDate(),
      fullEpisodeAudioFileUrl: episodeJson.url,
    };
  }
  if (!episodeJson.publishOn) {
    return {
      kind: 'savedAsDraft',
      date: moment(episodeJson.created).toDate(),
    };
  }
  return new Error('decodeEpisodeJsonIntoEpisodeStatus issue');
};

const decodeResponseIntoEpisodes = (json: any): Episode[] =>
  sortByDate(
    json.podcastEpisodes.map((jsonEpisode: any) => ({
      adsCount: jsonEpisode.adCount,
      id: {
        kind: 'webId',
        webId: jsonEpisode.podcastEpisodeId,
      },
      lengthInMs: jsonEpisode.duration,
      publicUrlPath: jsonEpisode.shareLinkPath,
      status: decodeEpisodeJsonIntoEpisodeStatus(jsonEpisode),
      title: jsonEpisode.title,
    })),
    'desc'
  );

// TODO: This endpoint can only support fetching up to 3000 episodes.
//       We should migrate this fetch to hit our main api
const fetchEpisodesDeprecated = (page?: number, limit?: number) =>
  new Promise<Episode[]>((resolve, reject) => {
    const baseUrl = `/api/podcastepisode`;
    const url = `${baseUrl}${
      page && limit ? `?page=${page}&limit=${limit}` : '?page=1&limit=3000'
    }`;
    fetch(url, {
      credentials: 'same-origin',
      method: 'GET',
    }).then((response: any): void => {
      if (response.ok) {
        response.json().then((responseJson: any) => {
          // TODO: We should ad runtime checking to verify that the json can be converted to Episode[]
          const episodes = decodeResponseIntoEpisodes(responseJson);
          resolve(episodes);
        });
      } else {
        const error = new AnchorAPIError(
          response,
          `Server error: ${response.statusText} (${response.status}) - ${response.url}`
        );
        reject(error);
      }
    });
  });

export { fetchEpisodesDeprecated };
