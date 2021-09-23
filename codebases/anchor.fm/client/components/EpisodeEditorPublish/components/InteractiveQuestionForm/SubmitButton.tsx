import { css } from 'emotion';
import React, { useEffect, useState } from 'react';
import { SubmitButton as StyledSubmitButton } from 'components/EpisodeEditorPublish/components/InteractivePoll/styles';
import { Loading } from 'screens/SettingsScreen/components/Loading';

export function SubmitButton(props: {
  isSubmitting: boolean;
  pristine: boolean;
}) {
  const { pristine, isSubmitting } = props;
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
          Saving...
        </>
      );
    }
    return 'Publish question';
  }

  useEffect(() => {
    if (!isSubmitting) {
      setIsActive(false);
    }
  }, [isSubmitting]);

  return (
    <StyledSubmitButton
      kind="button"
      color="purple"
      type="submit"
      isDisabled={isSubmitting || pristine}
      onClick={() => {
        setIsActive(true);
      }}
    >
      {getText()}
    </StyledSubmitButton>
  );
}
