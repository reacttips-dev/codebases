import React, { useMemo, useRef } from 'react';
import ReactSelect, {
  ActionMeta,
  InputActionMeta,
  MenuPlacement,
  MenuPosition,
  OptionType,
  OptionsType,
  SelectComponentsConfig,
  components,
} from 'react-select';
import cx from 'classnames';
import { Key } from '@trello/keybindings';
import {
  ELEVATION_ATTR,
  useCurrentElevation,
  useCallbackRef,
} from '@trello/layer-manager';
import { TestId, TEST_ID_ATTR } from '@trello/test-ids';

import {
  GLOBAL_NAMESPACE_PREFIX,
  ComponentStateActive,
  ComponentAppearanceCompact,
  ComponentStateDisabled,
  ComponentStateFocus,
  SelectClassnameLabel,
  ComponentStateSelected,
  ComponentAppearanceStatic,
  ComponentAppearanceSubtle,
  SelectClassnameBase,
  SelectClassnameContainer,
  SelectClassnameControl,
  SelectClassnameMenu,
  SelectClassnameOption,
  SelectClassnameVal,
  SelectControlCompactHeight,
  SelectControlCompactPaddingX,
  SelectControlCompactPaddingY,
  SelectControlDefaultBorder,
  SelectControlDefaultBorderRadius,
  SelectControlDefaultHeight,
  SelectControlDefaultPaddingX,
  SelectControlDefaultPaddingY,
  SelectGroupHeadingDefaultColor,
  SelectGroupHeadingDefaultFontSize,
  SelectGroupHeadingDefaultFontWeight,
  SelectGroupHeadingDefaultLineHeight,
  SelectGroupHeadingDefaultMarginBottom,
  SelectIndicatorsContainerDefaultPaddingRight,
  SelectInputCompactLeft,
  SelectInputCompactTop,
  SelectInputDefaultLeft,
  SelectInputDefaultMaxWidth,
  SelectInputDefaultTop,
  SelectSingleValueDefaultMarginLeft,
  SelectValueContainerDefaultMaxWidth,
  SelectValueContainerDefaultPadding,
  SelectValueContainerDefaultLoadingMaxWidth,
} from '../../../tokens';
import { ListCell, ListItem } from '../List';
import { truncateText } from '../Presentational';
import styles from './Select.less';

/**
 * NOTE: References https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/Select.js
 * This select is effectively a wrapper around react-select.
 * There are some properties that we've omitted based on likelihood of
 * usage, but if there are missing props, we can definitely add more.
 * Other props are considered optional for our purposes, but provided
 * default prop values by react-select.
 */

export const SelectClasses = {
  SELECT: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}`,
  CONTAINER: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}-${SelectClassnameContainer}`,
  CONTROL: {
    BASE: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameControl}`,
    FOCUS: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameControl}--${ComponentStateFocus}`,
    COMPACT: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameControl}--${ComponentAppearanceCompact}`,
    SUBTLE: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameControl}--${ComponentAppearanceSubtle}`,
    DISABLED: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameControl}--${ComponentStateDisabled}`,
  },
  MENU: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameMenu}`,
  OPTION: {
    BASE: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameOption}`,
    ACTIVE: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameOption}--${ComponentStateActive}`,
    DISABLED: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameOption}--${ComponentStateDisabled}`,
    SELECTED: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameOption}--${ComponentStateSelected}`,
  },
  VALUE: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameVal}`,
  LABEL: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}__${SelectClassnameLabel}`,
  // For usage with static selects
  // includes styles for indicator
  STATIC: `${GLOBAL_NAMESPACE_PREFIX}${SelectClassnameBase}--${ComponentAppearanceStatic}`,
};

interface OptionObject {
  value: string;
  label: string;
  testId?: TestId;
  image?: string | React.ReactNode;
  meta?: string | React.ReactNode;
  isDisabled?: boolean;
}
type OptionType = OptionObject | string | object;
type OptionsType = OptionType[];

interface OptionProps {
  /* Whether the Select menu is currently being focused */
  isFocused: boolean;
  /* Whether the current option is selected or not */
  isSelected: boolean;
  /* Data for the option */
  data: OptionObject;
  /* Props from the Select component */
  selectProps: SelectProps;
}

interface GroupType {
  options: OptionsType;
  label: string | React.ReactNode;
  image?: string | React.ReactNode;
}

type GroupsType = GroupType[];
type ValueType =
  | OptionType
  | OptionsType
  | GroupType
  | GroupsType
  | string
  | null;
type LabelType = string | React.ReactNode | null;
interface ReactSelectProps {
  /* Aria label (for assistive tech) */
  'aria-label'?: string;
  /* HTML ID of an element that should be used as the label (for assistive tech) */
  'aria-labelledby'?: string;
  /* Focus the control when it is mounted */
  autoFocus?: boolean;
  /**
   * Remove the currently focused option when the user
   * presses backspace
   * @default true
   */
  backspaceRemovesValue?: boolean;
  /**
   * Remove focus from the input when the user selects
   * an option (handy for dismissing the keyboard on touch devices)
   * @default isTouchCapable()
   */
  blurInputOnSelect?: boolean;
  /**
   * When the user reaches the top/bottom of the menu, prevent scroll on the scroll-parent
   * @default !isTouchCapable()
   */
  captureMenuScroll?: boolean;
  /* Sets a className attribute on the outer component */
  className?: string;
  /*
    If provided, all inner components will be given a prefixed className attribute.
    This is useful when styling via CSS classes instead of the Styles API approach.
  */
  classNamePrefix?: string | null;
  /**
   * Close the select menu when the user selects an option
   * @default true
   */
  closeMenuOnSelect?: boolean;
  /**
   * If `true`, close the select menu when the user scrolls the document/body.
   * If a function, takes a standard javascript `ScrollEvent` you return a boolean:
   *  `true` => The menu closes
   *  `false` => The menu stays open
   * This is useful when you have a scrollable modal
   * and want to portal the menu out, but want to
   * avoid graphical issues.
   * @default false
   */
  closeMenuOnScroll?: boolean | EventListener;
  /**
   * This complex object includes all the compositional
   * components that are used in `react-select`. If you wish
   * to overwrite a component, pass in an object with the
   * appropriate namespace.
   *
   * If you only wish to restyle a component, we recommend
   * using the `styles` prop instead. For a list of the
   * components that can be passed in, and the shape that
   * will be passed to them, see react-select component docs.
   * @default {}
   */
  components?: typeof SelectComponentsConfig;
  /**
   * Whether the value of the select, e.g. SingleValue,
   * should be displayed in the control.
   * @default true
   */
  controlShouldRenderValue?: boolean;
  /* Delimiter used to join multiple values into a single HTML Input value */
  defaultValue?: ValueType | object;
  /* Delimiter used to join multiple values into a single HTML Input value */
  delimiter?: string;
  /**
   * Clear all values when the user presses escape AND
   * the menu is closed
   * @default false
   */
  escapeClearsValue?: boolean;
  /**
   * Custom method to filter whether an option should
   * be displayed in the menu
   * @default createFilter()
   */
  filterOption?:
    | ((option: OptionType, inputValue: string) => boolean)
    | null
    | boolean;
  /* Formats group labels in the menu */
  formatGroupLabel?: (group: GroupType) => React.ReactNode;
  /* Formats option labels in the menu and control as React components */
  formatOptionLabel?: (option: OptionType) => React.ReactNode;
  /** Resolves option data to a string
   * to be displayed as the label by components
   * @default Function
   */
  getOptionLabel?: (option: OptionType) => string;
  /** Resolves option data to a string to compare
   * options and specify value attributes
   * @default Function
   */
  getOptionValue?: (option: OptionType) => string;
  /* Hide the selected option from the menu */
  hideSelectedOptions?: boolean;
  /* The id to set on the SelectContainer component. */
  id?: string;
  /* The value of the search input */
  inputValue?: string;
  /* The id of the search input */
  inputId?: string;
  /* Define an id prefix for the select components e.g. {your-id}-value */
  instanceId?: number | string;
  /* Is the select value clearable */
  isClearable?: boolean;
  /**
   * Is the select disabled
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Is the select in a state of loading (async)
   * @default false
   */
  isLoading?: boolean;
  /*
    Override the built-in logic to detect whether an option is disabled
    An example can be found in the [Replacing builtins](/advanced#replacing-builtins) documentation.
  */
  isOptionDisabled?: (option: OptionType) => boolean | false;
  /* Override the built-in logic to detect whether an option is selected */
  isOptionSelected?: (option: OptionType) => boolean;
  /**
   * Support multiple selected options
   * @default false
   */
  isMulti?: boolean;
  /**
   * Is the select direction right-to-left
   * @default false
   */
  isRtl?: boolean;
  /**
   * Whether to enable search functionality
   * @default false
   */
  isSearchable?: boolean;
  /**
   * Async: Text to display when loading options
   * @default () => 'Loading...'
   */
  loadingMessage?: (p: { inputValue: string } | null) => string | null;
  /**
   * Minimum height of the menu before flipping
   * @default 140
   */
  minMenuHeight?: number;
  /**
   * Maximum height of the menu before scrolling
   * @default 300
   */
  maxMenuHeight?: number;
  /**
   * Whether the menu is open
   * @default false
   */
  menuIsOpen?: boolean;
  /**
   * Default placement of the menu in relation to the control.
   *  'auto' will flip when there isn't enough space below
   *  the control.
   * @default bottom
   */
  menuPlacement?: typeof MenuPlacement;
  /**
   * The CSS position value of the menu, when "fixed" extra
   * layout management is required
   * @default fixed
   */
  menuPosition?: typeof MenuPosition;
  /*
    Whether the menu should use a portal, and where it should attach
    An example can be found in the [Portaling](/advanced#portaling) documentation
  */
  menuPortalTarget?: HTMLElement | null;
  /**
   * Whether to block scroll events when the menu is open
   * @default false
   */
  menuShouldBlockScroll?: boolean;
  /**
   * Whether the menu should be scrolled into view when it opens
   * @default !isMobileDevice()
   */
  menuShouldScrollIntoView?: boolean;
  /* Name of the HTML Input (optional - without this, no input will be rendered) */
  name?: string;
  /**
   * Text to display when there are no options
   * @default () => 'No options'
   */
  noOptionsMessage?: (p: { inputValue: string }) => string | null;
  /* Handle blur events on the control */
  onBlur?: (event: React.SyntheticEvent<HTMLElement>) => void;
  /* Handle change events on the select */
  onChange?: (value: ValueType, action: typeof ActionMeta) => void;
  /* Handle focus events on the control */
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  /* Handle change events on the input */
  onInputChange?: (value: string, inputAction: typeof InputActionMeta) => void;
  /* Handle key down events on the select */
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  /* Handle the menu opening */
  onMenuOpen?: () => void;
  /* Handle the menu closing */
  onMenuClose?: () => void;
  /* Fired when the user scrolls to the top of the menu */
  onMenuScrollToTop?: (event: React.SyntheticEvent<HTMLElement>) => void;
  /* Fired when the user scrolls to the bottom of the menu */
  onMenuScrollToBottom?: (event: React.SyntheticEvent<HTMLElement>) => void;
  /**
   * Allows control of whether the menu is opened when the
   * Select is focused
   * @default false
   */
  openMenuOnFocus?: boolean;
  /**
   * Allows control of whether the menu is opened when the
   * Select is clicked
   * @default true
   */
  openMenuOnClick?: boolean;
  /**
   * Array of options that populate the select menu
   * @default []
   */
  options: OptionsType | GroupsType;
  /**
   * Number of options to jump in menu when page{up|down}
   * keys are used
   * @default 5
   */
  pageSize?: number;
  /**
   * Placeholder for the select value
   * @default 'Select...''
   */
  placeholder?: Node | string;
  /**
   * Status to relay to screen readers
   * @default number of results available
   */
  screenReaderStatus?: (p: { count: number }) => string;
  /**
   * Style modifier methods
   * A basic example can be found at the bottom of
   * the react-select "Replacing builtins" documentation.
   * @default {}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  styles?: any;
  /**
   * Sets the tabIndex attribute on the input
   * @default 0
   */
  tabIndex?: string;
  /**
   * Select the currently focused option when the user
   * presses tab
   * @default true
   */
  tabSelectsValue?: boolean;
  /* The value of the select; reflected by the selected option */
  value?: ValueType;
}

export type SelectProps = ReactSelectProps & {
  /**
   * The visible appearance of a Select.
   * @default default
   */
  appearance?: 'default' | 'subtle';
  /**
   * By default, passing in the `styles` object negates that of the Nachos
   * component; if this prop is true, the styles objects will instead merge.
   * @default false
   */
  combineStyles?: boolean;
  /**
   * Adds class name to container wrapping the Select component.
   * @default undefined
   */
  containerClassName?: string;
  /**
   * Adds styles to the container wrapping the Select component.
   * @default undefined
   */
  containerStyle?: React.CSSProperties;
  /**
   * Select the currently focused option when the user
   * presses tab
   * @default true
   */
  isFocused?: boolean;
  /**
   * Provides a label for the select above the select button
   * @default null
   */
  label?: LabelType;
  /**
   * When opening the menu, scrolls the selected option into menu view
   * @default true
   */
  scrollIntoViewSelectedOption?: boolean;
  /**
   * Affects the height of the select control. This prop is intended to mirror
   * a prop with the same name in AKSelect: https://atlassian.design/components/select/code
   * @default default
   */
  spacing?: 'default' | 'compact';
  /**
   * TRELLO INTERNAL
   * String to target select control element for automated test
   * @default null
   */
  testId?: TestId | string;
};

const getSelectStyles = ({ isCompact = false, isLoading = false }) => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: (base: any) => {
    const {
      backgroundColor,
      border,
      borderColor,
      borderWidth,
      borderStyle,
      boxShadow,
      ...rest
    } = base;
    const compactStyles = isCompact
      ? {
          height: SelectControlCompactHeight,
          minHeight: SelectControlCompactHeight,
          padding: `${SelectControlCompactPaddingY} ${SelectControlCompactPaddingX}`,
        }
      : {};
    return {
      ...rest,
      borderRadius: SelectControlDefaultBorderRadius,
      border: SelectControlDefaultBorder,
      height: SelectControlDefaultHeight,
      minHeight: SelectControlDefaultHeight,
      position: 'relative',
      padding: `${SelectControlDefaultPaddingY} ${SelectControlDefaultPaddingX}`,
      ...compactStyles,
    };
  },
  valueContainer: () => ({
    padding: SelectValueContainerDefaultPadding,
    position: 'initial',
    display: 'inherit',
    width: '100%',
    maxWidth: isLoading
      ? SelectValueContainerDefaultLoadingMaxWidth
      : SelectValueContainerDefaultMaxWidth,
    maxHeight: '100%',
  }),
  input: () => ({
    position: 'absolute',
    top: isCompact ? SelectInputCompactTop : SelectInputDefaultTop,
    left: isCompact ? SelectInputCompactLeft : SelectInputDefaultLeft,
    maxWidth: SelectInputDefaultMaxWidth,
    // here we want to truncate the text, but not add on the ellipsis,
    // as people tend to continue to type in inputs and an ellipsis
    // at the end may be unexpected
    ...truncateText(false),
  }),
  option: (_base: object, { isDisabled }: { isDisabled: boolean }) => ({
    cursor: isDisabled ? 'initial' : 'pointer',
  }),
  singleValue: () => ({
    marginLeft: SelectSingleValueDefaultMarginLeft,
    width: '100%',
    ...truncateText(),
  }),
  groupHeading: (base: object) => ({
    ...base,
    color: SelectGroupHeadingDefaultColor,
    fontSize: SelectGroupHeadingDefaultFontSize,
    fontWeight: SelectGroupHeadingDefaultFontWeight,
    lineHeight: SelectGroupHeadingDefaultLineHeight,
    marginBottom: SelectGroupHeadingDefaultMarginBottom,
  }),
  indicatorsContainer: (base: object) => ({
    ...base,
    paddingRight: SelectIndicatorsContainerDefaultPaddingRight,
  }),
});

const Option: React.FunctionComponent<OptionProps> = ({
  selectProps: { isDisabled, isFocused },
  isSelected,
  data: { label, meta, image, testId },
  ...props
}) => {
  const optionClassname = cx({
    [styles[SelectClasses.OPTION.BASE]]: true,
    [styles[SelectClasses.OPTION.SELECTED]]: isSelected,
    [styles[SelectClasses.OPTION.DISABLED]]: isDisabled,
    [styles[SelectClasses.OPTION.ACTIVE]]: isFocused,
  });

  return (
    <div {...{ [TEST_ID_ATTR]: testId }}>
      <components.Option className={optionClassname} {...props}>
        {!meta && !image ? (
          <ListItem>{label}</ListItem>
        ) : (
          <ListCell
            label={label}
            meta={meta}
            image={image}
            isSelected={isSelected}
          />
        )}
      </components.Option>
    </div>
  );
};

const Menu: React.FunctionComponent<OptionProps> = (props) => {
  // @ts-ignore
  // Here we pluck the menuElevation off the selectProps, so we can increment
  // the elevation of the menu relative to the select control
  const menuElevation = props?.selectProps?.menuElevation ?? 0;
  return (
    <div {...{ [ELEVATION_ATTR]: menuElevation }}>
      <components.Menu className={styles[SelectClasses.MENU]} {...props} />
    </div>
  );
};

const Control: React.FunctionComponent<OptionProps> = (props) => {
  const controlClassname = cx({
    [styles[SelectClasses.CONTROL.BASE]]: true,
    [styles[SelectClasses.CONTROL.FOCUS]]: props.isFocused,
    [styles[SelectClasses.CONTROL.COMPACT]]:
      props.selectProps.spacing === 'compact',
    [styles[SelectClasses.CONTROL.SUBTLE]]:
      props.selectProps.appearance === 'subtle',
  });
  // in order to make the data-test-id attribute available for testing,
  // we pass the value to <Select /> then pass the value from selectProps (from
  // react-select)
  const testId = props?.selectProps?.testId ?? null;

  return (
    <div {...{ [TEST_ID_ATTR]: testId }}>
      <components.Control className={controlClassname} {...props} />
    </div>
  );
};

const DoNotRender: React.FunctionComponent<void> = () => null;

const stopPropagationOfEscapePress = (event: React.KeyboardEvent) => {
  if (event.key === Key.Escape) {
    event.nativeEvent.stopImmediatePropagation();
    event.preventDefault();
  }
};

export const Select: React.FunctionComponent<SelectProps> = ({
  className,
  combineStyles,
  containerClassName,
  containerStyle,
  defaultValue,
  value,
  label,
  options,
  styles: selectStyles,
  testId,
  isSearchable = false,
  scrollIntoViewSelectedOption = true,
  // since we have some complex layer management with the react select
  // and popovers, setting this to the default prop prevents the select
  // menu from automatically pushing down the viewport
  // when the window is too small
  menuPosition = 'fixed',
  components: componentsFromProps,
  ...props
}) => {
  const selectRef: typeof ReactSelect = useRef(null);

  // Calculate the elevation of the menu, based on the elevation of the select
  // control
  const [selectWrapper, selectWrapperRef] = useCallbackRef<HTMLDivElement>();
  const currentElevation = useCurrentElevation(selectWrapper);
  const menuElevation = currentElevation + 1;

  const selectClassName = cx(
    {
      [SelectClasses.SELECT]: true,
      [styles[SelectClasses.SELECT]]: true,
      [styles[SelectClasses.CONTROL.DISABLED]]: props.isDisabled,
    },
    className,
  );

  let labelEl = label;
  if (typeof label === 'string') {
    labelEl = <label className={styles[SelectClasses.LABEL]}>{label}</label>;
  }

  // if options are an array of strings,
  // map strings to objects
  options.forEach((val, idx, arr) => {
    if (typeof val === 'string') {
      arr[idx] = {
        value: val,
        label: val,
      };
    }
  });

  let selectVal = value;
  // if value is a string, map string to object
  if (typeof value === 'string') {
    selectVal = {
      value: value,
      label: value,
    };
  }

  let selectDefaultVal = defaultValue;
  // if value is a string, map string to object
  if (typeof defaultValue === 'string') {
    selectDefaultVal = {
      value: defaultValue,
      label: defaultValue,
    };
  }

  // teh haxxors - hijacking react-selects `openMenu` behavior
  // we are keeping everything the same except how we are finding the index of
  // the `selectValue`
  const openMenuHandler = (focusOption: 'first' | 'last') => {
    const { select } = selectRef.current;
    const { menuOptions, selectValue, isFocused } = select.state;
    const { isMulti } = props;
    let openAtIndex =
      focusOption === 'first' ? 0 : menuOptions.focusable.length - 1;

    if (!isMulti && !!selectValue[0] && scrollIntoViewSelectedOption) {
      // previously this was looking up the object and was always returning -1
      const selectedIndex = menuOptions.focusable.findIndex(
        (i: OptionObject) => i.value === selectValue[0].value,
      );

      if (selectedIndex > -1) {
        openAtIndex = selectedIndex;
      }
    }

    // only scroll if the menu isn't already open
    select.scrollToFocusedOptionOnUpdate = !(isFocused && select.menuListRef);
    select.inputIsHiddenAfterUpdate = false;

    select.onMenuOpen();
    select.setState({
      focusedValue: null,
      focusedOption: menuOptions.focusable[openAtIndex],
    });

    select.announceAriaLiveContext({ event: 'menu' });
  };

  if (selectRef && selectRef.current) {
    selectRef.current!.select.openMenu = openMenuHandler;
  }

  const stylesResult = useMemo(() => {
    if (!combineStyles && selectStyles) {
      return selectStyles;
    }
    return {
      ...getSelectStyles({
        isCompact: props.spacing === 'compact',
        isLoading: props.isLoading,
      }),
      ...(selectStyles ?? {}),
    };
  }, [combineStyles, selectStyles, props.spacing, props.isLoading]);

  return (
    <div
      ref={selectWrapperRef}
      className={containerClassName}
      style={containerStyle}
    >
      {labelEl}
      <ReactSelect
        ref={selectRef}
        onKeyDown={stopPropagationOfEscapePress}
        className={selectClassName}
        styles={stylesResult}
        value={selectVal}
        defaultValue={selectDefaultVal}
        options={options}
        // eslint-disable-next-line react/jsx-no-bind
        isOptionDisabled={(option: OptionObject) => option.isDisabled}
        menuPortalTarget={document.body}
        menuPosition={menuPosition}
        isSearchable={isSearchable}
        components={{
          Menu,
          Option,
          Control,
          IndicatorSeparator: DoNotRender,
          DropdownIndicator: DoNotRender,
          ...componentsFromProps,
        }}
        testId={testId}
        // Forward the menuElevation on as a prop, this will be accessed
        // by the Menu component in order to set the data-elevation attribute
        menuElevation={menuElevation}
        {...props}
      />
    </div>
  );
};

// expose react-select components API
// https://react-select.com/components
export const SelectComponents = components;
