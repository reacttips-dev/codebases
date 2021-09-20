/* eslint-disable react/no-danger */
import React, { FunctionComponent } from 'react';
import { siteDomain } from '@trello/config';

import { CommentDataModel } from 'app/gamma/src/types/models';

import { TrelloMarkdownWrapper } from './TrelloMarkdownWrapper';
import { defaultStore } from 'app/gamma/src/defaultStore';
// eslint-disable-next-line @trello/no-module-logic
export const markdown = new TrelloMarkdownWrapper(defaultStore);

import styles from './TrelloMarkdown.less';

export enum MarkdownContentType {
  Comment,
  Description,
  CheckItems,
}

interface AllProps {
  text: string;
  contentType: MarkdownContentType;
  options?: CommentDataModel;
}

export const TrelloMarkdown: FunctionComponent<AllProps> = ({
  text,
  contentType,
  options,
}) => {
  let formattedContent: string;

  switch (contentType) {
    case MarkdownContentType.Comment:
      formattedContent = markdown.comments.format(text, {
        siteDomain: siteDomain,
        ...options,
      }).output;
      break;
    case MarkdownContentType.Description:
      formattedContent = markdown.description.format(text, options).output;
      break;
    case MarkdownContentType.CheckItems:
      formattedContent = markdown.checkItems.format(text, options).output;
      break;
    default:
      throw new Error('Invalid MarkdownContentType for MarkdownContainer.');
  }

  return (
    <div
      className={styles.markdown}
      dangerouslySetInnerHTML={{
        __html: formattedContent,
      }}
    />
  );
};
