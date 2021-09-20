import { ReactNode } from 'react';
import {
  ComponentSizeL,
  ComponentSizeM,
  ComponentSizeS,
  ComponentSizeXl,
} from '../../../tokens';

export type PopoverSize =
  | typeof ComponentSizeL
  | typeof ComponentSizeM
  | typeof ComponentSizeS
  | typeof ComponentSizeXl;

export enum PopoverPlacement {
  AUTO_START = 'auto-start',
  AUTO = 'auto',
  AUTO_END = 'auto-end',
  TOP_START = 'top-start',
  TOP = 'top',
  TOP_END = 'top-end',
  RIGHT_START = 'right-start',
  RIGHT = 'right',
  RIGHT_END = 'right-end',
  BOTTOM_START = 'bottom-start',
  BOTTOM = 'bottom',
  BOTTOM_END = 'bottom-end',
  LEFT_START = 'left-start',
  LEFT = 'left',
  LEFT_END = 'left-end',
}

export enum HideReason {
  CLICK_OUTSIDE = 'click outside the popover',
  NO_ANCHOR_ELEMENT = 'popover was rendered with isVisible = true, but no anchor element to render on',
  ESCAPE_HANDLER = 'escape keypress handler',
  CLICK_CLOSE_BUTTON = 'click on the close button',
  NAVIGATION = 'browser navigation event',
}

export interface PopoverProps<
  TElementTrigger = HTMLElement,
  TElementTarget = HTMLElement
> {
  // Public API
  /**
   * Determines the position of where the Popover will open relative to its
   * trigger element
   * @default 'bottom-start'
   */
  placement?: PopoverPlacement;
  /**
   * The relative width of the Popover component, eventually
   * converted into pixel measurements. If none is provided, Popover
   * will fallback to `'medium'`.
   * @default 'medium'
   */
  size?: PopoverSize;
  /**
   * The content to display in the title container of the Popover
   * @default undefined
   */
  title?: ReactNode;

  /**
   * Set to true to enable styling to accomodate multiline titles
   * @default undefined
   */
  UNSAFE_multilineTitle?: boolean;

  /**
   * Removes the default horizontal padding from the popover content.
   * This is useful when you want your content to extend all the way
   * to the edge of the popover.
   * @default false
   */
  noHorizontalPadding?: boolean;
  /**
   * Removes the default vertical padding from the popover content.
   * This is useful when you want your content to extend all the way
   * to the edge of the popover.
   * @default false
   */
  noVerticalPadding?: boolean;
  /**
   * Prevents the popover from expanding over of the anchorElement. This can be
   * useful when keeping the anchorElement visible is more important than
   * increasing the maxHeight of the popover.
   *
   * @default undefined
   */
  dontOverlapAnchorElement?: boolean;
  /**
   * A string that gets placed as a data attribute (data-test-id) onto the
   * Portal rendered inside Popover so that our
   * smoketest can properly target and test the component
   * @default undefined
   */
  testId?: string;

  // Provided by the hook
  /**
   * Indicates whether or not the Popover is currently visible
   */
  isVisible: boolean;
  /**
   * The element that will toggle the visibility of the popover.
   * Toggling visibility is usually achieved by interacting with the
   * trigger element by mouse.
   */
  triggerElement: TElementTrigger | null;
  /**
   * The element that the Popover will position itself relative to. If no target
   * element is provided, the trigger element is used.
   */
  targetElement: TElementTarget | null;
  /**
   * A callback function that fires when the Popover's state is changed from
   * visible to not visible
   */
  onHide: (reason: HideReason) => void;
  /**
   * Indicates whether or not the Popover should render a "Back" button. This
   * back button allows navigation between PopoverScreens (multi-screen
   * popovers)
   * @default false
   */
  hasBackButton?: boolean;
  /**
   * A callback function that fires when the "back" button in the Popover is
   * clicked
   * @default undefined
   */
  onBack?: () => void;
  /**
   * A number representing the current screen that is rendered within the
   * Popover. This number will typically come from an enum in order to
   * differentiate each screen as unique, such as:
   * ```
   * enum Screen {
   *  ScreenA,
   *  ScreenB,
   * }
   * ```
   * @default 0
   */
  currentScreen?: number;

  // Escape hatches
  /**
   * ⚠️ DO NOT USE THIS PROP UNLESS YOU REALLY REALLY HAVE TO.
   *
   * Places a class name on the Popover (more specifically, the direct
   * descendant of the React Portal that renders the Popover).
   *
   * Please refrain from using this unless absolutely necessary.
   * @default undefined
   */
  dangerous_className?: string;

  /**
   * ⚠️ DO NOT USE THIS PROP UNLESS YOU REALLY REALLY HAVE TO.
   *
   * Overrides the 'size' prop with a custom pixel width. Useful
   * for legacy popovers that are designed to a very specific size (eg. EmojiPicker)
   *
   * Please refrain from using this unless absolutely necessary.
   * @default undefined
   */
  dangerous_width?: number;

  /**
   * ⚠️ DO NOT USE THIS PROP UNLESS YOU REALLY REALLY HAVE TO.
   *
   * Disables any auto focusing behavior of the Popover. By default the content of the Popover
   * will be focused when it is shown, and the trigger element will be focused when it is hidden
   *
   * Please refrain from using this unless absolutely necessary.
   * @default undefined
   */
  dangerous_disableFocusManagement?: boolean;

  /**
   * ⚠️ DO NOT USE THIS PROP UNLESS YOU REALLY REALLY HAVE TO.
   *
   * Disables the auto hide behavior of the popover for browser navigations that only change
   * search params. By default, the Popover will hide whenever window.location.href changes.
   *
   * Please refrain from using this unless absolutely necessary.
   * @default undefined
   */
  dangerous_disableHideOnUrlSearchParamsChange?: boolean;
}
