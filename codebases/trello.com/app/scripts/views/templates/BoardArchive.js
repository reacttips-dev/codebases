import React from 'react';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('board_archive');

export const BoardArchive = () => {
  return (
    <>
      <div className="archive-controls">
        <div className="archive-controls-search">
          <input
            className="js-search js-autofocus"
            type="text"
            placeholder={format('search archive')}
          />
        </div>
        <a
          className="archive-controls-switch nch-button js-switch-section"
          href="#"
        />
      </div>
      <div className="spinner loading js-loading-spinner" />
      <div className="archive-content js-archive-content" />
    </>
  );
};
