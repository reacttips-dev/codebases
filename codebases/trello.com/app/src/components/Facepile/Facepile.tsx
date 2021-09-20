import React, { FunctionComponent, ReactElement } from 'react';
import cx from 'classnames';
import { MemberAvatar } from 'app/src/components/MemberAvatar';
import styles from './Facepile.less';

interface FacepileProps {
  className?: string;
  avatarSize?: number;
  maxFaceCount?: number;
  showMore?: boolean;
  memberIds: string[];
  renderAvatar?: (memberId: string) => ReactElement;
  onShowMoreClick?: () => void;
  showMoreRef?: (el: HTMLDivElement) => void;
}

export const Facepile: FunctionComponent<FacepileProps> = ({
  className = '',
  avatarSize = 30,
  maxFaceCount = 5,
  showMore = true,
  memberIds,
  renderAvatar,
  onShowMoreClick,
  showMoreRef,
}) => {
  const avatars = memberIds.slice(0, maxFaceCount).map((idMember) => {
    if (renderAvatar) {
      return renderAvatar(idMember);
    }
    return <MemberAvatar idMember={idMember} size={avatarSize} />;
  });

  return (
    <div className={cx(styles.facepile, className)}>
      {!!showMore && memberIds.length > maxFaceCount && (
        <div
          ref={showMoreRef}
          onClick={onShowMoreClick}
          className={cx(
            styles.showMore,
            onShowMoreClick && styles.showMoreClickable,
          )}
          style={{ width: avatarSize, height: avatarSize }}
          role="button"
        >
          +{memberIds.length - maxFaceCount}
        </div>
      )}
      {avatars.reverse().map((avatar, index) => (
        <div key={index} className={styles.avatar}>
          {avatar}
        </div>
      ))}
    </div>
  );
};
