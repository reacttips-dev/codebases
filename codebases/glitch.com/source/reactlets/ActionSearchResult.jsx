import React from 'react';
import cn from 'classnames';
import { Icon } from '@glitchdotcom/shared-components';
import useApplication from '../hooks/useApplication';

export default function ActionSearchResult({ item, highlighted = {} }) {
  const application = useApplication();

  const resultClass = cn('result no-button-styles project-result', {
    // note this danger-zone class isn't used at all right now; once we move the parent of this component to a true popover we'll address that
    'danger-zone': item.dangerous,
  });

  function onClick(e) {
    application.actionInterface.selectAction(item.action, e);
  }

  return (
    <span>
      {item.url ? (
        <a className={resultClass} href={item.url} target="_blank" rel="noopener noreferrer">
          <Icon icon={item.emojiName} />
          <div className="result-name">{highlighted.name || item.name}</div>
        </a>
      ) : (
        <button className={resultClass} onClick={onClick}>
          <Icon icon={item.emojiName} />
          <div className="result-name">{highlighted.name || item.name}</div>
        </button>
      )}
    </span>
  );
}
