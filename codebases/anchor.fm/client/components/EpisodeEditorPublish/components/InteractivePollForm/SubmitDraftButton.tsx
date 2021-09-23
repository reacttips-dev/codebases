import { css } from 'emotion';
import React, { useEffect, useState } from 'react';
import { SaveDraftButton } from 'components/EpisodeEditorPublish/components/InteractivePoll/styles';
import { Loading } from 'screens/SettingsScreen/components/Loading';

export function SubmitDraftButton(props: {
  isSubmitting: boolean;
  isPublished?: boolean;
  pristine: boolean;
  onClick: (e: React.FormEvent) => void;
}) {
  const { isPublished, pristine, isSubmitting, onClick } = props;
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
          {isPublished ? 'Reverting...' : 'Saving...'}
        </>
      );
    }
    return isPublished ? 'Revert to draft' : 'Save as draft';
  }

  useEffect(() => {
    if (!isSubmitting && !isPublished) {
      setIsActive(false);
    }
  }, [isSubmitting]);

  return (
    <SaveDraftButton
      type="button"
      disabled={isSubmitting || (pristine && !isPublished)}
      onClick={e => {
        setIsActive(true);
        onClick(e);
      }}
    >
      {getText()}
    </SaveDraftButton>
  );
}
