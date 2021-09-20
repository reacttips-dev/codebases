import React from 'react';
import { HomeTestIds } from '@trello/test-ids';

import classNames from 'classnames';

import styles from './tile.less';

interface TileProps {
  className?: string;
  onMouseDown?: React.EventHandler<React.MouseEvent<HTMLElement>>;
  onMouseUp?: React.EventHandler<React.MouseEvent<HTMLElement>>;
}

export const Tile: React.FunctionComponent<TileProps> = ({
  className,
  ...props
}) => <div {...props} className={classNames(styles.tile, className)} />;

interface TileLinkProps {
  isButton?: boolean;
  onClick: React.EventHandler<React.MouseEvent<HTMLElement>>;
  url?: string;
}

export const TileLink: React.FunctionComponent<TileLinkProps> = ({
  isButton,
  onClick,
  url,
  ...props
}) => {
  return isButton ? (
    <button {...props} onClick={onClick} className={styles.link} />
  ) : (
    <a {...props} href={url} onClick={onClick} className={styles.link} />
  );
};

interface TileThumbnailProps {
  color?: string;
  imageUrl?: string;
}

export const TileThumbnail: React.FunctionComponent<TileThumbnailProps> = ({
  imageUrl,
  color,
  ...props
}) => (
  <div
    {...props}
    className={styles.thumbnail}
    style={{
      backgroundImage: imageUrl ? `url('${imageUrl}')` : 'none',
      backgroundColor: color,
    }}
  />
);

export const TileText: React.FunctionComponent = (props) => (
  <span {...props} className={styles.text} />
);

export const TileLinkText: React.FunctionComponent = (props) => (
  <span {...props} className={styles.linkText} />
);

export const TileTitleText: React.FunctionComponent = (props) => (
  <span {...props} className={styles.titleText} />
);

export const TileQuietText: React.FunctionComponent = (props) => (
  <span {...props} className={styles.quietText} />
);

export const TileSecondaryButton: React.FunctionComponent<
  React.DOMAttributes<HTMLButtonElement>
> = ({ ...props }) => <button {...props} className={styles.secondaryButton} />;

interface TileSecondaryButtonIconProps {
  name: string;
  selected: boolean;
  title?: string;
}

export const TileSecondaryButtonIcon: React.FunctionComponent<TileSecondaryButtonIconProps> = ({
  selected,
  name,
  ...props
}) => (
  <span
    {...props}
    className={classNames(
      `icon-${name}`,
      'icon-sm',
      styles.secondaryButtonIcon,
      { [styles.selected]: selected },
    )}
  />
);

interface TileIconProps {
  name: string;
}

export const TileButtonIcon: React.FunctionComponent<TileIconProps> = ({
  name,
  ...props
}) => (
  <span
    {...props}
    className={classNames(`icon-${name}`, 'icon-sm', styles.buttonIcon)}
  />
);

export const TileIcon: React.FunctionComponent<TileIconProps> = ({
  name,
  ...props
}) => (
  <span
    {...props}
    className={classNames(`icon-${name}`, 'icon-sm', styles.icon)}
  />
);

export interface BoardTileProps {
  backgroundColor?: string;
  boardName: string;
  className?: string;
  isLoggedIn: boolean;
  isStarred: boolean;
  onMouseDown?: React.EventHandler<React.MouseEvent<HTMLElement>>;
  onMouseUp?: React.EventHandler<React.MouseEvent<HTMLElement>>;
  onStarClick: React.EventHandler<React.MouseEvent<HTMLElement>>;
  orgName?: string;
  starIconTitle: string;
  thumbnailUrl?: string;
  trackClick: React.EventHandler<React.MouseEvent<HTMLElement>>;
  url: string;
}
export class BoardTile extends React.Component<BoardTileProps> {
  render() {
    const {
      backgroundColor,
      boardName,
      className,
      isLoggedIn,
      isStarred,
      onMouseDown,
      onMouseUp,
      onStarClick,
      orgName,
      starIconTitle,
      thumbnailUrl,
      trackClick,
      url,
    } = this.props;

    return (
      <Tile
        className={className}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        data-test-id={`${HomeTestIds.Tile}${boardName}`}
      >
        <TileLink url={url} onClick={trackClick}>
          <TileThumbnail imageUrl={thumbnailUrl} color={backgroundColor} />
          <TileText>
            <TileTitleText>{boardName}</TileTitleText>
            {!!orgName && <TileQuietText>{orgName}</TileQuietText>}
          </TileText>
        </TileLink>
        {isLoggedIn && (
          <TileSecondaryButton
            onClick={onStarClick}
            data-test-id={`${HomeTestIds.TileSecondaryButton}${boardName}`}
          >
            <TileSecondaryButtonIcon
              selected={isStarred}
              name="star"
              title={starIconTitle}
            />
          </TileSecondaryButton>
        )}
      </Tile>
    );
  }
}
