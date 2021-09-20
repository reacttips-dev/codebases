import React from 'react';

import { CSSTransition } from 'react-transition-group';
export { TransitionGroup } from 'react-transition-group';

import styles from './dismiss-animation.less';

export const DismissAnimation: React.FunctionComponent<{ id: string }> = ({
  id,
  ...props
}) => (
  <CSSTransition
    key={id}
    timeout={200}
    classNames={{
      enter: styles.revealExpandStart,
      enterActive: styles.revealExpandEnd,
      exit: styles.fadeCollapseStart,
      exitActive: styles.fadeCollapseEnd,
    }}
    {...props}
  />
);
