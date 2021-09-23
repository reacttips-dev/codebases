import React from 'react';
import { isFileMarkdown } from '../../utils/markdown';
import useApplication from '../../hooks/useApplication';

export function showMarkdownButton(file) {
  return isFileMarkdown(file);
}

export default function Markdown({ file }) {
  const application = useApplication();

  const onMarkdownPreviewClick = () => {
    application.markdownPreviewVisible.toggle();
  };

  if (!showMarkdownButton(file)) {
    return null;
  }

  return (
    <button className="button" onClick={onMarkdownPreviewClick}>
      <span>Markdown</span>
      <span className="icon eye" />
    </button>
  );
}
