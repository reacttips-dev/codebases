import React from 'react';
import { forTemplate } from '@trello/i18n';
import cx from 'classnames';
import styles from './SuggestedSearches.less';
import { currentLocale } from '@trello/locale';

const format = forTemplate('card_cover_chooser');

const suggestions = {
  productivity: 'Productivity',
  perspective: 'Perspective',
  organization: 'Organization',
  colorful: 'Colorful',
  nature: 'Nature',
  business: 'Business',
  minimal: 'Minimal',
  space: 'Space',
  animals: 'Animal',
};

interface SuggestedSearchesProps {
  onSelect: (searchText: string) => void;
}

const localizedButtonString = (
  suggestionKey: string,
  englishString: string,
) => {
  if (
    currentLocale === 'en-US' ||
    currentLocale === 'en-GB' ||
    currentLocale === 'en-AU' ||
    format(suggestionKey) === englishString
  ) {
    return format(suggestionKey);
  } else {
    return format(suggestionKey) + ' (' + englishString + ')';
  }
};

export const SuggestedSearches: React.FunctionComponent<SuggestedSearchesProps> = ({
  onSelect,
}) => {
  return (
    <div>
      <h4 className={styles.heading}>{format('suggested-searches')}</h4>
      {Object.entries(suggestions).map(([suggestionKey, englishString]) => (
        <button
          className={cx('button', styles.suggestedSearchButton)}
          key={suggestionKey}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={(e) => {
            e.stopPropagation();
            onSelect(englishString);
          }}
        >
          {localizedButtonString(suggestionKey, englishString)}
        </button>
      ))}
    </div>
  );
};
