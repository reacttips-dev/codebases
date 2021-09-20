import React from 'react';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('archived_cards');

export const ArchivedCards = () => {
  return (
    <>
      <p className="too-many-results-message helper js-search-message hide" />
      <div className="js-archive-items" />
      <p className="empty-list js-empty-message" />
      <a className="show-more js-more-cards" href="#">
        {format('load-more-cards')}
      </a>
    </>
  );
};
