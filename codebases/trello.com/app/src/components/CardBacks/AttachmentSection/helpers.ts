/* eslint-disable @trello/export-matches-filename, @typescript-eslint/no-use-before-define */
import { useCallback, useMemo, useState } from 'react';
import parseURL from 'url-parse';
import { isHighDPI } from '@trello/browser';
import { Dates } from 'app/scripts/lib/dates';
import { parseTrelloUrl } from 'app/scripts/lib/util/url/parse-trello-url';
import Format from 'app/scripts/lib/markdown/format';
import {
  smallestPreviewBiggerThan,
  biggestPreview,
  makePreviewCachable,
  Preview,
} from '@trello/image-previews';
import {
  KnownService,
  getKnownService,
  KnownServiceProps,
} from 'app/common/lib/util/known-services';
import { Util } from 'app/scripts/lib/util';
import ClassicAttachmentHelpers from 'app/scripts/views/attachment/helpers';
import { forNamespace } from '@trello/i18n';

// eslint-disable-next-line @trello/less-matches-component
import styles from './AttachmentSection.less';

const INITIAL_MAX_ATTACHMENTS_SHOWN = 4;

const formatMimeType = forNamespace('mime');
const formatAttachments = forNamespace('attachments');
const formatKnownService = forNamespace('known services');

export interface AttachmentPreviewModel {
  url: string;
  height: number;
  width: number;
  scaled: boolean;
}

export interface AttachmentModel {
  id: string;
  date: string;
  url: string;
  bytes: number;
  name: string;
  edgeColor?: string | null;
  isUpload: boolean;
  mimeType?: string | null;
  pos: number;
  previews?: AttachmentPreviewModel[] | null;
}

interface AttachmentPreviewData {
  isImage: boolean;
  isAudio: boolean;
  isVideo: boolean;
  isIFrameable: boolean;
  isPlaceholder: boolean;
  isExternal: boolean;
  url: string;
}

export interface AttachmentData {
  name: string;
  knownService: KnownService | null;
  preview: Preview | null;
  relativeTimeAdded: string;
  thumbnailStyles: React.CSSProperties;
  thumbnailLogoClass: string;
  metadata: string;
  canPreview: boolean;
  openText: string;
  previewData: AttachmentPreviewData;
  extension: string;
}

export const useSeparateAttachments = (attachments: AttachmentModel[]) => {
  const [trelloAttachments, normalAttachments] = useMemo(() => {
    const trelloAttachments: AttachmentModel[] = [];
    const normalAttachments: AttachmentModel[] = [];

    attachments.forEach((attachment) => {
      const urlType = parseTrelloUrl(attachment.url).type;

      if (urlType === 'card' || urlType === 'board') {
        trelloAttachments.push(attachment);
      } else {
        normalAttachments.push(attachment);
      }
    });

    trelloAttachments.sort(compareAttachments);
    normalAttachments.sort(compareAttachments);

    return [trelloAttachments, normalAttachments];
  }, [attachments]);

  return { trelloAttachments, normalAttachments };
};

export const useAttachmentData = (
  attachment: AttachmentModel,
): AttachmentData => {
  return useMemo(() => {
    const now = new Date();

    const preview = getPreview(attachment);
    const { knownService, props: knownServiceProps } = getKnownService(
      attachment.url,
    );

    const serviceKey = getServiceKey(attachment);
    const extension: string =
      Util.fileExt(parseURL(attachment.url).pathname) ||
      (serviceKey === 'other' ? 'LINK' : '');

    return {
      name: getAttachmentName(attachment, knownService, knownServiceProps),
      knownService,
      preview,
      extension,
      relativeTimeAdded: Dates.getPastDateDeltaString(attachment.date, now),
      thumbnailStyles: getThumbnailStyles(attachment, preview),
      thumbnailLogoClass: getThumbnailLogoClass(knownService, serviceKey),
      metadata: getMetadata(attachment, knownService, serviceKey),
      canPreview: !!ClassicAttachmentHelpers.isViewerable(attachment.url),
      openText: getOpenText(serviceKey),
      previewData: getPreviewData(attachment, extension, serviceKey),
    };
  }, [attachment]);
};

export const useHideAttachments = (attachments: AttachmentModel[]) => {
  const hasMoreAttachments = attachments.length > INITIAL_MAX_ATTACHMENTS_SHOWN;
  const [isHidingAttachments, setIsHidingAttachments] = useState(
    hasMoreAttachments,
  );

  const toggleViewMore = useCallback(() => {
    setIsHidingAttachments(!isHidingAttachments);
  }, [isHidingAttachments, setIsHidingAttachments]);

  const displayedAttachments = useMemo(() => {
    if (!hasMoreAttachments) return attachments;
    if (!isHidingAttachments) return attachments;

    return attachments.slice(0, INITIAL_MAX_ATTACHMENTS_SHOWN);
  }, [attachments, hasMoreAttachments, isHidingAttachments]);

  return {
    displayedAttachments,
    hasMoreAttachments,
    isHidingAttachments,
    toggleViewMore,
  };
};

const getServiceKey = (attachment: AttachmentModel) => {
  if (attachment.isUpload) {
    return 'trello';
  }

  const { host } = parseURL(attachment.url);

  const services: { [key: string]: string } = {
    'docs.google.com': 'gdrive',
    'drive.google.com': 'gdrive',
    'www.dropbox.com': 'dropbox',
    'onedrive.live.com': 'onedrive',
    '1drv.ms': 'onedrive',
    'app.box.com': 'box',
  };

  return services[host] ? services[host] : 'other';
};

const getPreview = (attachment: AttachmentModel) => {
  let preview = smallestPreviewBiggerThan(attachment.previews, 110, 80);
  if (!preview) {
    preview = biggestPreview(attachment.previews);
  }

  if (isHighDPI()) {
    const hiDpipreview = smallestPreviewBiggerThan(
      attachment.previews,
      220,
      160,
    );

    preview = hiDpipreview || preview;
  }

  return preview;
};

const getThumbnailStyles = (
  attachment: AttachmentModel,
  preview: Preview | null,
) => {
  const thumbnailStyles: React.CSSProperties = {};
  if (preview) {
    thumbnailStyles.backgroundImage = `url(${makePreviewCachable(
      preview.url,
    )})`;
  }
  if (attachment.edgeColor) {
    thumbnailStyles.backgroundColor = attachment.edgeColor;
  }

  return thumbnailStyles;
};

const getThumbnailLogoClass = (
  knownService: KnownService | null,
  serviceKey: string,
) => {
  if (knownService === KnownService.FogBugzCase) return styles.fogBugzLogo;
  if (knownService === KnownService.KilnCase) return styles.kilnLogo;

  if (serviceKey === 'gdrive') return styles.googleDriveLogo;
  if (serviceKey === 'dropbox') return styles.dropboxLogo;
  if (serviceKey === 'onedrive') return styles.oneDriveLogo;
  if (serviceKey === 'box') return styles.boxLogo;

  return '';
};

const getMetadata = (
  attachment: AttachmentModel,
  knownService: KnownService | null,
  serviceKey: string,
) => {
  if (knownService === KnownService.FogBugzCase) {
    return formatKnownService(['fogbugz case', 'name']);
  }
  if (knownService === KnownService.KilnCase) {
    return formatKnownService(['kiln commit', 'name']);
  }

  if (serviceKey === 'trello') {
    return Format.bytes(attachment.bytes);
  }
  if (serviceKey === 'gdrive') {
    return attachment.mimeType ? formatMimeType(attachment.mimeType) : '';
  }
  if (serviceKey) {
    return formatAttachments([serviceKey, 'type']);
  }

  return '';
};

const getOpenText = (serviceKey: string) => {
  if (serviceKey) {
    return formatAttachments([serviceKey, 'open']);
  }

  return formatAttachments(['trello', 'open']);
};

const getAttachmentName = (
  attachment: AttachmentModel,
  knownService: KnownService | null,
  props: KnownServiceProps,
) => {
  if (!knownService) return attachment.name;
  if (attachment.name !== attachment.url) return attachment.name;

  switch (knownService) {
    case 'KilnCase':
      return props.repo === 'Group'
        ? `${props.project} » ${props.branch}: ${props.hash}`
        : `${props.project} » ${props.repo} » ${props.branch}: ${props.hash}`;
    default:
      return attachment.name;
  }
};

const getPreviewData = (
  attachment: AttachmentModel,
  extension: string,
  serviceKey: string,
): AttachmentPreviewData => {
  const isImage =
    ClassicAttachmentHelpers.imageExts().includes(extension) ||
    (attachment.previews?.length || 0) > 0;

  const isAudio = ClassicAttachmentHelpers.audioExts().includes(extension);
  const isVideo = ClassicAttachmentHelpers.videoExts().includes(extension);
  const isGoogleViewerable = ClassicAttachmentHelpers.googleViewerableExts().includes(
    extension,
  );
  const isIFrameable =
    isGoogleViewerable ||
    ClassicAttachmentHelpers.iFrameableExts().includes(extension);

  const isExternal = serviceKey !== 'trello';

  const isPlaceholder = !(isAudio || isVideo || isIFrameable || isImage);
  let url = attachment.url;

  if (isImage) {
    const unableToExcludeEXIFRotation =
      '2019-09-22' <= attachment.date && attachment.date < '2019-10-17';

    const previewURL = biggestPreview(attachment.previews)?.url;

    if (attachment.previews && !unableToExcludeEXIFRotation && previewURL) {
      url = previewURL;
    }
  } else if (isGoogleViewerable) {
    const urlParam = encodeURIComponent(url);
    url = `https://docs.google.com/viewer?embedded=true&url=${urlParam}`;
  }

  return {
    isImage,
    isAudio,
    isVideo,
    isIFrameable,
    isPlaceholder,
    isExternal,
    url,
  };
};

const compareAttachments = (a: AttachmentModel, b: AttachmentModel) => {
  if (a.pos < b.pos) {
    return 1;
  } else if (a.pos > b.pos) {
    return -1;
  }
  return 0;
};
