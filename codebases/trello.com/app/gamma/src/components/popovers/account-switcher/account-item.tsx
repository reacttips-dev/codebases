import React from 'react';
import { MemberAvatarUnconnected } from 'app/src/components/MemberAvatar';
import { AvatarSources } from 'app/gamma/src/types/models';
import { Avatars } from '@trello/members';
import styles from './account-item.less';

interface AccountItemProps {
  email: string | null | undefined;
  id: string | undefined;
  avatarSource: AvatarSources | undefined;
  initials?: string;
  username?: string;
  name?: string;
  avatars?: Avatars;
  gold?: boolean;
}

export const AccountItem: React.FunctionComponent<AccountItemProps> = ({
  email,
  avatarSource,
  name,
  username,
  initials,
  avatars,
}) => {
  return (
    <>
      <div className={styles.accountItem}>
        <div className={styles.accountAvatar}>
          <MemberAvatarUnconnected
            fullName={name}
            username={username}
            initials={initials}
            avatars={avatars}
            avatarSource={avatarSource}
            size={40}
          />
        </div>
        <div>
          <div className={styles.accountName}>{name}</div>
          <span className={styles.accountEmail}>{email}</span>
        </div>
      </div>
    </>
  );
};
