import { backgroundDomain } from '@trello/config';
import { TrackingQueue } from './tracking-queue';

const APP_ID = '7066';
const BASE_URL = 'https://views.unsplash.com/v?app_id=' + APP_ID;
export const TRACK_BY_FILEPATH_URL_PREFIX = `${BASE_URL}&filepath=`;
const DEFAULT_INTERVAL_MS = 10 * 60 * 1000;

// photo is of form http://.../more/more/photo-xxxxxxx if it's an unsplash photo
// that has been uploaded to S3
// extract the `/photo-xxxxxx` portion
function filepathFromTrelloS3Url(url: string) {
  const results = /(\/photo-)[^&.?\n#]*/.exec(url);
  return results ? results[0] : undefined;
}

// photo is of form https://images.unsplash.com/photo-xxxxxx?ixlib=rb-1.2.1
// if it's an unsplash photo. extract the `/photo-xxxxxx` portion
function filepathFromUrl(url: string) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname;
  } catch (e) {
    return undefined;
  }
}

// See Unsplash: Tracking and Attribution
// https://hello.atlassian.net/wiki/spaces/TRELLO/pages/563910515/Unsplash+Tracking+and+Attribution
// Note that tracking by filePath is generally more reliable (vs e.g. a guess at the photo id extracted
// from an S3 URL)
export class Tracker {
  private filePathTrackingQueue = new TrackingQueue(
    TRACK_BY_FILEPATH_URL_PREFIX,
    (url) =>
      url.startsWith('https://images.unsplash.com/')
        ? filepathFromUrl(url)
        : url.startsWith(backgroundDomain)
        ? filepathFromTrelloS3Url(url)
        : undefined,
  );

  trackOncePerInterval(
    urlOrUrls: string | string[],
    intervalMs: number = DEFAULT_INTERVAL_MS,
  ): void {
    if (!Array.isArray(urlOrUrls)) {
      return this.trackOncePerInterval([urlOrUrls], intervalMs);
    }

    const urls: string[] = urlOrUrls;
    this.filePathTrackingQueue.enqueue(urls, intervalMs);
  }
}

// eslint-disable-next-line @trello/no-module-logic
export const UnsplashTracker = new Tracker();
