import { Dispatch } from 'redux';
import { AnchorAPI } from '../../modules/AnchorAPI';
import { Episode } from './../../types';
import actions from './actions';

const { setEpisodesById } = actions;

const fetchEpisodesByIdAndSet = () => (
  dispatch: Dispatch<any>,
  getState: any
) => {
  return AnchorAPI.fetchEpisodesDeprecated().then((episodes: Episode[]) => {
    const episodesById = episodes.reduce((episodesByIdAccumulator, episode) => {
      const { id } = episode;
      switch (id.kind) {
        case 'webId':
          return {
            ...episodesByIdAccumulator,
            [id.webId]: episode,
          };
        case 'id':
          return {
            ...episodesByIdAccumulator,
            [id.id]: episode,
          };
        default:
          const exhaustiveCheck: never = id;
          return exhaustiveCheck;
      }
    }, {});
    dispatch(setEpisodesById(episodesById));
    return Promise.resolve(episodesById);
  });
};

export default {
  fetchEpisodesByIdAndSet,
};
