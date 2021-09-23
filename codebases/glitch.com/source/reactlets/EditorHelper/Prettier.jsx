import React, { useCallback } from 'react';
import { Loader } from '@glitchdotcom/shared-components';
import useObservable from '../../hooks/useObservable';
import useApplication from '../../hooks/useApplication';
import PrettierSparklesEmoji from '../PrettierSparklesEmoji';

export function showPrettierButton(application, file) {
  if (application.projectIsReadOnlyForCurrentUser() || application.editorIsPreviewingRewind() || application.editorIsRewindingProject()) {
    return false;
  }

  // We only want to show the Prettier button for markdown files when the preview is not visible.
  if (file.extension() === 'md' && !application.markdownPreviewVisible()) {
    return true;
  }
  return ['css', 'js', 'jsx', 'json', 'html', 'yml', 'tsx', 'ts'].includes(file.extension());
}

export default function Prettier({ file }) {
  const application = useApplication();
  const formattingCodeInProgress = useObservable(application.formattingCodeInProgress);
  const editorRangeSelections = useObservable(application.editorRangeSelections);
  const showPrettierButtonObservable = useObservable(useCallback(() => showPrettierButton(application, file), [application, file]));

  if (!showPrettierButtonObservable) {
    return null;
  }

  const shortcut = application.isAppleDevice ? '⌘-⌥–S' : 'Ctrl–Alt–S';

  return (
    <button
      onClick={async () => {
        // Clicking the button creates a sparkle animation as well as formatting the file
        await application.formatCode({ actionTrigger: 'button', withAnimation: true });
      }}
      disabled={editorRangeSelections.length > 1 || formattingCodeInProgress}
      data-tooltip={`Keyboard shortcut: ${shortcut}`}
      data-tooltip-left="true"
      className="button prettier-button"
      data-testid="prettier-button"
    >
      <span>{editorRangeSelections.length > 0 ? 'Format This Selection' : 'Format This File'}</span>
      {formattingCodeInProgress ? <Loader /> : <PrettierSparklesEmoji />}
    </button>
  );
}
