import React, { CSSProperties } from 'react';
import cx from 'classnames';
import styles from './Detail.less';
import boardStyles from '../board-card/BoardCard.less';
import avatarStyles from '../avatar/Avatar.less';
import buttonStyles from './Buttons.less';

interface BoardAndDetailContainerProps {
  width?: number;
}

export const BoardAndDetailContainer: React.FC<BoardAndDetailContainerProps> = ({
  width,
  children,
  ...props
}) => {
  let style: CSSProperties | undefined;
  if (width) {
    style = { width: `${width}px` };
  }
  return (
    <div
      className={cx(
        styles.boardAndDetailContainer,
        boardStyles.detailContainer,
      )}
      {...props}
      style={style}
    >
      {children}
    </div>
  );
};

export const DetailContainer: React.FC = (props) => (
  <div className={styles.detailContainer} {...props} />
);

export const Header: React.FC = ({ children }) => (
  <div
    className={cx(
      styles.header,
      avatarStyles.detailHeader,
      buttonStyles.detailHeader,
    )}
  >
    {children}
  </div>
);

export const DetailActions: React.FC = (props) => (
  <div className={styles.detailActions} {...props} />
);

export const CommentText: React.FC = (props) => (
  <div className={styles.commentText} {...props} />
);

export const ReactionContainer: React.FC = (props) => (
  <div className={styles.reactionContainer} {...props} />
);

export const DetailInfoUserName: React.FC = (props) => (
  <div className={styles.primary} {...props} />
);

export const DetailInfoPrimary = DetailInfoUserName;

export const DetailInfoSecondary: React.FC = (props) => (
  <div className={styles.secondary} {...props} />
);

interface DetailInfoProps {
  name?: string;
  date?: string;
  children?: React.ReactNode;
}

export const DetailInfo: React.FC<DetailInfoProps> = ({
  name,
  date,
  children,
  ...props
}: DetailInfoProps) => (
  <div className={styles.detailInfo} {...props}>
    {name && <DetailInfoPrimary>{name}</DetailInfoPrimary>}
    {date && <DetailInfoSecondary>{date}</DetailInfoSecondary>}
    {children}
  </div>
);

interface DueInfoProps {
  className?: string;
  cardTitle?: string;
  dueText?: React.ReactNode;
}

export const DueInfo: React.FC<DueInfoProps> = ({
  className,
  cardTitle,
  dueText,
}) => (
  <span className={cx(styles.dueInfo, className)}>
    <b>{cardTitle}</b> {dueText}
  </span>
);

export const Spacer: React.FC = (props) => (
  <div className={styles.spacer} {...props} />
);
