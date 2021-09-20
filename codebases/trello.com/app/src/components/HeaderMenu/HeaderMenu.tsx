import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { Button } from '@trello/nachos/button';
import { DownIcon } from '@trello/nachos/icons/down';
import { Popover, usePopover } from '@trello/nachos/popover';
import { Analytics } from '@trello/atlassian-analytics';
import styles from './HeaderMenu.less';
import type { ActionSubjectIdType } from '@trello/atlassian-analytics/src/constants/ActionSubjectId';

interface HeaderMenuProps {
  buttonText: string;
  analyticsButtonName: ActionSubjectIdType;
  analyticsComponentName: ActionSubjectIdType;
  popoverTitle: string;
  optimisticQuery?: {
    query: (baseOptions?: object) => void;
    variables?: object;
  };
  dataTestId?: string;
  // when shouldHidePopover is true, invoke Nachos Popover's `hide` function
  shouldHidePopover?: boolean;
  // when popover visibility changes from visible to not visible,
  // `resetShouldHidePopover` is invoked if defined
  resetShouldHidePopover?: () => void;
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({
  buttonText,
  analyticsButtonName,
  analyticsComponentName,
  popoverTitle,
  optimisticQuery: {
    query: optimisticQuery,
    variables: optimisticQueryVariables,
  } = {},
  dataTestId,
  shouldHidePopover,
  resetShouldHidePopover,
  children,
}) => {
  const [mouseOver, setMouseOver] = useState(false);

  optimisticQuery &&
    optimisticQuery({
      variables: optimisticQueryVariables,
      skip: !mouseOver,
    });

  const {
    popoverProps,
    triggerRef,
    toggle,
    hide,
  } = usePopover<HTMLButtonElement>();

  const { isVisible: popOverIsVisible } = popoverProps;

  const setMouseOverTrue = useCallback(() => setMouseOver(true), [
    setMouseOver,
  ]);
  const setMouseOverFalse = useCallback(() => setMouseOver(false), [
    setMouseOver,
  ]);

  const handleClick = useCallback(() => {
    toggle();
    Analytics.sendClickedButtonEvent({
      buttonName: analyticsButtonName,
      source: 'appHeader',
    });
  }, [toggle, analyticsButtonName]);

  const handleHide = useCallback(() => {
    hide();
    Analytics.sendClosedComponentEvent({
      componentType: 'inlineDialog',
      componentName: analyticsComponentName,
      source: 'appHeader',
    });
  }, [hide, analyticsComponentName]);

  useEffect(() => {
    if (shouldHidePopover) {
      hide();
    }
  }, [shouldHidePopover, hide]);

  useEffect(() => {
    if (!popOverIsVisible) {
      resetShouldHidePopover && resetShouldHidePopover();
    }
  }, [popOverIsVisible, resetShouldHidePopover]);

  return (
    <>
      <Button
        appearance="transparent"
        className={classNames(styles.button, {
          [styles.buttonOpen]: popOverIsVisible,
        })}
        data-test-id={dataTestId}
        title={buttonText}
        // set aria label so screen reader doesn't read out the down icon
        aria-label={popoverTitle}
        onClick={handleClick}
        ref={triggerRef}
        onMouseOver={setMouseOverTrue}
        onMouseOut={setMouseOverFalse}
        iconAfter={
          <DownIcon
            size="small"
            color="light"
            dangerous_className={styles.buttonIcon}
          />
        }
        // onFocus / onBlur - do not define these until the bug in Nachos Button is fixed so that focus outlines work
      >
        <span className={styles.buttonText}>{buttonText}</span>
      </Button>
      <Popover {...popoverProps} title={popoverTitle} onHide={handleHide}>
        {children}
      </Popover>
    </>
  );
};
