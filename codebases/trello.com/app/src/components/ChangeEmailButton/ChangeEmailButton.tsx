import React, {
  FunctionComponent,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';
import classNames from 'classnames';
import { Button, ButtonProps } from '@trello/nachos/button';
import { forNamespace } from '@trello/i18n';
import { Popover, usePopover } from '@trello/nachos/popover';

import { EmailError, EmailErrors } from 'app/src/components/EmailError';
import { Spinner } from '@trello/nachos/spinner';
import styles from './ChangeEmailButton.less';

interface ChangeEmailButtonProps {
  onSubmitEmail: (email: string) => void;
  onTogglePopover: (isOpen: boolean) => void;
  isSendingRequest: boolean;
  appearance?: ButtonProps['appearance'];
  isDisabled?: boolean;
  emailError: EmailErrors;
  emailPlaceholder?: string;
  isPopoverVisible?: boolean | null;
}

const format = forNamespace(['email hygiene wizard v2', 'change email'], {
  shouldEscapeStrings: false,
});

export const ChangeEmailButton: FunctionComponent<ChangeEmailButtonProps> = ({
  appearance = 'default',
  isDisabled = false,
  onSubmitEmail = (email: string) => {},
  isSendingRequest,
  emailError,
  onTogglePopover,
  emailPlaceholder = '',
  isPopoverVisible = null,
  children,
}) => {
  const [email, updateEmail] = useState(emailPlaceholder);

  const { popoverProps, toggle, triggerRef } = usePopover<HTMLButtonElement>({
    onHide: () => {
      onTogglePopover(false);
    },
    onShow: () => {
      onTogglePopover(true);
    },
  });

  if (typeof isPopoverVisible === 'boolean') {
    popoverProps.isVisible = isPopoverVisible;
  }

  const onChange = useCallback((e) => updateEmail(e.target.value), []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSubmitEmail(email);
    },
    [email, onSubmitEmail],
  );

  const emailInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (emailInputRef.current !== null) {
      emailInputRef.current.focus();
    }
  }, []);

  return (
    <>
      <Button
        onClick={toggle}
        ref={triggerRef}
        appearance={appearance}
        isDisabled={isDisabled}
      >
        {children}
      </Button>
      <Popover {...popoverProps} title={format('title')}>
        <div className={styles.popoverContent}>
          <form onSubmit={onSubmit}>
            <div>
              {format('main-message')}
              {isSendingRequest && (
                <Spinner
                  small
                  inline={true}
                  wrapperClassName={classNames(styles.spinner, styles.floating)}
                />
              )}
            </div>
            {emailError && (
              <EmailError error={emailError} email={email}>
                {(errorMessage) => (
                  <p className={styles.popoverError}>{errorMessage}</p>
                )}
              </EmailError>
            )}
            <label htmlFor="email" className={styles.popoverLabel}>
              {format('email-label')}
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              ref={emailInputRef}
              onChange={onChange}
              disabled={isSendingRequest}
            />
            <Button
              appearance="primary"
              isDisabled={isSendingRequest || email.length === 0}
              onClick={onSubmit}
            >
              {format('send-confirmation-button')}
            </Button>
          </form>
        </div>
      </Popover>
    </>
  );
};
