import React, { useCallback } from 'react';
import cx from 'classnames';
import { Spinner } from '@trello/nachos/spinner';

import styles from './PowerUpViewOptions.less';

interface PowerUpViewOption {
  idPlugin: string;
  name: string;
  key: string;
  icon: string;
  description?: string;
  navigateTo: () => void;
}

interface PowerUpViewOptionsProps {
  isLoading: boolean;
  viewOptions: PowerUpViewOption[];
  currentView?: {
    idPlugin?: string;
    key?: string;
  };
}

function ViewOption({
  option,
  selected,
}: {
  option: PowerUpViewOption;
  selected: boolean;
}) {
  const buttonIcon = (
    <img className={styles.icon} src={option.icon} alt={option.name} />
  );

  const onClick = useCallback(() => option.navigateTo(), [option]);

  return (
    <div
      className={cx({
        'pop-over-list-item': true,
        current: selected,
      })}
      role="button"
      onClick={onClick}
    >
      {buttonIcon} {option.name}
      <span className="sub-name">{option.description}</span>
    </div>
  );
}

export const PowerUpViewOptions: React.FunctionComponent<PowerUpViewOptionsProps> = ({
  isLoading,
  viewOptions,
  currentView,
}) => {
  if (isLoading) {
    return <Spinner small />;
  }

  return (
    <ul className="pop-over-list">
      {viewOptions.map((viewOption) => {
        return (
          <li key={viewOption.name}>
            <ViewOption
              option={viewOption}
              selected={
                currentView?.idPlugin === viewOption.idPlugin &&
                currentView?.key === viewOption.key
              }
            />
          </li>
        );
      })}
    </ul>
  );
};
