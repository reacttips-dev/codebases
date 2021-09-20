import React from 'react';
import cx from 'classnames';
import styles from './MiniCard.less';

const darkFullCoverGradient =
  'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))';
const lightFullCoverGradient =
  'linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))';

interface MiniCardProps {
  onClick?: () => void;
  selected?: boolean;
  coverSize: 'none' | 'normal' | 'full';
  coverColor?: string | null;
  coverImageUrl?: string | null;
  textColor?: 'light' | 'dark';
  disabled?: boolean;
}

export const MiniCard: React.FunctionComponent<MiniCardProps> = ({
  onClick,
  coverSize,
  coverColor,
  coverImageUrl,
  selected,
  textColor = 'dark',
  disabled,
}) => {
  const hasCover = coverSize === 'normal';
  const hasFullCover = coverSize === 'full';

  const colorCoverClassName = coverColor ? styles[coverColor] : null;
  const fullColorCoverClassName = hasFullCover ? colorCoverClassName : null;

  let gradient = lightFullCoverGradient;

  if (textColor === 'light') {
    gradient = darkFullCoverGradient;
  }

  return (
    <div
      role="button"
      onClick={disabled ? undefined : onClick}
      className={cx(styles.miniCard, fullColorCoverClassName, {
        [styles.hasCover]: hasCover,
        [styles.hasFullCover]: hasFullCover,
        [styles.colorCardCover]: hasFullCover && Boolean(coverColor),
        [styles.imageCardCover]: hasFullCover && Boolean(coverImageUrl),
        [styles.selected]: selected,
        [styles.disabled]: disabled,
      })}
      style={{
        backgroundImage:
          hasFullCover && coverImageUrl
            ? `${gradient}, url(${coverImageUrl})`
            : undefined,
      }}
    >
      {hasCover && (
        <div
          className={cx(styles.cover, colorCoverClassName, {
            [styles.colorCardCover]: Boolean(coverColor),
            [styles.imageCardCover]: Boolean(coverImageUrl),
          })}
          style={{
            backgroundImage: coverImageUrl
              ? `url(${coverImageUrl})`
              : undefined,
          }}
        />
      )}
      <div
        className={cx(styles.content, {
          [styles.light]: textColor === 'light',
        })}
      >
        <div className={styles.longName} />
        <div className={styles.shortName} />
        <div className={styles.badges}>
          <div className={styles.badge} />
          <div className={styles.badge} />
        </div>
        <div className={styles.avatar} />
      </div>
    </div>
  );
};
