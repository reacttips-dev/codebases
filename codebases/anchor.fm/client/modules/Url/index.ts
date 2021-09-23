import { getEpochTime } from '../Date';
import { DateRange } from '../Date/types';
import * as serverRenderingUtils from '../../../helpers/serverRenderingUtils';

type ParameterValue = string | number | boolean | Date | null | undefined;
type QueryParameters = {
  [key: string]: ParameterValue;
  startDateRange?: Date | null;
  endDateRange?: Date | null;
};

const INVALID_FILE_NAME_CHARS_REGEX = new RegExp('[^a-zA-Z0-9\\-\\_]', 'g');

export function getApiUrl({
  path,
  queryParameters,
  isWebEndpoint,
}: {
  path: string;
  queryParameters?: QueryParameters;
  isWebEndpoint?: boolean;
}) {
  const queryParameterString = queryParameters
    ? `${getQueryParameters(queryParameters)}`
    : '';
  const baseUrl = isWebEndpoint ? '/api' : '/api/proxy/v3';
  return `${baseUrl}/${path}${queryParameterString}`;
}

function getQueryParameters(queryParameters: QueryParameters) {
  const keys = Object.keys(queryParameters);
  if (keys.length === 0) return '';
  return keys.reduce((acc, key) => {
    const value = queryParameters[key];
    if (value) {
      return `${acc}${getNewParameter(key, value)}&`;
    }
    return acc;
  }, '?');
}

function getNewParameter(key: string, value: ParameterValue) {
  switch (key) {
    case 'startDateRange':
      return `timeRangeStart=${getEpochTime(value as Date)}`;
    case 'endDateRange':
      return `timeRangeEnd=${getEpochTime(value as Date)}`;
    default:
      return `${key}=${value}`;
  }
}

export function getCsvFilename({
  baseName,
  startDateRange,
  endDateRange,
}: DateRange & {
  baseName: string;
}) {
  function formatDate(date: Date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
  const sanitizedBaseName = baseName.replace(INVALID_FILE_NAME_CHARS_REGEX, '');
  const dateRangeString =
    startDateRange && endDateRange
      ? `${formatDate(startDateRange)}--${formatDate(endDateRange)}`
      : 'all-time';
  return `${
    sanitizedBaseName && sanitizedBaseName.length > 0
      ? `${sanitizedBaseName}_`
      : ''
  }${dateRangeString}.csv`;
}

export function getIsValidUrl(url: string) {
  // https://www.regextester.com/93652
  return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[A-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]+(:[0-9]{1,5})?(\/.*)?$/.test(
    url
  );
}

function getProfilePath({
  vanitySlug,
  isEmbed = false,
}: {
  vanitySlug: string;
  isEmbed?: boolean;
}): string {
  const encodedSlug = encodeURIComponent(vanitySlug);
  return isEmbed ? `/${encodedSlug}/embed` : `/${encodedSlug}`;
}

export function getProfileUrl({
  vanitySlug,
  isEmbed = false,
}: {
  vanitySlug: string;
  isEmbed?: boolean;
}) {
  return `${serverRenderingUtils.getBaseUrl()}${getProfilePath({
    vanitySlug,
    isEmbed,
  })}`;
}

export function getProfileEmbedCode({ vanitySlug }: { vanitySlug: string }) {
  const profileUrl = getProfileUrl({ vanitySlug, isEmbed: true });
  return `<iframe src="${profileUrl}" height="102px" width="400px" frameborder="0" scrolling="no"></iframe>`;
}

type CommonShareUrl = {
  vanitySlug: string;
};
type TwitterShareUrl = {
  platform: 'twitter';
  shareText?: string;
} & CommonShareUrl;
type FacebookShareUrl = {
  platform: 'facebook';
} & CommonShareUrl;
export type SocialShareUrl = TwitterShareUrl | FacebookShareUrl;

export function getSocialShareUrl(shareUrlObj: SocialShareUrl): string {
  const { vanitySlug } = shareUrlObj;
  const shareUrl = getProfileUrl({ vanitySlug });
  switch (shareUrlObj.platform) {
    case 'twitter': {
      const { shareText } = shareUrlObj;
      const text = shareText
        ? `${encodeURIComponent(shareText)} ${shareUrl}`
        : shareUrl;
      return `https://twitter.com/intent/tweet?text=${text}`;
    }
    case 'facebook':
      return `https://www.facebook.com/dialog/share?app_id=446611785530020&href=${shareUrl}&redirect_uri=${shareUrl}`;
    default:
      return shareUrl;
  }
}

export function getIsValidUrlWithoutProtocol(url: string | undefined) {
  return (
    !!url &&
    /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]+(k:[0-9]{1,5})?(\/.*)?$/.test(url)
  );
}

/**
 * Takes in a URL path and returns a page location for event tracking analytics
 *
 * return the page location name if known, otherwise, fallback to the provided path
 */
export function getPageLocationAttribute(path: string) {
  switch (path) {
    case '/dashboard/money':
      return 'money';
    case '/dashboard/episode/:podcastEpisodeId/edit':
      return 'episode_editor';
    default:
      return path;
  }
}
