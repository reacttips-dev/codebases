import React, { CSSProperties, AnchorHTMLAttributes, useEffect } from 'react';
import cx from 'classnames';
import styles from './Card.less';
import labelStyles from './CardLabel.less';
import badgeStyles from './Badge.less';
import avatarStyles from '../avatar/Avatar.less';
import { UnsplashTracker } from '@trello/unsplash';
import {
  smallestPreviewBiggerThan,
  biggestPreview,
} from '@trello/image-previews';
import { isHighDPI } from '@trello/browser';

enum CoverColor {
  Blue = 'blue',
  Green = 'green',
  Orange = 'orange',
  Purple = 'purple',
  Red = 'red',
  Yellow = 'yellow',
  Pink = 'pink',
  Sky = 'sky',
  Lime = 'lime',
  Black = 'black',
}

export interface ImagePreviewModel {
  scaled: boolean;
  height: number;
  url: string;
  width: number;
}

interface CoverPhotoModel {
  url?: string;
  edgeColor?: string | null;
  previews?: ImagePreviewModel[];
  sharedSourceUrl?: string;
  color?: CoverColor | null;
  size?: 'normal' | 'full';
  brightness?: 'light' | 'dark';
}

export const colorCoverColorBlindPattern: {
  [key in CoverColor]:
    | 'StripeDiagonal'
    | 'WaveSquare'
    | 'StripeVertical'
    | 'DotsChecker'
    | 'GrooveDiagonal'
    | 'StripeHorizontal'
    | 'BrickHorizontal'
    | 'BrickDiagonal'
    | 'Scale'
    | 'BrickVertical';
} = {
  red: 'DotsChecker',
  blue: 'StripeHorizontal',
  green: 'StripeDiagonal',
  orange: 'StripeVertical',
  purple: 'GrooveDiagonal',
  yellow: 'WaveSquare',
  pink: 'BrickHorizontal',
  sky: 'BrickDiagonal',
  lime: 'Scale',
  black: 'BrickVertical',
};

function getFullColorCoverClasses(color: CoverColor | null | undefined) {
  return {
    [styles.colorCardCoverBlue]: color === 'blue',
    [styles.colorCardCoverGreen]: color === 'green',
    [styles.colorCardCoverOrange]: color === 'orange',
    [styles.colorCardCoverRed]: color === 'red',
    [styles.colorCardCoverPurple]: color === 'purple',
    [styles.colorCardCoverYellow]: color === 'yellow',
    [styles.colorCardCoverPink]: color === 'pink',
    [styles.colorCardCoverSky]: color === 'sky',
    [styles.colorCardCoverLime]: color === 'lime',
    [styles.colorCardCoverBlack]: color === 'black',
  };
}

function getColorCoverColorBlindPatternClasses(
  color: CoverColor | null | undefined,
) {
  const pattern = colorCoverColorBlindPattern[color as CoverColor];

  switch (pattern) {
    case 'StripeDiagonal':
      return styles.StripeDiagonal;
    case 'WaveSquare':
      return styles.WaveSquare;
    case 'StripeVertical':
      return styles.StripeVertical;
    case 'DotsChecker':
      return styles.DotsChecker;
    case 'GrooveDiagonal':
      return styles.GrooveDiagonal;
    case 'StripeHorizontal':
      return styles.StripeHorizontal;
    case 'BrickHorizontal':
      return styles.BrickHorizontal;
    case 'BrickDiagonal':
      return styles.BrickDiagonal;
    case 'Scale':
      return styles.Scale;
    case 'BrickVertical':
      return styles.BrickVertical;
    default:
      return undefined;
  }
}

function getFullCoverClassesAndStyle({
  cover,
  colorBlind,
  truncateNameForFullCover,
  coverHeight,
  hasStickers,
}: {
  cover: CoverPhotoModel | null | undefined;
  colorBlind: boolean | undefined;
  truncateNameForFullCover?: boolean;
  coverHeight?: number;
  hasStickers?: boolean;
}) {
  let classNames: string | undefined = undefined;
  const style: React.CSSProperties = {};

  const { color, size, brightness } = cover || {};
  const hasFullCover = size === 'full';
  const hasFullColorCover = Boolean(hasFullCover && color);
  const preview = cover
    ? smallestPreviewBiggerThan(cover.previews, isHighDPI() ? 600 : 300) ||
      biggestPreview(cover.previews)
    : null;

  if (hasFullCover && preview) {
    style.backgroundImage = `url("${preview.url}")`;
    style.backgroundSize = 'cover';

    const maxHeight = Math.min(
      preview.height,
      coverHeight ? coverHeight * 2 : 260,
    );
    const calculatedHeight = (preview.height * 245) / preview.width;

    if (calculatedHeight <= maxHeight) {
      style.height = calculatedHeight;
    } else {
      style.height = maxHeight;
    }

    classNames = cx(
      styles.fullCover,
      styles.fullImageCover,
      brightness === 'dark' && styles.fullCoverDark,
      truncateNameForFullCover && styles.truncateNameForFullCover,
    );
  } else if (hasFullColorCover) {
    classNames = cx(
      {
        [styles.fullCover]: hasFullCover,
        [styles.fullCoverColorBlind]: hasFullColorCover && colorBlind,
        [styles.fullCoverDark]: brightness === 'dark',
        ...(hasFullColorCover ? getFullColorCoverClasses(color) : {}),
        [styles.fullColorCoverWithStickers]: hasStickers,
      },
      hasFullColorCover &&
        colorBlind &&
        getColorCoverColorBlindPatternClasses(color),
      truncateNameForFullCover && styles.truncateNameForFullCover,
    );
  }

  return { classNames, style };
}

interface CardProps {
  className?: string;
  style?: CSSProperties;
  cover?: CoverPhotoModel | null;
  colorBlind?: boolean;
  truncateNameForFullCover?: boolean;
  coverHeight?: number;
  hasStickers?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  style,
  cover,
  colorBlind,
  coverHeight,
  truncateNameForFullCover,
  hasStickers,
}) => {
  const baseCardClasses = cx(className, styles.card);
  const {
    classNames: fullCoverClasses,
    style: fullCoverStyles,
  } = getFullCoverClassesAndStyle({
    cover,
    colorBlind,
    coverHeight,
    truncateNameForFullCover,
    hasStickers,
  });

  return (
    <div
      className={cx(baseCardClasses, fullCoverClasses)}
      style={{
        ...fullCoverStyles,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export interface LinkComponentProps
  extends CardProps,
    AnchorHTMLAttributes<HTMLAnchorElement> {}

interface CardLinkProps extends CardProps {
  href?: string;
  onClick?: () => void;
  linkComponent?:
    | React.FC<LinkComponentProps>
    | React.ComponentClass<LinkComponentProps>;
}

export const CardLink: React.FC<CardLinkProps> = ({
  linkComponent: LinkComponent,
  className,
  cover,
  truncateNameForFullCover,
  colorBlind,
  coverHeight,
  hasStickers,
  ...props
}) => {
  const baseCardClasses = cx(className, styles.card, styles.cardLink);
  const {
    classNames: fullCoverClasses,
    style: fullCoverStyles,
  } = getFullCoverClassesAndStyle({
    cover,
    colorBlind,
    truncateNameForFullCover,
    hasStickers,
  });

  if (LinkComponent) {
    return (
      <LinkComponent
        className={cx(baseCardClasses, fullCoverClasses)}
        {...props}
        style={{
          ...fullCoverStyles,
          ...props.style,
        }}
      />
    );
  }
  return (
    <a
      className={cx(baseCardClasses, fullCoverClasses)}
      {...props}
      style={{
        ...fullCoverStyles,
        ...props.style,
      }}
    />
  );
};

interface CardStickersProps {
  height?: number;
  className?: string;
}

export const CardStickers: React.FC<CardStickersProps> = ({
  height,
  children,
  className,
}) => (
  <div
    className={cx(className, styles.stickers)}
    style={height ? { height: `${height}px` } : undefined}
  >
    {children}
  </div>
);

type ColorCoverColorBlindPattern =
  | 'StripeDiagonal'
  | 'WaveSquare'
  | 'StripeVertical'
  | 'DotsChecker'
  | 'GrooveDiagonal'
  | 'StripeHorizontal'
  | 'BrickHorizontal'
  | 'BrickDiagonal'
  | 'Scale'
  | 'BrickVertical';

interface CardCoverProps {
  bgColor?: string | null;
  img?: string;
  bgSize?: 'cover' | 'contain';
  height?: number;
  sharedSourceUrl?: string;
  pattern?: ColorCoverColorBlindPattern | null;
  previews?: ImagePreviewModel[];
  size?: string;
  colorBlind?: boolean;
}

export const CardCover: React.FC<CardCoverProps> = ({
  img,
  sharedSourceUrl,
  height,
  bgSize,
  bgColor,
  pattern,
  children,
  previews,
  size,
  colorBlind,
}) => {
  useEffect(() => {
    if (sharedSourceUrl) {
      UnsplashTracker.trackOncePerInterval(sharedSourceUrl);
    }
  }, [sharedSourceUrl]);

  const dynamicStyles: CSSProperties = {};

  if (height) {
    dynamicStyles.height = `${height}px`;
  }

  if (img) {
    dynamicStyles.backgroundImage = `url(${img})`;
  }

  if (bgColor) {
    dynamicStyles.backgroundColor = bgColor;
  }

  if (bgSize) {
    dynamicStyles.backgroundSize = bgSize;
  }

  if (previews) {
    const hasFullCover = size === 'full';
    const preview =
      smallestPreviewBiggerThan(previews, isHighDPI() ? 600 : 300) ||
      biggestPreview(previews);

    if (preview && !hasFullCover) {
      dynamicStyles.backgroundImage = `url("${preview.url}")`;
      dynamicStyles.backgroundSize = 'cover';

      const calculatedHeight = (preview.height * 245) / preview.width;
      const maxHeight = Math.min(preview.height, 260); // An arbitrarily chosen number

      if (calculatedHeight <= maxHeight) {
        dynamicStyles.height = calculatedHeight;
      } else {
        dynamicStyles.height = maxHeight;
      }
    }
  }

  let colorBlindPattern = pattern;
  if (!colorBlindPattern && colorBlind) {
    colorBlindPattern = colorCoverColorBlindPattern[bgColor as CoverColor];
  }

  const coverClasses = cx(
    styles.cover,
    pattern === 'StripeDiagonal' && styles.StripeDiagonal,
    pattern === 'WaveSquare' && styles.WaveSquare,
    pattern === 'StripeVertical' && styles.StripeVertical,
    pattern === 'DotsChecker' && styles.DotsChecker,
    pattern === 'GrooveDiagonal' && styles.GrooveDiagonal,
    pattern === 'StripeHorizontal' && styles.StripeHorizontal,
    pattern === 'BrickHorizontal' && styles.BrickHorizontal,
    pattern === 'BrickDiagonal' && styles.BrickDiagonal,
    pattern === 'Scale' && styles.Scale,
    pattern === 'BrickVertical' && styles.BrickVertical,
  );

  return (
    <div className={coverClasses} style={dynamicStyles}>
      {children}
    </div>
  );
};

export const CardDetails: React.FC<{ className?: string }> = ({
  children,
  className,
}) => <div className={cx(className, styles.details)}>{children}</div>;

export const CardTitle: React.FC<{ className?: string }> = ({
  className,
  children,
}) => <div className={cx(className, styles.title)}>{children}</div>;

interface CardLabelsProps {
  className?: string;
  title?: string;
}

export const CardLabels: React.FC<CardLabelsProps> = ({
  children,
  className,
  title,
}) => (
  <div
    title={title}
    className={cx(styles.labels, labelStyles.cardFront, className)}
  >
    {children}
  </div>
);

export const CardBadges: React.FC<{ className?: string }> = ({
  children,
  className,
}) => (
  <div className={cx(className, styles.badges, badgeStyles.cardFront)}>
    {children}
  </div>
);

export const CardMembers: React.FC<{ className?: string }> = ({
  children,
  className,
}) => (
  <div className={cx(className, styles.members, avatarStyles.cardFront)}>
    {children}
  </div>
);
