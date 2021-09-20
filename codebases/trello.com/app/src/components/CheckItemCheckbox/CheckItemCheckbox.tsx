import React, { FC, useCallback, useState } from 'react';
import styles from './CheckItemCheckbox.less';
import { Checkbox } from '@trello/nachos/checkbox';
import { Analytics } from '@trello/atlassian-analytics';

interface CheckItemCheckboxProps {
  model: { get: (attr: 'state') => 'complete' | 'incomplete' };
  onChange: () => void;
  isDisabled: boolean;
}

export const CheckItemCheckbox: FC<CheckItemCheckboxProps> = ({
  model,
  onChange,
  isDisabled,
}) => {
  const [isChecked, setIsChecked] = useState(model.get('state') === 'complete');
  const wrappedOnChange = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'checkItemCheckbox',
      source: 'cardDetailScreen',
    });
    onChange();
    setIsChecked(model.get('state') === 'complete');
  }, [model, onChange]);

  return (
    <Checkbox
      className={styles.checkItemCheckbox}
      onChange={wrappedOnChange}
      isChecked={isChecked}
      isDisabled={isDisabled}
    />
  );
};
