import React from 'react';
import { ButtonWithHoverAndPress } from '../../../../shared/Button';
import { Modal } from '../../../../shared/Modal';
import Text from '../../../../shared/Text';
import styles from './styles.sass';

type Props = {
  toggleSelfVoicemailModalError(): void;
};

export function SelfVoicemailModalError({
  toggleSelfVoicemailModalError,
}: Props) {
  return (
    <Modal
      isShowing={true}
      isShowingCloseButton={true}
      onClickClose={toggleSelfVoicemailModalError}
      renderContent={() => (
        <div className={styles.voicemailModalContainer}>
          <div className={styles.voicemailModalContent}>
            <Text align="center" size="xl">
              Nice try, but you can{`'`}t send yourself a voice message!
            </Text>
          </div>
          <ButtonWithHoverAndPress
            size="sm"
            colorTheme="primary"
            text="Oh right, thanks"
            onPress={toggleSelfVoicemailModalError}
          />
        </div>
      )}
    />
  );
}
