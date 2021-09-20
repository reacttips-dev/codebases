import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  PopoverPlacement,
  PopoverProps,
  PopoverSize,
  HideReason,
} from './Popover.types';
import { useCallbackRef } from '@trello/layer-manager';

interface UsePopoverArgs {
  /**
   * A number representing the initial screen that is rendered within the
   * Popover. This nunmber will typically come from an enum in order to
   * differentiate each screen as unique such as:
   * ```
   * enum Screen {
   *  ScreenA,
   *  ScreenB,
   * }
   * ```
   * @default 0
   */
  initialScreen?: number;
  /**
   * The size of the Popover. Defaults to 'medium'.
   */
  size?: PopoverSize;
  /**
   * The placement of the Popover relative to its trigger or target ref.
   */
  placement?: PopoverPlacement;
  /**
   * A callback function that fires when the Popover's state is changed from
   * not visible to visible
   */
  onShow?: () => void;
  /**
   * A callback function that fires when the Popover's state is changed from
   * visible to not visible
   */
  onHide?: (hideReason?: HideReason) => void;
}

export interface UsePopoverResult<
  TElementTrigger extends HTMLElement,
  TElementTarget extends HTMLElement = HTMLElement
> {
  // Refs for consumers to set
  /**
   * React ref for the Popover trigger element.
   * The Popover will be positioned relative to this element by default,
   * unless a `targetRef` element is provided.
   * Attach this ref to the React element using the ref prop.
   * @example
   * <button ref={triggerRef} onClick={toggle}>
   *  Toggle popover
   * </button>
   */
  triggerRef: (node: TElementTrigger) => void;
  /**
   * React ref for the Popover positioning target element.
   * The Popover will be positioned relative to this element.
   * Attach this ref to the React element using the ref prop.
   *
   * NOTE: If this ref is not used, the Popover will be positioned relative
   * to the triggerRef element.
   * @example
   * <div ref={targetRef}>
   *  Land ho!
   * </div>
   */
  targetRef: (node: TElementTarget) => void;

  // Single screen
  /**
   * A function that shows the Popover when called.
   *
   * i.e. `isVisible` = `true`
   */
  show: () => void;
  /**
   * A function that hides the Popover when called
   *
   * i.e. `isVisible` = `false`
   */
  hide: () => void;
  /**
   * A function that toggles the visibility of the Popover when called
   *
   * i.e. `isVisible` = `!isVisible`
   */
  toggle: () => void;

  // Multi screen
  /**
   * Function to change the current visible screen of the Popover.
   * This will add the screen to the Popover’s history, which enables
   * you to use the pop function to go back to a previous screen.
   *
   * Accepts a screen argument, which is the id of a particular
   * PopoverScreen component instance.
   * @example
   *
   * enum Screens {
   *  Screen1,
   *  Screen2,
   * }
   * const { triggerRef, toggle, push, popoverProps } = usePopover({
   *  initialScreen: Screens.Screen1,
   * });
   *
   * return (
   *  <>
   *    <button ref={triggerRef} onClick={toggle}>
   *      Toggle popover
   *    </button>
   *    <Popover {...popoverProps}>
   *      <PopoverScreen id={Screens.Screen1}>
   *        <button onClick={() => push(Screens.Screen2)}>
   *          Push new screen
   *        </button>
   *      </PopoverScreen>
   *      <PopoverScreen id={Screens.Screen2}>
   *        <span>New screen</span>
   *      </PopoverScreen>
   *    </Popover>
   *  </>
   * );
   */
  push: (screen: number) => void;
  /**
   * Function to change the current visible screen of the Popover to
   * one previously rendered in its history.
   *
   * Accepts an optional depth argument, which determines how many
   * steps backwards in history the function should take. If no argument is
   * provided, calling `pop()` will render the previous screen.
   * @example
   *
   * enum Screens {
   *  Screen1,
   *  Screen2,
   * }
   * const { triggerRef, toggle, pop, popoverProps } = usePopover({
   *  initialScreen: Screens.Screen2,
   * });
   *
   * return (
   *  <>
   *    <button ref={triggerRef} onClick={toggle}>
   *      Toggle popover
   *    </button>
   *    <Popover {...popoverProps}>
   *      <PopoverScreen id={Screens.Screen1}>
   *        <span>First screen/span>
   *      </PopoverScreen>
   *      <PopoverScreen id={Screens.Screen2}>
   *        <button onClick={() => pop()}>
   *          Pop to previous screen
   *        </button>
   *      </PopoverScreen>
   *    </Popover>
   *  </>
   * );
   */
  pop: (depth?: number) => void;

  /**
   * Props for Popover component. These should be provided to the Popover for
   * proper behavior regarding visibility and content.
   * @see PopoverProps
   * @example
   * const { triggerRef, toggle, hide, popoverProps } = usePopover();
   *
   * return (
   *  <>
   *    <button ref={triggerRef} onClick={toggle}>
   *      Toggle popover
   *    </button>
   *    <Popover {...popoverProps}>
   *      <button onClick={hide}>Hide popover</button>
   *    </Popover>
   *  </>
   *  );
   */
  popoverProps: PopoverProps<TElementTrigger, TElementTarget>;
}

export const usePrevious = <T>(value: T) => {
  const ref = useRef<T>();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]);

  // Return previous value (happens before update in useEffect above)
  return ref.current;
};

/**
 * A hook that, when called, provides relevant props to pass to the Popover
 * component, refs to pass to the trigger and/or target elements, and functions
 * for managing the Popover’s content. This is also the main handler
 * of show/hide logic of the Popover itself as well as any nested screens in the
 * Popover.
 * @see Popover
 * @see PopoverScreen
 *
 * Popovers are operated using hooks, so the props that you need can be easily
 * spread over the Popover component
 * @example
 * const { triggerRef, toggle, hide, popoverProps } = usePopover();
 *
 * return (
 *  <>
 *    <button ref={triggerRef} onClick={toggle}>
 *      Toggle popover
 *    </button>
 *    <Popover {...popoverProps}>
 *      <button onClick={hide}>Hide popover</button>
 *    </Popover>
 *  </>
 * );
 */
export const usePopover = <
  TElementTrigger extends HTMLElement,
  TElementTarget extends HTMLElement = HTMLElement
>({
  initialScreen = 0,
  size,
  placement,
  onShow,
  onHide,
}: UsePopoverArgs = {}): UsePopoverResult<TElementTrigger, TElementTarget> => {
  // Refs
  const [triggerElement, triggerRef] = useCallbackRef<TElementTrigger>();
  const [targetElement, targetRef] = useCallbackRef<TElementTarget>();

  // Single screen
  const [isVisible, setVisible] = useState(false);
  const show = useCallback(() => {
    setVisible(true);
  }, []);
  const hide = useCallback(() => {
    setVisible(false);
  }, []);
  const toggle = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  // Multi screen
  const [screenStack, setScreenStack] = useState([initialScreen]);
  const currentScreen = screenStack[screenStack.length - 1];
  const push = useCallback((screenId: number) => {
    setScreenStack((prev) => [...prev, screenId]);
  }, []);
  const pop = useCallback(
    (depth = 1) => {
      if (depth > screenStack.length - 1) {
        console.warn(
          '`depth` argument provided to `pop` exceeded the size of the screen stack',
        );
        return;
      }
      setScreenStack((prev) => prev.slice(0, -depth));
    },
    [screenStack.length],
  );

  // Clear the stack when hidden
  useEffect(() => {
    if (!isVisible && screenStack.length > 1) {
      setScreenStack([initialScreen]);
    }
  }, [isVisible, screenStack, setScreenStack, initialScreen]);

  // Consumer lifecycle hooks
  const wasVisible = usePrevious(isVisible);
  const hideReason = useRef<HideReason>();

  useEffect(() => {
    if (wasVisible === true && isVisible === false) {
      onHide?.(hideReason.current);
    }
    if (wasVisible === false && isVisible === true) {
      hideReason.current = undefined;
      onShow?.();
    }
  }, [isVisible, onHide, onShow, wasVisible]);

  // Probably an over-optimisation, but this ensures we pass
  // stable function references through to the popover component
  const onHideHandler = useCallback(
    (reason) => {
      hideReason.current = reason;
      hide();
    },
    [hide],
  );
  const onBackHandler = useCallback(() => {
    pop();
  }, [pop]);

  const popoverProps = useMemo<PopoverProps<TElementTrigger, TElementTarget>>(
    () => ({
      isVisible,
      size,
      placement,
      onHide: onHideHandler,
      onBack: onBackHandler,
      hasBackButton: screenStack.length > 1,
      targetElement,
      triggerElement,
      currentScreen,
    }),
    [
      isVisible,
      size,
      placement,
      onHideHandler,
      onBackHandler,
      screenStack.length,
      targetElement,
      triggerElement,
      currentScreen,
    ],
  );

  return {
    targetRef,
    triggerRef,

    show,
    hide,
    toggle,
    push,
    pop,

    // These props are 'internal' the popover hook, and are
    // expected to be spread onto the <Popover> component
    popoverProps,
  };
};
