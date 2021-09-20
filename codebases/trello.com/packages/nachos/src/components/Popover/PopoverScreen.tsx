import React, {
  useContext,
  ReactNode,
  useLayoutEffect,
  createContext,
} from 'react';
import { PopoverSize } from './Popover.types';

interface PopoverContextValue {
  /**
   * A function that sets the title for the Popover (rendered in PopoverHeader)
   */
  setScreenTitle: (screenTitle?: ReactNode) => void;
  /**
   * A function that sets the size of the Popover, changes the width of the
   * popover container
   */
  setScreenSize: (screenSize?: PopoverSize) => void;
  /**
   * A function that determines whether or not the Popover will have horizontal
   * padding (rendered within PopoverContent)
   */
  setScreenNoHorizontalPadding: (noHorizontalPadding?: boolean) => void;
  /**
   * Sets the prop for testing id (placed as the data attribute `data-test-id`)
   * @internal for usage with smoketest suites
   */
  setScreenTestId: (testId?: string) => void;
  /**
   * A function that sets the noVerticalPadding of the Popover (rendered within PopoverContent)
   */
  setScreenNoVerticalPadding: (noVerticalPadding?: boolean) => void;
  /**
   * A number representing the current screen that is rendered within the
   * Popover. This number will typically come from an enum in order to
   * differentiate each screen as unique such as:
   * ```
   * enum Screen {
   *  ScreenA,
   *  ScreenB,
   * }
   * ```
   * @default 0
   */
  currentScreen?: number;
}

interface PopoverScreenProps {
  /**
   * The value that will help keep track of the current index of the screen
   * we're showing in the Popover
   */
  id: number;
  /**
   * The content to display in the title container of the Popover
   * @default undefined
   */
  title?: ReactNode;
  /**
   * Determines the width of the Popover component. If none is provided, Popover
   * will fallback to `'medium'`
   * @default 'medium'
   */
  size?: PopoverSize;
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
   * A string that gets placed as a data attribute (data-test-id) so that our
   * smoketest can properly target and test the component
   * @default undefined
   */
  testId?: string;
}

export const PopoverContext = createContext<PopoverContextValue>({
  setScreenTitle: () => {},
  setScreenSize: () => {},
  setScreenNoHorizontalPadding: () => {},
  setScreenNoVerticalPadding: () => {},
  setScreenTestId: () => {},
  currentScreen: undefined,
});

/**
 * A component that acts as a wrapper to manage multi-screen popovers. This
 * effectively determines which bit of content to show in the PopoverContent
 * area amongst the multiple screens that are available. Order is managed with
 * usePopover hook.
 */
export const PopoverScreen: React.FunctionComponent<PopoverScreenProps> = ({
  id,
  children,
  title,
  size,
  noHorizontalPadding,
  noVerticalPadding,
  testId,
}) => {
  const {
    currentScreen,
    setScreenTitle,
    setScreenSize,
    setScreenNoHorizontalPadding,
    setScreenNoVerticalPadding,
    setScreenTestId,
  } = useContext(PopoverContext);

  // Update the title of the Popover, based on the title prop of the selected
  // PopoverScreen
  useLayoutEffect(() => {
    if (currentScreen === id) {
      setScreenTitle(title);
    }
  }, [currentScreen, id, title, setScreenTitle]);

  // Update the size of the Popover, based on the size prop of the selected
  // PopoverScreen
  useLayoutEffect(() => {
    if (currentScreen === id) {
      setScreenSize(size);
    }
  }, [currentScreen, id, size, setScreenSize]);

  // Update the noHorizontalPadding of the popover, based on the noHorizontalPadding prop of the selected
  // PopoverScreen
  useLayoutEffect(() => {
    if (currentScreen === id) {
      setScreenNoHorizontalPadding(noHorizontalPadding);
    }
  }, [currentScreen, id, noHorizontalPadding, setScreenNoHorizontalPadding]);

  // Update the noVerticalPadding of the popover, based on the noVerticalPadding prop of the selected
  // PopoverScreen
  useLayoutEffect(() => {
    if (currentScreen === id) {
      setScreenNoVerticalPadding(noVerticalPadding);
    }
  }, [currentScreen, id, noVerticalPadding, setScreenNoVerticalPadding]);

  // Update the test id of the popover, based on the testId prop of the selected PopoverScreen
  useLayoutEffect(() => {
    if (currentScreen === id) {
      setScreenTestId(testId);
    }
  }, [currentScreen, id, testId, setScreenTestId]);

  if (currentScreen !== id) {
    return null;
  }

  return <>{children}</>;
};
