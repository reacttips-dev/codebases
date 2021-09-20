import React, {
  ReactNode,
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  Ref,
} from 'react';
import cx from 'classnames';

import Icon from '@atlaskit/icon';
import { Popper } from '@atlaskit/popper';
import Portal from '@atlaskit/portal';
import { forTemplate } from '@trello/i18n';
import { Key, Scope, useShortcut } from '@trello/keybindings';
import {
  ELEVATION_ATTR,
  useCallbackRef,
  useCurrentElevation,
  useClickOutsideHandler,
  getElevation,
  getHighestVisibleElevation,
} from '@trello/layer-manager';
import { PopoverTestIds } from '@trello/test-ids';

import {
  GLOBAL_NAMESPACE_PREFIX,
  ComponentAppearanceStatic,
  ComponentSizeL as LARGE,
  ComponentSizeM as MEDIUM,
  ComponentSizeS as SMALL,
  ComponentSizeXl as XLARGE,
  PopoverClassnameBase,
  PopoverClassnameBackButton,
  PopoverClassnameCloseButton,
  PopoverClassnameContent,
  PopoverClassnameHeader,
  PopoverClassnameIconButton,
  PopoverClassnameTitle,
  PopoverPortalDefaultZIndex,
  PopoverLargeWidth,
  PopoverMediumWidth,
  PopoverPopperDefaultPaddingUnit,
  PopoverContentDefaultPadding,
  PopoverSmallWidth,
  PopoverXlargeWidth,
} from '../../../tokens';

import { PopoverContext } from './PopoverScreen';
import styles from './Popover.less';
import { usePrevious } from './usePopover';
import {
  PopoverSize,
  PopoverPlacement,
  HideReason,
  PopoverProps,
} from './Popover.types';
const format = forTemplate('nachos_popover');

// trello specific hack so that we can tell the popper API the bounds of where
// want the popovers to render (the area below the header, that includes things
// like banners)
export const POPOVER_BOUNDARY_ELEMENT_ID = 'popover-boundary';

export const PopoverClasses = {
  POPOVER: `${GLOBAL_NAMESPACE_PREFIX}${PopoverClassnameBase}`,
  HEADER: `${GLOBAL_NAMESPACE_PREFIX}${PopoverClassnameBase}__${PopoverClassnameHeader}`,
  TITLE: `${GLOBAL_NAMESPACE_PREFIX}${PopoverClassnameBase}__${PopoverClassnameTitle}`,
  ICON_BUTTON: `${GLOBAL_NAMESPACE_PREFIX}${PopoverClassnameBase}__${PopoverClassnameIconButton}`,
  CLOSE_BUTTON: `${GLOBAL_NAMESPACE_PREFIX}${PopoverClassnameBase}__${PopoverClassnameCloseButton}`,
  BACK_BUTTON: `${GLOBAL_NAMESPACE_PREFIX}${PopoverClassnameBase}__${PopoverClassnameBackButton}`,
  CONTENT: `${GLOBAL_NAMESPACE_PREFIX}${PopoverClassnameBase}__${PopoverClassnameContent}`,
  STATIC: `${GLOBAL_NAMESPACE_PREFIX}${PopoverClassnameBase}--${ComponentAppearanceStatic}`,
};

const popoverSizeValues = {
  [SMALL]: PopoverSmallWidth,
  [MEDIUM]: PopoverMediumWidth,
  [LARGE]: PopoverLargeWidth,
  [XLARGE]: PopoverXlargeWidth,
};

interface PopoverHeaderProps {
  /**
   * React node(s) to render inside the Popover header
   */
  children: ReactNode;
  /**
   * Determines whether or not the Popover should render a "Back" button. This
   * back button allows navigation between PopoverScreens (multi-screen
   * popovers)
   * @default false
   */
  hasBackButton?: boolean;
  /**
   * Set to true to enable styling to accomodate multiline titles
   * @default undefined
   */
  UNSAFE_multilineTitle?: boolean;
  /**
   * A callback function that fires when the "back" button in the Popover is
   * clicked
   * @type { function }
   * @default undefined
   */
  onBack?: () => void;
  /**
   * A callback function that fires when the Popover's state is changed from
   * visible to not visible
   */
  onHide: (reason: HideReason) => void;
}
interface PopoverContentProps {
  /**
   * React node(s) to render inside the Popover content area (below the header,
   * where the Popover Screens are shown)
   */
  children: ReactNode;
  /**
   * A number (measured in pixels) to limit the max height of the
   * content of the Popover.
   * This number is dynamically calculated in useResizeHandler
   * and depends on the header height (trello only), viewport height, and some
   * spacing values (e.g. padding)
   * @default 0
   */
  maxHeight?: number;
  /**
   * Removes the default horizontal padding from the popover content.
   * This is useful when you want your content to extend all the way
   * to the edge of the popover.
   * @default false
   */
  noHorizontalPadding?: boolean;
  /**
   * Removes the default top padding from the popover content. This is
   * automatically placed when there is a title in the Popover Header.
   * @default false
   */
  noTopPadding?: boolean;
  /**
   * Removes the default bottom padding from the popover content.
   * @default false
   */
  noBottomPadding?: boolean;
}

/**
 * Attach a window click handler to close the Popover whenever you click outside
 * of its boundaries
 */
const useOutsideClickHandler = ({
  containerElement,
  triggerElement,
  onHide,
  isVisible,
}: {
  containerElement: HTMLElement | null;
  triggerElement: HTMLElement | null;
  onHide: (reason: HideReason) => void;
  isVisible: boolean;
}) => {
  const clickHandler = useCallback(
    (event: MouseEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      // Exit if we're clicking on the trigger, letting it handle toggling
      // the open state
      if (triggerElement && triggerElement.contains(event.target as Node)) {
        return;
      }

      // Finally, if our popover is visible, call our onHide callback
      if (isVisible) {
        onHide(HideReason.CLICK_OUTSIDE);
      }
    },
    [isVisible, onHide, triggerElement],
  );

  useClickOutsideHandler({
    element: containerElement,
    handleClickOutside: clickHandler,
    skip: !isVisible,
  });
};

/**
 * Attach window resize listener to update the max height of the Popover
 * content, ensuring that the height of the Popover is never greater than the
 * height of the viewport
 */
const useResizeHandler = ({
  isVisible,
  containerElement,
  contentElement,
  headerElement,
  anchorElement,
  dontOverlapAnchorElement,
  schedulePopperUpdateRef,
}: {
  isVisible: boolean;
  containerElement: HTMLElement | null;
  contentElement: HTMLElement | null;
  headerElement: HTMLElement | null;
  anchorElement: HTMLElement | null;
  dontOverlapAnchorElement?: boolean;
  schedulePopperUpdateRef: RefObject<(() => void) | undefined>;
}) => {
  const [contentMaxHeight, setContentMaxHeight] = useState<number>();
  const [forcedPlacement, setForcedPlacement] = useState(
    dontOverlapAnchorElement ? PopoverPlacement.BOTTOM_START : undefined,
  );
  const schedulePopperUpdate = schedulePopperUpdateRef.current;

  const resizeHandler = useCallback(() => {
    if (!containerElement || !contentElement) {
      return;
    }

    // Use the #content div as our viewport if it exists, otherwise default
    // to the whole document
    const viewportElement =
      document.getElementById(POPOVER_BOUNDARY_ELEMENT_ID) ||
      document.documentElement;
    const viewportHeight = viewportElement.clientHeight;

    const containerHeight = containerElement.getBoundingClientRect().height;
    const contentHeight = contentElement.getBoundingClientRect().height;
    const internalPadding = headerElement
      ? parseInt(PopoverContentDefaultPadding, 10)
      : parseInt(PopoverContentDefaultPadding, 10) * 2;

    let availableHeight =
      viewportHeight - // Without dontOverlapAnchorElement, the popover may take up full viewport.
      PopoverPopperDefaultPaddingUnit * 2; // This is the padding _external_ to popper, 1 for each edge of viewport

    if (dontOverlapAnchorElement && anchorElement) {
      const availableHeightAboveAnchor =
        anchorElement.getBoundingClientRect().top -
        viewportElement.getBoundingClientRect().top - // anchorElement's `bottom` includes the height of the Trello header, but viewportElement starts beneath the header
        PopoverPopperDefaultPaddingUnit * 3; // 2 units between anchorElement and popover, 1 unit for one edge of viewport

      const availableHeightBelowAnchor =
        viewportHeight -
        (anchorElement.getBoundingClientRect().bottom -
          viewportElement.getBoundingClientRect().top) - // anchorElement's `top` includes the height of the Trello header, but viewportElement starts beneath the header
        PopoverPopperDefaultPaddingUnit * 3; // 2 units between anchorElement and popover, 1 unit for one edge of viewport

      if (
        containerHeight <= availableHeightBelowAnchor ||
        availableHeightBelowAnchor >= availableHeightAboveAnchor
      ) {
        availableHeight = Math.min(availableHeight, availableHeightBelowAnchor);
        setForcedPlacement(PopoverPlacement.BOTTOM_START);
      } else {
        availableHeight = Math.min(availableHeight, availableHeightAboveAnchor);
        setForcedPlacement(PopoverPlacement.TOP_START);
      }
    }

    // Calculate space taken up by the popover header and padding, that will not be included in the content maxHeight
    const extraPixels = containerHeight - contentHeight + internalPadding; // This is the padding _internal_ to the popover's content

    const newContentMaxHeight = availableHeight - extraPixels;

    // Paranoid check for a negative max height. This would only occur if the
    // header alone was somehow bigger than the entire viewport
    if (newContentMaxHeight > 0) {
      setContentMaxHeight(newContentMaxHeight);
    } else {
      setContentMaxHeight(0);
    }
  }, [
    containerElement,
    contentElement,
    headerElement,
    dontOverlapAnchorElement,
    anchorElement,
  ]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      resizeHandler();
      if (schedulePopperUpdate) {
        schedulePopperUpdate();
      }
    });

    if (isVisible) {
      resizeHandler();

      window.addEventListener('resize', resizeHandler);

      if (contentElement) {
        observer.observe(contentElement, {
          childList: true,
          subtree: true,
          attributes: true,
        });
      }
    }

    return () => {
      window.removeEventListener('resize', resizeHandler);
      observer.disconnect();
    };
  }, [isVisible, contentElement, resizeHandler, schedulePopperUpdate]);

  return { contentMaxHeight, forcedPlacement };
};

const useEscapeHandler = ({
  isVisible,
  hasBackButton,
  onBack,
  onHide,
}: {
  isVisible: boolean;
  hasBackButton?: boolean;
  onBack?: () => void;
  onHide: (reason: HideReason) => void;
}) => {
  // Handle escape keypress to either pop or hide
  const escapeHandler = useCallback(() => {
    if (hasBackButton && onBack) {
      onBack();
    } else {
      onHide(HideReason.ESCAPE_HANDLER);
    }
  }, [hasBackButton, onBack, onHide]);

  useShortcut(escapeHandler, {
    scope: Scope.Popover,
    key: Key.Escape,
    enabled: isVisible,
  });
};

const useFocusManagement = ({
  contentElement,
  triggerElement,
  dangerous_disableFocusManagement,
}: {
  contentElement: HTMLElement | null;
  triggerElement: HTMLElement | null;
  dangerous_disableFocusManagement?: boolean;
}) => {
  const prevContentElement = usePrevious(contentElement);

  // Auto focus the content when it is mounted
  useLayoutEffect(() => {
    if (
      !dangerous_disableFocusManagement &&
      !prevContentElement &&
      contentElement
    ) {
      contentElement.focus();
    }
  }, [contentElement, dangerous_disableFocusManagement, prevContentElement]);

  // Focus the trigger when the content is unmounted
  useLayoutEffect(() => {
    if (
      !dangerous_disableFocusManagement &&
      prevContentElement &&
      !contentElement &&
      triggerElement
    ) {
      const triggerElevation = getElevation(triggerElement);
      const highestElevation = getHighestVisibleElevation();

      // Only restore focus to the trigger if it is at the highest elevation.
      // We might have opened a modal from within the popover for example, and don't want
      // to steal focus back from that modal
      if (triggerElevation >= highestElevation) {
        triggerElement.focus();
      }
    }
  }, [
    contentElement,
    dangerous_disableFocusManagement,
    prevContentElement,
    triggerElement,
  ]);
};

/**
 * Poll the current url to detect navigation if the popover is currently visible,
 * and hide the popover if it occurs. This _could_ be replaced with a mechanism
 * that 'hijacks' history.pushState and history.replaceState if we wanted to make
 * this generic, or we expected _many_ popovers to somehow be visible at the same
 * time.
 */
const useNavigationHandler = ({
  isVisible,
  onHide,
  dangerous_disableHideOnUrlSearchParamsChange,
}: {
  isVisible: boolean;
  onHide: (reason: HideReason) => void;
  dangerous_disableHideOnUrlSearchParamsChange?: boolean;
}) => {
  const prevUrlRef = useRef<{
    href: string;
    pathname: string;
  }>();
  const intervalIdRef = useRef<number>();

  useEffect(() => {
    if (isVisible) {
      const intervalId = window.setInterval(() => {
        const prevUrl = prevUrlRef.current;
        const url = {
          href: window.location.href,
          pathname: window.location.pathname,
        };
        prevUrlRef.current = url;

        if (dangerous_disableHideOnUrlSearchParamsChange) {
          // Custom behavior: Only hide on pathname changes.
          if (prevUrl && prevUrl.pathname !== url.pathname) {
            onHide(HideReason.NAVIGATION);
          }
          return;
        }

        // Default behavior: Hide on any navigation change.
        if (prevUrl && prevUrl.href !== url.href) {
          onHide(HideReason.NAVIGATION);
        }
      }, 500);
      intervalIdRef.current = intervalId;
    }
    return () => {
      if (intervalIdRef.current) {
        window.clearInterval(intervalIdRef.current);
      }
      intervalIdRef.current = undefined;
      prevUrlRef.current = undefined;
    };
  }, [dangerous_disableHideOnUrlSearchParamsChange, isVisible, onHide]);
};

/**
 * SVG glyph for usage with "Back" icon in Popover Header
 */
const backGlyph = () => (
  <svg
    width="10"
    height="18"
    viewBox="0 0 10 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.292893 8.29292L7.36396 1.22185C7.75449 0.831324 8.38765 0.831324 8.77817 1.22185C9.1687 1.61237 9.1687 2.24554 8.77817 2.63606L2.41421 9.00002L8.77818 15.364C9.1687 15.7545 9.1687 16.3877 8.77818 16.7782C8.38765 17.1687 7.75449 17.1687 7.36396 16.7782L0.292893 9.70713C-0.0976312 9.3166 -0.0976312 8.68344 0.292893 8.29292Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * SVG glyph for usage with "Close" icon in Popover Header
 */
const closeGlyph = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.58579 7L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683418 0.292893 0.292893C0.683418 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L7 5.58579L12.2929 0.292893C12.6834 -0.0976311 13.3166 -0.0976311 13.7071 0.292893C14.0976 0.683418 14.0976 1.31658 13.7071 1.70711L8.41421 7L13.7071 12.2929C14.0976 12.6834 14.0976 13.3166 13.7071 13.7071C13.3166 14.0976 12.6834 14.0976 12.2929 13.7071L7 8.41421L1.70711 13.7071C1.31658 14.0976 0.683418 14.0976 0.292893 13.7071C-0.0976311 13.3166 -0.0976311 12.6834 0.292893 12.2929L5.58579 7Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * A component that appears at the top of a rendered Popover. It includes the
 * title, close button, and back button (if there are multiple screens)
 */
export const PopoverHeader = forwardRef<HTMLElement, PopoverHeaderProps>(
  ({ children, hasBackButton, onBack, onHide, UNSAFE_multilineTitle }, ref) => {
    const onClose = useCallback(() => {
      onHide(HideReason.CLICK_CLOSE_BUTTON);
    }, [onHide]);

    return (
      <header
        className={cx(
          styles[PopoverClasses.HEADER],
          UNSAFE_multilineTitle && styles.UNSAFE_multilineTitle,
        )}
        ref={ref}
      >
        <div
          className={cx(
            styles[PopoverClasses.TITLE],
            UNSAFE_multilineTitle && styles.UNSAFE_multilineTitle,
          )}
          title={typeof children === 'string' ? children : undefined}
        >
          {children}
        </div>
        {hasBackButton ? (
          <button
            aria-label={format('return-to-previous-screen')}
            className={cx(
              styles[PopoverClasses.ICON_BUTTON],
              styles[PopoverClasses.BACK_BUTTON],
            )}
            onClick={onBack}
          >
            <Icon glyph={backGlyph} label="" size="small" />
          </button>
        ) : null}
        <button
          aria-label={format('close-popover')}
          className={cx(
            styles[PopoverClasses.ICON_BUTTON],
            styles[PopoverClasses.CLOSE_BUTTON],
            UNSAFE_multilineTitle && styles.UNSAFE_multilineTitle,
          )}
          onClick={onClose}
          data-test-id={PopoverTestIds.ClosePopover}
        >
          <Icon glyph={closeGlyph} label="" size="small" />
        </button>
      </header>
    );
  },
);

/**
 * A component that contains the main content of the Popover. If the Popover
 * has a title, it will remove the top padding.
 * The max height is dynamically set on
 * window resize events (@see useResizeHandler)
 */
export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    { children, maxHeight, noHorizontalPadding, noTopPadding, noBottomPadding },
    ref,
  ) => (
    <div
      tabIndex={-1}
      className={cx(styles[PopoverClasses.CONTENT], {
        ['px-0']: noHorizontalPadding,
        ['pt-0']: noTopPadding,
        ['pb-0']: noBottomPadding,
      })}
      ref={ref}
      style={{ maxHeight }}
    >
      {children}
    </div>
  ),
);

/**
 * A component that renders some content in a floating container within a
 * React Portal, typically triggered by a different element.
 * It has the ability to account for multiple screens of
 * content using hooks and context.
 * @see PopoverScreen
 * @see usePopover
 *
 * The visual state of the Popover (including it’s visibility and screen
 * management) is handled via the `usePopover` hook, which should be used
 * in conjunction with the Popover component.
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
export const Popover: React.FunctionComponent<PopoverProps> = ({
  placement,
  size,
  title,
  UNSAFE_multilineTitle,
  noHorizontalPadding,
  noVerticalPadding,
  dontOverlapAnchorElement,
  testId,

  isVisible,
  triggerElement,
  targetElement,
  onHide,
  hasBackButton,
  onBack,
  currentScreen,

  children,
  dangerous_className,
  dangerous_width,
  dangerous_disableFocusManagement,
  dangerous_disableHideOnUrlSearchParamsChange,
}) => {
  const [screenTitle, setScreenTitle] = useState<ReactNode | undefined>(
    undefined,
  );
  const [screenSize, setScreenSize] = useState<PopoverSize | undefined>(
    undefined,
  );
  const [screenNoHorizontalPadding, setScreenNoHorizontalPadding] = useState<
    boolean | undefined
  >(undefined);
  const [screenNoVerticalPadding, setScreenNoVerticalPadding] = useState<
    boolean | undefined
  >(undefined);
  const [screenTestId, setScreenTestId] = useState<string | undefined>(
    undefined,
  );

  const [headerElement, headerRef] = useCallbackRef<HTMLElement>();
  const [contentElement, contentRef] = useCallbackRef<HTMLDivElement>();
  const [containerElement, containerRef] = useCallbackRef<HTMLElement>();
  const schedulePopperUpdateRef = useRef<(() => void) | undefined>(undefined);

  // We have to use a callback wrapper to wire up the containerRef _and_ to
  // let popper know about it with it's 'ref' render prop
  const containerRefCallback = useCallback(
    <T extends HTMLElement>(node: T | null, popperRefCallback: Ref<T>) => {
      containerRef(node);
      if (typeof popperRefCallback === 'function') {
        popperRefCallback(node);
      }
    },
    [containerRef],
  );

  // Determine whether to anchor the Popover to the trigger or the target.
  // If no target ref was provided, we assume the trigger is the anchor
  const anchorElement = targetElement ? targetElement : triggerElement;

  // Defensively ensure that if the state is saying we are visible, but we have no
  // anchor, call our onHide callback (we won't be able to mount anywhere so we
  // should let our parent know we were hidden to keep their state in sync)
  // This situation only arises when a consumer is managing multiple nested popovers
  // from within the same component (i.e they are invoking the usePopover hook multiple
  // times for nested popovers). In the following scenario:
  // 1. User opens root popover
  // 2. User opens nested popover
  // 3. User clicks outside the root popover
  // 4. Nested popover is _unmounted_ (not hidden)
  // 5. User opens the root popover again
  // 6. The nested popover still has isVisible as true, but no target element to be mounted on
  useEffect(() => {
    if (!anchorElement && isVisible) {
      onHide(HideReason.NO_ANCHOR_ELEMENT);
    }
  }, [anchorElement, isVisible, onHide]);

  const currentElevation = useCurrentElevation(anchorElement);
  const nextElevation = currentElevation + 1;

  useOutsideClickHandler({
    containerElement,
    triggerElement,
    onHide,
    isVisible,
  });
  const { contentMaxHeight, forcedPlacement } = useResizeHandler({
    isVisible,
    containerElement,
    contentElement,
    headerElement,
    anchorElement,
    dontOverlapAnchorElement,
    schedulePopperUpdateRef,
  });
  useEscapeHandler({ isVisible, hasBackButton, onBack, onHide });
  useNavigationHandler({
    isVisible,
    onHide,
    dangerous_disableHideOnUrlSearchParamsChange,
  });
  useFocusManagement({
    contentElement,
    triggerElement,
    dangerous_disableFocusManagement,
  });

  if (!isVisible || !anchorElement) {
    return null;
  }

  // Fall-back to the 'title' and 'size' props for the Popover if none were
  // provided to the PopoverScreen
  const actualTitle = screenTitle ?? title;
  const actualSize =
    dangerous_width ?? popoverSizeValues[screenSize ?? size ?? MEDIUM];
  const actualNoHorizontalPadding =
    screenNoHorizontalPadding ?? noHorizontalPadding;
  const actualNoVerticalPadding = screenNoVerticalPadding ?? noVerticalPadding;
  const actualTestId = screenTestId ?? testId;
  const nestedContext = {
    currentScreen,
    setScreenTitle,
    setScreenSize,
    setScreenTestId,
    setScreenNoHorizontalPadding,
    setScreenNoVerticalPadding,
  };

  const boundariesElement =
    document.getElementById(POPOVER_BOUNDARY_ELEMENT_ID) || undefined;

  return (
    <Popper
      referenceElement={anchorElement}
      placement={forcedPlacement || placement || PopoverPlacement.BOTTOM_START}
      modifiers={{
        computeStyle: {
          // Uncommenting the line below will disable gpuAcceleration which
          // fixes the 'blurriness' of popover content on different zoom levels
          // in chrome
          gpuAcceleration: false,
        },
        keepTogether: {
          enabled: false,
        },
        flip: {
          // Don't auto-flip the popover if dontOverlapAnchorElement is manually
          // picking the placement.
          enabled: !forcedPlacement,
        },
        preventOverflow: {
          boundariesElement,
          padding: PopoverPopperDefaultPaddingUnit,
        },
      }}
    >
      {({ ref, style, scheduleUpdate }) => {
        schedulePopperUpdateRef.current = scheduleUpdate;

        return (
          <Portal zIndex={PopoverPortalDefaultZIndex}>
            <section
              className={cx(
                styles[PopoverClasses.POPOVER],
                dangerous_className,
                // This is silly, but we want to 'opt out' of the global click handler
                // logic. Specifically for trying to handle SPA transitions on raw <a>
                // tags. Any 'new' links should be using RouterLink.
                'js-react-root',
              )}
              // eslint-disable-next-line react/jsx-no-bind
              ref={(node) => containerRefCallback(node, ref)}
              data-test-id={actualTestId}
              style={{
                ...style,
                width: actualSize,
              }}
              {...{ [ELEVATION_ATTR]: nextElevation }}
            >
              <PopoverContext.Provider value={nestedContext}>
                {actualTitle ? (
                  <PopoverHeader
                    hasBackButton={hasBackButton}
                    onBack={onBack}
                    onHide={onHide}
                    ref={headerRef}
                    UNSAFE_multilineTitle={UNSAFE_multilineTitle}
                  >
                    {actualTitle}
                  </PopoverHeader>
                ) : null}
                <PopoverContent
                  noHorizontalPadding={actualNoHorizontalPadding}
                  noTopPadding={actualNoVerticalPadding || !!actualTitle}
                  noBottomPadding={actualNoVerticalPadding}
                  ref={contentRef}
                  maxHeight={contentMaxHeight}
                >
                  {children}
                </PopoverContent>
              </PopoverContext.Provider>
            </section>
          </Portal>
        );
      }}
    </Popper>
  );
};
