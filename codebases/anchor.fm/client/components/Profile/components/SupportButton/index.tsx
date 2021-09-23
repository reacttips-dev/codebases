import React from 'react';
import AnchorPayLogo from '../../../svgs/AnchorPayLogo';
import styles from '../../styles.sass';
import { ProfileButton } from '../ProfileButton';

type Props = {
  supportButtonText: string;
  showSupportersModal(): void;
};

export const SupportButton = ({
  supportButtonText,
  showSupportersModal,
}: Props) => (
  <div className={styles.headingButton}>
    <ProfileButton
      kind="button"
      onClick={showSupportersModal}
      icon={<AnchorPayLogo height={20} width={23} color="#ffffff" />}
    >
      {supportButtonText}
    </ProfileButton>
  </div>
);
