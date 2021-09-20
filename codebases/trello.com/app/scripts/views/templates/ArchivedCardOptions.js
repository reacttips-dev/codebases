import React from 'react';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('archived_card_options');

export const ArchivedCardOptions = ({
  editable,
  canReopen,
  canDelete,
  reOpenText,
}) => {
  if (editable && (canReopen || canDelete)) {
    return (
      <p className="quiet" style={{ marginLeft: '8px' }}>
        {canReopen
          ? [
              <a className="js-reopen" href="#" key="open">
                {`${reOpenText}`}
              </a>,
              canDelete ? ` - ` : null,
            ]
          : null}
        {canDelete ? (
          <a className="js-delete" href="#" key="delete">
            {format('delete')}
          </a>
        ) : null}
      </p>
    );
  }
  return null;
};
