import React from 'react';
import { Icon } from '../../../../shared/Icon';
import styles from '../../styles.sass';
import { ProfileButton } from '../ProfileButton';

type Props = {
  isOwnPodcast: boolean;
  toggleSelfVoicemailModal(): void;
  onPressSendVoiceMessage(): void;
};

export const VoiceMessageButton = ({
  isOwnPodcast,
  toggleSelfVoicemailModal,
  onPressSendVoiceMessage,
}: Props) => (
  <div className={styles.voiceMessageButtonContainer}>
    <ProfileButton
      kind="button"
      icon={<Icon type="voice_message" fillColor="#FFFFFF" />}
      onClick={
        isOwnPodcast ? toggleSelfVoicemailModal : onPressSendVoiceMessage
      }
    >
      Message
    </ProfileButton>
  </div>
);
