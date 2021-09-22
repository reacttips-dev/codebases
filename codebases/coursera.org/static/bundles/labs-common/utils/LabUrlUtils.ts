import Uri from 'jsuri';
import path from 'path';
import { LABS_HOSTNAME } from 'bundles/labs-common/constants/LabUrls';
import type { UrlFrameMessage } from 'bundles/labs-common/types/FramedLab';
import type { LaunchUrlParams } from 'bundles/labs-common/types/LabLaunch';

// If we get a parameter in the launch URL from the backend, allow us to define an override
export const handleLaunchUrlParamOverride = (
  response: string | null,
  override?: boolean | string
): boolean | string | undefined => {
  if (typeof override !== 'undefined') {
    return override;
  } else if (response === 'true') {
    return true;
  } else if (response === 'false') {
    return false;
  } else {
    return undefined;
  }
};

export const constructLaunchUrlQueryString = (launchUrl: string, launchUrlParams?: LaunchUrlParams): string => {
  const params = new Uri(launchUrl);

  // Support anything.
  // eslint-disable-next-line guard-for-in
  for (const key in launchUrlParams) {
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const idealValue = handleLaunchUrlParamOverride(params.getQueryParamValue(key), launchUrlParams?.[key]);
    if (idealValue === undefined) {
      params.deleteQueryParam(key);
    } else {
      params.replaceQueryParam(key, String(idealValue));
    }
  }

  return params.query();
};

export const constructLaunchUrl = (
  launchUrl: string,
  launchUrlParams?: LaunchUrlParams,
  workspaceGatewayHost?: string,
  workspaceId?: string
): string => {
  const queryString = constructLaunchUrlQueryString(launchUrl, launchUrlParams);

  if (workspaceGatewayHost && workspaceId) {
    return new Uri()
      .setProtocol('https')
      .setHost(workspaceGatewayHost)
      .setPath(path.join('connect', workspaceId))
      .setQuery(queryString)
      .toString();
  } else {
    return new Uri(launchUrl).setQuery(queryString).toString();
  }
};

export const isUrlParsable = (urlToCheck: string): boolean => {
  try {
    // Note: This truthy check is for avoiding the "Do not use 'new' for side effects" ESLint error.
    return !!new URL(urlToCheck);
  } catch (e) {
    return false;
  }
};

export const constructWorkspaceUrl = (workspaceId: string, hostname: string = LABS_HOSTNAME): string => {
  return `https://${hostname}/connect/${workspaceId}`;
};

export const extractLabHostname = (launchUrl?: string): string => {
  if (!launchUrl) {
    return '';
  }

  return isUrlParsable(launchUrl) ? new URL(launchUrl).hostname : launchUrl;
};

export const extractContentPath = (launchUrl?: string): string => {
  if (!launchUrl) {
    return '';
  }

  return isUrlParsable(launchUrl) ? new URL(launchUrl).searchParams.get('path') || '' : launchUrl;
};

export const extractUrlOrigin = (currentLabUrl?: string): string => {
  if (!currentLabUrl) {
    return '';
  }

  return isUrlParsable(currentLabUrl) ? new URL(currentLabUrl).origin : currentLabUrl;
};

export const getPathFromUrl = (innerFrameUrl: string): string => {
  try {
    const innerUrl = new URL(innerFrameUrl);
    return innerUrl.pathname + innerUrl.search + innerUrl.hash;
  } catch (error) {
    return innerFrameUrl;
  }
};

export const parseHostname = (name: string) => {
  // Support inputs "dev2" or "hub.dev2.labs-dev.coursera.org"
  return name.startsWith('dev') ? `hub.${name}.labs-dev.coursera.org` : name;
};

export const updateUrlQueryString = (currentUri: Uri, queryKey: string, value: string): Uri => {
  if (currentUri.hasQueryParam(queryKey)) {
    currentUri.deleteQueryParam(queryKey);
  }

  if (queryKey && value) {
    currentUri.addQueryParam(queryKey, value);
  }

  return currentUri;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isMessageAUrlFromInnerFrame = (messageData: any): messageData is UrlFrameMessage => {
  return messageData?.innerFrameUrl && messageData?.fromInnerFrame;
};
