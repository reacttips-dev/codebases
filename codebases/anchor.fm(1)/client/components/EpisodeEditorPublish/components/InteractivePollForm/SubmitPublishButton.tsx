import { css } from 'emotion';
import React, { useEffect, useState } from 'react';
import { Loading } from 'screens/SettingsScreen/components/Loading';
import { SubmitButton } from '../InteractivePoll/styles';

export function SubmitPublishButton(props: {
  isSubmitting: boolean;
  isPublished?: boolean;
  pristine: boolean;
}) {
  const { isPublished, pristine, isSubmitting } = props;
  const [isActive, setIsActive] = useState(false);
  function getText() {
    if (isActive && isSubmitting) {
      return (
        <>
          <Loading
            className={css`
              width: 24px;
              margin-right: 8px;
            `}
          />
          {isPublished ? 'Saving...' : 'Publishing...'}
        </>
      );
    }
    return isPublished ? 'Save poll' : 'Publish poll';
  }

  useEffect(() => {
    if (!isSubmitting) {
      setIsActive(false);
    }
  }, [isSubmitting]);

  return (
    <SubmitButton
      kind="button"
      color="purple"
      type="submit"
      isDisabled={isSubmitting || (pristine && isPublished)}
      onClick={() => {
        setIsActive(true);
      }}
    >
      {getText()}
    </SubmitButton>
  );
}
