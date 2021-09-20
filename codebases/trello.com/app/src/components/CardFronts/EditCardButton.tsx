import React, { useState } from 'react';
import { EditIcon } from '@trello/nachos/icons/edit';
import styles from './EditCardButton.less';
import classNames from 'classnames';

interface EditCardButtonProps {
  onClick: () => void;
  shouldShow: boolean;
}

export const EditCardButton = ({
  onClick,
  shouldShow,
}: EditCardButtonProps) => (
  <button
    className={classNames(styles.editCardButton, shouldShow && styles.show)}
    onClick={onClick}
  >
    <EditIcon color="dark" size="small" />
  </button>
);

export const useEditCardButton = () => {
  const [shouldShowEditCardButton, setShouldShowEditCardButton] = useState(
    false,
  );

  const showEditCardButton = () => setShouldShowEditCardButton(true);
  const hideEditCardButton = () => setShouldShowEditCardButton(false);

  return {
    showEditCardButton,
    hideEditCardButton,
    shouldShowEditCardButton,
  };
};
