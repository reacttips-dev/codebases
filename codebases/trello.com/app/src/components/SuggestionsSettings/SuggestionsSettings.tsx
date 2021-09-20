import React from 'react';
import cx from 'classnames';
import { track } from '@trello/analytics';

import { forTemplate } from '@trello/i18n';
import styles from './SuggestionsSettings.less';

interface SuggestionsSettingsProps {
  context: string;
  onStopShowingSuggestions: () => void;
}

const format = forTemplate('suggestions_settings');

export const SuggestionsSettings: React.FunctionComponent<SuggestionsSettingsProps> = function SuggestionsSettings({
  context,
  onStopShowingSuggestions,
}) {
  return (
    <>
      <p>{format('if-these-arent-useful')}</p>
      <button
        className={cx('button', styles.stop)}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={(e) => {
          track('Suggestions', context, 'Stop Showing Suggestions');
          onStopShowingSuggestions();
        }}
      >
        {format('stop-showing-suggestions')}
      </button>
    </>
  );
};
