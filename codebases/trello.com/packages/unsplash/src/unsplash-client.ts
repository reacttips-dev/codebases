import Unsplash, { toJson } from 'unsplash-js';
import { Photo } from './types';

function appendUrlParameters(parameters: { [key: string]: string }) {
  return (originalUrl: string) => {
    const url = new URL(originalUrl);
    url.protocol = 'https:';

    for (const [key, value] of Object.entries(parameters)) {
      url.searchParams.append(key, value);
    }

    return url.toString();
  };
}

class UnsplashClient {
  api = new Unsplash({
    accessKey:
      '454087647775b190c574339cb2994716b17ef2f83ad11838d0ef0dac2d102e66',
    secret: '',
  });

  constants = {
    DEFAULT_COLLECTION_ID: 317099,
    PAGE_SIZE: 18,
  };

  toJson = toJson;

  appendAttribution = appendUrlParameters({
    utm_source: 'trello',
    utm_medium: 'referral',
    utm_campaign: 'api-credit',
  });

  appendImageParameters = appendUrlParameters({
    w: '2560',
    h: '2048',
    q: '90',
  });

  attributionUrl = this.appendAttribution('https://unsplash.com');

  getCollectionPhotos(
    id: number,
    page: number = 1,
    perPage: number = this.constants.PAGE_SIZE,
    orderBy: 'latest' | 'oldest' = 'latest',
  ): Promise<Photo[]> {
    return this.api.collections
      .getCollectionPhotos(id, page, perPage, orderBy)
      .then<Photo[]>(toJson);
  }

  getDefaultCollectionPhotos(
    page: number = 1,
    perPage: number = this.constants.PAGE_SIZE,
    orderBy: 'latest' | 'oldest' = 'latest',
  ): Promise<Photo[]> {
    return this.getCollectionPhotos(
      this.constants.DEFAULT_COLLECTION_ID,
      page,
      perPage,
      orderBy,
    );
  }

  searchPhotos(
    query: string,
    page: number,
    perPage: number,
    includeTotal: true,
  ): Promise<{ results: Photo[]; total: number }>;
  // eslint-disable-next-line no-dupe-class-members
  searchPhotos(
    query: string,
    page?: number,
    perPage?: number,
    includeTotal?: false | undefined,
  ): Promise<Photo[]>;
  // eslint-disable-next-line no-dupe-class-members
  searchPhotos(
    query: string,
    page: number = 1,
    perPage: number = this.constants.PAGE_SIZE,
    includeTotal: boolean = false,
  ): Promise<{ results: Photo[]; total: number } | Photo[]> {
    return this.api.search
      .photos(query, page, perPage)
      .then<{ results: Photo[]; total: number }>(toJson)
      .then((response) => {
        if (includeTotal) {
          return response;
        } else {
          return response.results;
        }
      });
  }

  async trackDownload(
    photo: string | { links: { download_location: string } },
  ): Promise<void> {
    if (typeof photo === 'string') {
      await this.trackDownload(await this.getPhoto(photo));
    } else {
      await this.api.photos.downloadPhoto(photo);
    }
  }

  async getPhoto(photo: string): Promise<Photo> {
    return this.api.photos.getPhoto(photo).then<Photo>(toJson);
  }
}

// eslint-disable-next-line @trello/no-module-logic
export const unsplashClient = new UnsplashClient();
