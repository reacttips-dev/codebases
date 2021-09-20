/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import classNames from 'classnames';
import { isHighDPI } from '@trello/browser';
import { UnsplashTracker } from '@trello/unsplash';
import { stickerClip } from 'app/scripts/lib/util/sticker-clip';
import { stickerSize } from 'app/scripts/data/sticker-size';
import {
  smallestPreviewBiggerThan,
  smallestPreviewBetween,
  biggestPreview,
  makePreviewCachable,
} from '@trello/image-previews';

import styles from './CardCover.less';

interface ScaledCardCover {
  bytes: number;
  url: string;
  height: number;
  width: number;
  scaled: boolean;
}

interface AttachmentModel {
  id: string;
  url: string;
}

interface CardCoverModel {
  color?: string | null;
  edgeColor?: string | null;
  idAttachment?: string | null;
  idPlugin?: string | null;
  idUploadedBackground?: string | null;
  sharedSourceUrl?: string | null;
  size?: string | null;
  scaled?: ScaledCardCover[] | null;
}

interface ScaledStickerImage {
  id: string;
  width: number;
  height: number;
  url: string;
  scaled: boolean;
  bytes?: number | null;
}

interface StickerModel {
  id: string;
  top: number;
  left: number;
  zIndex: number;
  rotate: number;
  image: string;
  imageUrl: string;
  imageScaled: ScaledStickerImage[];
}

interface CardCoverProps {
  areCardCoversEnabled: boolean;
  attachments: AttachmentModel[];
  colorblind: boolean;
  cover?: CardCoverModel | null;
  idAttachmentCover?: string | null;
  stickers: StickerModel[];
}

export const CardCover = ({
  areCardCoversEnabled,
  attachments,
  cover,
  colorblind,
  idAttachmentCover,
  stickers,
}: CardCoverProps) => {
  const { cardCoverBoxInlineStyles, cardCoverBoxClasses } = useCoverStyles({
    areCardCoversEnabled,
    attachments,
    cover,
    colorblind,
    idAttachmentCover,
    stickers,
  });

  return (
    <div
      className={classNames(cardCoverBoxClasses)}
      style={cardCoverBoxInlineStyles}
    >
      {stickers.length > 0 && <Stickers stickers={stickers} />}
    </div>
  );
};

const Stickers = ({ stickers }: { stickers: StickerModel[] }) => (
  <div className={styles.stickers}>
    {stickers.map((sticker) => (
      <Sticker key={sticker.id} {...sticker} />
    ))}
  </div>
);

const Sticker = ({
  image,
  imageUrl,
  rotate,
  left,
  top,
  imageScaled,
}: StickerModel) => {
  const url =
    smallestPreviewBiggerThan(imageScaled, stickerSize)?.url || imageUrl;

  return (
    <img
      className={styles.sticker}
      src={url}
      alt={image}
      style={{
        WebkitTransform: `rotate(${rotate}deg)`,
        transform: `rotate(${rotate}deg)`,
        left: `${stickerClip(left)}%`,
        top: `${stickerClip(top)}%`,
      }}
    />
  );
};

const useCoverStyles = ({
  areCardCoversEnabled,
  attachments,
  cover,
  colorblind,
  idAttachmentCover,
  stickers,
}: CardCoverProps) => {
  const hasCover =
    cover?.color ||
    ((cover?.idAttachment || cover?.idUploadedBackground || cover?.idPlugin) &&
      cover?.scaled);

  if (areCardCoversEnabled && cover && hasCover) {
    let previews, edgeColor, color: string | null | undefined;
    if (cover.color) {
      color = cover.color;
    } else if (
      cover.idAttachment ||
      cover.idUploadedBackground ||
      cover.idPlugin
    ) {
      previews = cover.scaled;
      edgeColor = cover.edgeColor;
    }

    const MIN_HEIGHT = 116;

    const MAX_HEIGHT = 160;
    const MAX_WIDTH = 730;

    if (color || previews) {
      let maxHeight, maxWidth: number;

      if (isHighDPI()) {
        maxWidth = MAX_WIDTH * 2;
        maxHeight = MAX_HEIGHT * 2;
      } else {
        maxWidth = MAX_WIDTH;
        maxHeight = MAX_HEIGHT;
      }

      // Find the smallest preview that has a height that exceeds the maximum
      // height we'll give to a card cover, and doesn't exceed the width of a
      // card.
      const left = smallestPreviewBetween(
        previews,
        0,
        maxHeight,
        maxWidth,
        Infinity,
      );
      const preview = left || biggestPreview(previews);

      let height: number;
      let size: string;
      let coverImgUrl: string | undefined;

      if (color) {
        height = MIN_HEIGHT;
        size = 'initial';
      } else {
        if (preview) {
          coverImgUrl = preview.url;
        } else {
          // NOTE: This fallback is unsuitable if we're showing previews for things that
          // aren't image attachments
          coverImgUrl = attachments.find((a) => a.id === idAttachmentCover)
            ?.url;
        }

        height = Math.max(
          MIN_HEIGHT,
          Math.min(preview?.height || MAX_HEIGHT, MAX_HEIGHT),
        );

        size =
          preview?.height && preview.height < height ? 'initial' : 'contain';
      }

      if (cover.idUploadedBackground && cover.sharedSourceUrl) {
        UnsplashTracker.trackOncePerInterval(cover.sharedSourceUrl);
      }

      return applyCover({
        url: makePreviewCachable(coverImgUrl),
        height,
        size,
        edgeColor,
        color,
        colorblind,
      });
    }
  } else if (stickers.length > 0) {
    return {
      cardCoverBoxClasses: [styles.cover, styles.stickersOnly],
      cardCoverBoxInlineStyles: {},
    };
  }

  // TODO goneill: plugin covers

  return {
    cardCoverBoxClasses: [],
    cardCoverBoxInlineStyles: {},
  };
};

const applyCover = ({
  url,
  height,
  size,
  edgeColor,
  color,
  position,
  padding,
  colorblind,
}: {
  url: string | undefined;
  height: number;
  size: string;
  edgeColor: string | null | undefined;
  color: string | null | undefined;
  position?: string;
  padding?: string;
  colorblind: boolean;
}) => {
  if (!position) {
    position = 'center';
  }

  if (!padding) {
    padding = '0';
  }

  const cardCoverBoxClasses: string[] = [styles.cover];
  const cardCoverBoxInlineStyles: React.CSSProperties = {};

  if (color) {
    cardCoverBoxClasses.push(styles[color]);
    position = 'left';
  } else {
    cardCoverBoxInlineStyles.backgroundColor = edgeColor || 'transparent';
  }

  if (colorblind) {
    cardCoverBoxClasses.push(styles.colorblind);
  }

  return {
    cardCoverBoxClasses,
    cardCoverBoxInlineStyles: {
      ...cardCoverBoxInlineStyles,
      ...{
        backgroundImage: url ? `url("${url}")` : '',
        height,
        minHeight: height,
        backgroundSize: size,
        padding,
        backgroundPosition: position,
      },
    },
  };
};
