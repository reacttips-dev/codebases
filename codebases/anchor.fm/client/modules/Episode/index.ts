import { sortObjectArrayByDate } from './../../modules/Date';
import { Episode } from './../../types';

type Order = 'asc' | 'desc';

const getIsOnePublished = (episodes: Episode[]) =>
  episodes.some((episode: Episode) => episode.status.kind === 'published');

const sortByDate = (episodes: Episode[], order: Order) =>
  sortObjectArrayByDate(episodes, 'desc', episode => episode.status.date);

export { getIsOnePublished, sortByDate };
