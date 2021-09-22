import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';
import { memoize } from 'lodash';

import keys from 'bundles/phoenix/components/a11y/constants';

type ChildProps = {
  'aria-controls'?: string;
  'aria-labelledby'?: string;
  id?: string;
};

type WrappedProps = {
  onEnter?: (childProps: ChildProps, event: React.KeyboardEvent<HTMLElement>) => void;
  onEsc?: (childProps: ChildProps, event: React.KeyboardEvent<HTMLElement>) => void;
  targetRef?: (targetElement: HTMLElement) => void;
  activateClick?: boolean;
  selectOnArrow?: boolean;
};

type InputProps = {
  children: React.ReactNode;
  allowDefaultOnEnter?: boolean;
  'aria-controls'?: string;
  'aria-labelledby'?: string;
};

type Props = InputProps & WrappedProps;

type State = { tabbableChildIndex: number };

function withKeyboardControls(WrappedComponent: React.ComponentType<InputProps>): React.ComponentType<Props> {
  class WithKeyboardControls extends React.Component<Props, State> {
    static defaultProps = {
      onEnter: () => undefined,
      onEsc: () => undefined,
      activateClick: false,
      selectOnArrow: false,
    };

    state = { tabbableChildIndex: 0 };

    childRefs: Array<HTMLElement | null | undefined> = [];

    getChildAtIndex(idx: number): React.ReactElement<ChildProps> | undefined {
      let child: React.ReactElement<ChildProps> | undefined;
      // We require stable enumeration between render() and manageFocus(), so we use this peculiar way of enumeration to
      // ensure that arrays are flattened equivalently.
      React.Children.forEach(this.props.children, (child0, currentIdx) => {
        if (currentIdx === idx && React.isValidElement<ChildProps>(child0)) {
          child = child0;
        }
      });
      return child;
    }

    manageFocus = memoize((idx: number) => (e: React.KeyboardEvent<HTMLElement>) => {
      const child = this.getChildAtIndex(idx);
      if (!child) {
        return;
      }

      const childProps = child.props;

      const key: number = e.keyCode;
      const { 'aria-controls': ariaControls, 'aria-labelledby': ariaLabelledBy, allowDefaultOnEnter } = this.props;
      let nextIdx = 0;
      let newFocus: HTMLElement | null | undefined = null;
      const controls = childProps['aria-controls'] || ariaControls;
      const labelledby = childProps['aria-labelledby'] || ariaLabelledBy;
      const { onEnter, onEsc, activateClick, selectOnArrow } = this.props;

      // In the below switch, we have to search for an appropriate valid element due to conditional rendering and ref
      // lifecycle: this.childRefs is a sparse array with potentially null values.

      switch (key) {
        case keys.up:
        case keys.left:
          // manage tabIndex using w3 accessibility standard strategy found:
          // https://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/#kbd_focus
          e.preventDefault();
          for (let i = 1, n = this.childRefs.length; i <= n && !newFocus; i += 1) {
            // Funny business for true modulo operator instead of native remainder operator.
            nextIdx = (((idx - i) % n) + n) % n;
            newFocus = this.childRefs[nextIdx];
          }
          newFocus?.focus();

          if (selectOnArrow) {
            newFocus?.click();
          }

          this.setState({ tabbableChildIndex: nextIdx });
          break;
        case keys.down:
        case keys.right:
          e.preventDefault();
          for (let i = 1, n = this.childRefs.length; i <= n && !newFocus; i += 1) {
            // Funny business for true modulo operator instead of native remainder operator.
            nextIdx = (((idx + i) % n) + n) % n;
            newFocus = this.childRefs[nextIdx];
          }
          newFocus?.focus();

          if (selectOnArrow) {
            newFocus?.click();
          }

          this.setState({ tabbableChildIndex: nextIdx });
          break;
        case keys.space:
        case keys.enter:
          if (!allowDefaultOnEnter) {
            e.preventDefault();
          }

          nextIdx = idx;
          newFocus = this.childRefs[nextIdx];

          if (activateClick) {
            newFocus?.click();
          }

          if (onEnter) {
            onEnter(childProps, e);
          }
          // If the child controls or is controlled by another element, try to switch focus to it
          if (controls) {
            this.giftFocus(controls);
          }
          break;
        case keys.esc:
          onEsc?.(childProps, e);
          if (labelledby) {
            this.giftFocus(labelledby);
          }
          break;
        case keys.home:
          e.preventDefault();
          for (let i = 0, n = this.childRefs.length; i < n && !newFocus; i += 1) {
            nextIdx = i;
            newFocus = this.childRefs[nextIdx];
          }
          newFocus?.focus();
          this.setState({ tabbableChildIndex: nextIdx });
          break;
        case keys.end:
          e.preventDefault();
          for (let i = 1, n = this.childRefs.length; i <= n && !newFocus; i += 1) {
            nextIdx = n - i;
            newFocus = this.childRefs[nextIdx];
          }
          newFocus?.focus();
          this.setState({ tabbableChildIndex: nextIdx });
          break;
        default:
          break;
      }
    });

    manageRef = memoize((currentIdx: number) => (childRef: HTMLElement | null) => {
      this.childRefs[currentIdx] = childRef;
    });

    giftFocus(elId: string) {
      const receivingEl = document.getElementById(elId);
      receivingEl?.focus();
    }

    render() {
      const { children, ...props } = this.props;
      const { tabbableChildIndex } = this.state;

      return (
        <WrappedComponent {...props}>
          {React.Children.map(children, (child, currentIdx) => {
            if (!React.isValidElement(child)) {
              return null;
            }
            // If the child is a native element than access it's ref if not access it's custom ref
            const refKey = typeof child.type === 'string' ? 'ref' : 'targetRef';
            const newProps = {
              [refKey]: this.manageRef(currentIdx),
              onKeyDown: this.manageFocus(currentIdx),
              tabIndex: currentIdx === tabbableChildIndex ? 0 : -1,
              key: child.key || currentIdx,
            };
            return React.cloneElement(child, newProps);
          })}
        </WrappedComponent>
      );
    }
  }

  return setDisplayName<Props>(wrapDisplayName(WrappedComponent, 'withKeyboardControls'))(WithKeyboardControls);
}

export default withKeyboardControls;
