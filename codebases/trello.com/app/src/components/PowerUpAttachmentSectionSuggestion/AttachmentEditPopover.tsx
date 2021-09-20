import React from 'react';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('claimed_attachment');

import Confirm from 'app/scripts/views/lib/confirm';

interface AttachmentEditPopoverProps {
  onRemoveAttachment: () => void;
}

export const AttachmentEditPopover: React.FunctionComponent<AttachmentEditPopoverProps> = ({
  onRemoveAttachment,
}) => {
  const confirmRemove = () => {
    Confirm.pushView('remove attachment', {
      confirmBtnClass: 'nch-button nch-button--danger',
      fxConfirm: onRemoveAttachment,
    });
  };

  return (
    <ComponentWrapper key="edit-attachment">
      <ul className="pop-over-list">
        <li>
          <a
            // eslint-disable-next-line react/jsx-no-bind
            onClick={confirmRemove}
            role="button"
          >
            {format('remove')}
          </a>
        </li>
      </ul>
    </ComponentWrapper>
  );
};
