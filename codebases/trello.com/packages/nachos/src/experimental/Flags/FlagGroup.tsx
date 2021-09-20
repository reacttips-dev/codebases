// (Mostly) lifted directly from @atlaskit/flag.

import React, {
  Children,
  createContext,
  ReactElement,
  useContext,
} from 'react';
import cx from 'classnames';
import { easeIn, ExitingPersistence, SlideIn } from '@atlaskit/motion';
import { DismissFlagArgs } from './types';
import styles from './Flag.less';

export const FLAG_GROUP_ID = 'FlagGroup';

interface Props {
  children?: Array<ReactElement> | ReactElement;
  onDismissed?: (args: DismissFlagArgs) => void;
}

interface FlagGroupAPI {
  onDismissed?: (args: DismissFlagArgs) => void;
  dismissAllowed: (id: number | string) => boolean;
}

export const FlagGroupContext = createContext<FlagGroupAPI>({
  dismissAllowed: () => false,
});

export function useFlagGroup() {
  return useContext(FlagGroupContext);
}

const flagAnimationTime = 400;

export const FlagGroup = (props: Props) => {
  const { children, onDismissed } = props;

  const renderChildren = () => {
    return children
      ? Children.map(children, (flag: ReactElement, index: number) => {
          const isDismissAllowed: boolean = index === 0;
          return (
            <SlideIn
              key={flag.props.id}
              enterFrom="left"
              fade="inout"
              duration={flagAnimationTime}
              // eslint-disable-next-line react/jsx-no-bind
              animationTimingFunction={() => easeIn}
            >
              {({ className: keyframeMotionClass }) => (
                <div
                  className={cx(
                    { [styles.dismissAllowed]: isDismissAllowed },
                    keyframeMotionClass,
                    styles.flagGroupChildren,
                  )}
                >
                  {flag}
                </div>
              )}
            </SlideIn>
          );
        })
      : false;
  };

  const hasFlags = Array.isArray(children)
    ? children.length > 0
    : Boolean(children);

  let firstFlagId: number | string | null = null;
  if (hasFlags && children) {
    firstFlagId = Array.isArray(children)
      ? children[0].props.id
      : children.props.id;
  }

  const api: FlagGroupAPI = {
    onDismissed,
    dismissAllowed: (id) => id === firstFlagId,
  };

  return (
    <FlagGroupContext.Provider value={api}>
      <div id={FLAG_GROUP_ID} className={styles.flagGroup}>
        {hasFlags ? (
          <h2 className={styles.flagGroupLabel}>Flag notifications</h2>
        ) : null}
        <ExitingPersistence appear={false}>
          {renderChildren()}
        </ExitingPersistence>
      </div>
    </FlagGroupContext.Provider>
  );
};
