import React, { useState } from 'react';
import { forNamespace } from '@trello/i18n';
import styles from './NewBillableGuestsAlert.less';
import { Button } from '@trello/nachos/button';
import { Spinner } from '@trello/nachos/spinner';
import RouterLink from 'app/src/components/RouterLink/RouterLink';

const noop = () => {};

const format = forNamespace('workspaces preamble');

interface NewBillableGuestsAlertProps {
  onSubmit: () => void;
}

export const NewBillableGuestsAlert: React.FunctionComponent<NewBillableGuestsAlertProps> = ({
  onSubmit,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onConfirm = () => {
    setIsSubmitted(true);
    onSubmit();
  };

  return (
    <>
      <p className={styles.newBillableGuestsAlertHeadline}>
        <strong>{format('new-billable-guests-headline')}</strong>
      </p>
      <p className={styles.newBillableGuestsAlertMessaging}>
        {format('new-billable-workspace-guests-messaging', {
          learnMoreLink: (
            <RouterLink
              key="newBillableGuestsLink"
              href="https://help.trello.com/article/1123-multi-board-guests"
              target="_blank"
            >
              {format('new-billable-guests-link')}
            </RouterLink>
          ),
        })}
      </p>
      <Button
        appearance="primary"
        className={styles.newBillableGuestsAlertSubmitButton}
        isDisabled={isSubmitted}
        onClick={isSubmitted ? noop : onConfirm}
        shouldFitContainer
      >
        {isSubmitted ? (
          <Spinner centered />
        ) : (
          format('popover-title-add-to-workspace')
        )}
      </Button>
    </>
  );
};
