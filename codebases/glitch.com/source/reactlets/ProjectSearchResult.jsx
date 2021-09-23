import React from 'react';
import useApplication from '../hooks/useApplication';

export default function ProjectSearchResult({ item, highlighted = {} }) {
  const application = useApplication();

  const openFile = () => {
    application.selectFileByPathOrDefaultFile(item.path);
  };

  const onClick = openFile;

  return (
    <span className={item.extensionType}>
      <button className="result no-button-styles project-result" tabIndex="0" data-path={item.path} onClick={onClick}>
        {item.recent && <div className="result-tip">recent</div>}
        <div className="result-name">{highlighted.name || item.name}</div>
        {item.path && <div className="result-description">{highlighted.path || item.path}</div>}
      </button>
    </span>
  );
}
