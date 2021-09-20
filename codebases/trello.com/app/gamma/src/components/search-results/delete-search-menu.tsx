/* eslint-disable import/no-default-export */
import React from 'react';
import styles from './search-results.less';

import { forTemplate } from '@trello/i18n';
import preventDefault from 'app/gamma/src/util/prevent-default';
const format = forTemplate('saved_search');

interface DeleteSearchMenuProps {
  id: string;
  onDelete: (id: string) => void;
  onCancel: () => void;
}

const DeleteSearchMenu: React.FunctionComponent<DeleteSearchMenuProps> = ({
  id,
  onCancel,
  onDelete,
}) => {
  return (
    <div className={styles.savedSearchDeleteMenu}>
      <span>{format('are-you-sure-you-want-to-delete')}</span>
      <a onClick={preventDefault(() => onDelete(id))} href="#">
        {format('yes-delete')}
      </a>
      <a onClick={preventDefault(onCancel)} href="#">
        {format('no-keep-this')}
      </a>
    </div>
  );
};

export default DeleteSearchMenu;
