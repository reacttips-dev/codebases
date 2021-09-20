import classNames from 'classnames';
import React from 'react';
import styles from './RequestAccess.less';
import { MemberAvatar } from 'app/src/components/MemberAvatar';
import { Button } from '@trello/nachos/button';

interface RequestAccessProps {
  description: string;
  disabled?: boolean;
  email: string;
  fullName: string;
  id: string;
  onSubmit: () => void;
  switchAccountUrl: string;
}

export const RequestAccess: React.FC<RequestAccessProps> = ({
  description,
  disabled = false,
  email,
  fullName,
  id,
  onSubmit,
  switchAccountUrl,
}) => {
  return (
    <div>
      <p className={styles.description}>{description}</p>
      <div className={styles.displayFlex}>
        <span
          className={classNames(styles.loginAsTitle, styles.fontWeightBold)}
        >
          You are logged in as
        </span>
        <a className={styles.switchAccountLink} href={switchAccountUrl}>
          Switch account
        </a>
      </div>
      <div className={styles.memberInfoContainer}>
        <MemberAvatar idMember={id} className={styles.memberAvatar} size={32} />
        <div>
          <div className={styles.fullName}>{fullName}</div>
          <div className={styles.email}>{email}</div>
        </div>
      </div>
      <p className={styles.footerText}>
        By requesting access, you agree to share your Trello profile information
        with the board admins.
      </p>
      <Button
        appearance="primary"
        size="fullwidth"
        onClick={onSubmit}
        isDisabled={disabled}
      >
        Send request
      </Button>
    </div>
  );
};
