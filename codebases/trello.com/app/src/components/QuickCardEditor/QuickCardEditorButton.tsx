import React from 'react';

import styles from './QuickCardEditorButton.less';

interface QuickCardEditorButtonProps {
  icon: React.ReactElement;
  onClick: () => void;
}

export const QuickCardEditorButton: React.FunctionComponent<QuickCardEditorButtonProps> = ({
  icon,
  children,
  onClick,
}) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {icon}
      <span className={styles.buttonLabel}>{children}</span>
    </button>
  );
};
