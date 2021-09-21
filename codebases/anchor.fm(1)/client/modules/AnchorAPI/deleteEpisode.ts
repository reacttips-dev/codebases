import { Promise } from 'bluebird';
import AnchorAPIError from './AnchorAPIError';

const deleteEpisode = (episodeId: string) => {
  return new Promise<any>((resolve, reject) => {
    return fetch(`/api/podcastepisode/${episodeId}`, {
      credentials: 'same-origin',
      method: 'DELETE',
    }).then((response: any): void => {
      if (response.ok) {
        resolve();
      } else {
        const error = new AnchorAPIError(
          response,
          `Server error: ${response.statusText} (${response.status}) - ${response.url}`
        );
        reject(error);
      }
    });
  });
};

export { deleteEpisode };
