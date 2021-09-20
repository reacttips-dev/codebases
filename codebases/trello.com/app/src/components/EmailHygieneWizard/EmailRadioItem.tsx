import React, { FunctionComponent, useCallback } from 'react';
import { LoginModel } from 'app/gamma/src/types/models';
import styles from './EmailRadioItem.less';
import { forNamespace } from '@trello/i18n';

interface EmailRadioItemProps {
  disabled: boolean;
  checked: boolean;
  onSelectLogin: (login: LoginModel) => void;
  login: LoginModel;
  showAsterisk: boolean;
}

const format = forNamespace(['email hygiene wizard', 'choose email screen'], {
  shouldEscapeStrings: false,
});

export const EmailRadioItem: FunctionComponent<EmailRadioItemProps> = ({
  disabled,
  checked,
  onSelectLogin,
  showAsterisk,
  login,
}) => {
  const onChange = useCallback(() => {
    onSelectLogin(login);
  }, [login, onSelectLogin]);

  return (
    <div>
      <label className={styles.emailLabel}>
        <input
          type="radio"
          className={styles.emailRadio}
          disabled={disabled}
          checked={checked}
          onChange={onChange}
        />
        <span className={styles.emailValue}>
          {showAsterisk && '*'}
          {login.email}
        </span>
        {login.primary && (
          <span className={styles.primaryEmail}>{format('primary-label')}</span>
        )}
      </label>
    </div>
  );
};
