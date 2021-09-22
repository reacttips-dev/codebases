import React from 'react';

import { Box, color } from '@coursera/coursera-ui';
import { SvgFail, SvgLoaderSignal } from '@coursera/coursera-ui/svg';

import _t from 'i18n!nls/video-highlighting';
import 'css!./__styles__/NotesReviewPageDataState';

import config from 'js/app/config';

type DataState = 'error' | 'loading' | 'empty';
type Props = {
  dataState: DataState;
};

// TODO: move these into coursera-ui icon library as assets
const noteIcon = `${config.url.resource_assets}learner/icon_note.svg`;
const highlightIcon = `${config.url.resource_assets}learner/icon_highlight.svg`;

const NotesReviewPageDataState = ({ dataState }: Props) => (
  <Box rootClassName="rc-NotesReviewPageDataState" flexDirection="column" justifyContent="start" alignItems="center">
    {dataState === 'error' && [
      <SvgFail key="icon" size={84} color={color.error} />,
      <div key="message" className="data-state-message headline-5-text">
        {_t('There was an issue loading your notes data. Please try refreshing the page.')}
      </div>,
    ]}
    {dataState === 'loading' && [
      <SvgLoaderSignal key="icon" size={84} />,
      <div key="message" className="data-state-message headline-5-text">
        {_t('Loading notes...')}
      </div>,
    ]}
    {dataState === 'empty' && [
      <Box justifyContent="center" rootClassName="state-icons">
        <img src={noteIcon} alt={_t('Take notes')} className="placeholder-icon" />
        <img src={highlightIcon} alt={_t('Highlight')} className="placeholder-icon" />
      </Box>,
      <div key="message" className="data-state-message headline-5-text">
        {_t('You have not added any notes yet. Notes can be created from video pages.')}
      </div>,
    ]}
  </Box>
);

export default NotesReviewPageDataState;
