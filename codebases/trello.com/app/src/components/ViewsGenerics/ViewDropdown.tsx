import React, { useState } from 'react';
import cx from 'classnames';

import { Button } from '@trello/nachos/button';
import { CheckIcon } from '@trello/nachos/icons/check';
import { DownIcon } from '@trello/nachos/icons/down';
import { usePopover, Popover, PopoverPlacement } from '@trello/nachos/popover';
import { Textfield } from '@trello/nachos/textfield';

import { DropdownOption } from './types';
import styles from './ViewDropdown.less';

interface ViewDropdownProps {
  options: DropdownOption[];
  optionsLabel?: string;
  onChangeOption: (item: DropdownOption) => void;
  displayText: string;
  isMultiselect?: boolean;
  overrideStyles?: CSSModule;
  label?: string;
  popoverWidth: number;
  optionRenderer?: (item: DropdownOption) => React.ReactNode;
  dropdownPlacement?: PopoverPlacement.RIGHT_END | PopoverPlacement.BOTTOM;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export const ViewDropdown = ({
  displayText,
  onChangeOption,
  options,
  optionsLabel,
  isMultiselect = false,
  overrideStyles = {},
  label,
  popoverWidth,
  optionRenderer,
  dropdownPlacement = PopoverPlacement.BOTTOM,
  showSearch = false,
  searchPlaceholder,
}: ViewDropdownProps) => {
  const {
    toggle,
    hide,
    triggerRef,
    popoverProps,
  } = usePopover<HTMLButtonElement>();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const getOptions = () => {
    if (searchTerm.length === 0) {
      return options;
    }
    return options.filter((option) =>
      option.label.toUpperCase().match(searchTerm.toUpperCase()),
    );
  };

  const setSearchAndFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
  };

  const optionAction = (option: DropdownOption) => {
    if (!isMultiselect) {
      hide();
    }
    onChangeOption(option);
  };
  const renderCheck = (option: DropdownOption) => {
    // if the option has a child instead of a label,
    // it is the parents responsibility to show the check mark
    // since it is easier to let the element handle width of text (member)
    // or background (label)
    if (option.isSelected && option.label) {
      return (
        <CheckIcon size="small" dangerous_className={styles.dropdownCheck} />
      );
    }
  };

  const onKeyUp = (e: React.KeyboardEvent<Element>, option: DropdownOption) => {
    switch (e.which) {
      case 32: // space bar
        e.preventDefault(); // stop the document from scrolling
      // fallthrough
      case 13: // enter
        optionAction(option);
        break;
      default:
        break;
    }
  };

  return (
    <>
      {label && <label className={styles.label}>{label}</label>}
      <div className={cx(overrideStyles.dropdownWrapper, styles.select)}>
        <Button
          className={cx(styles.dropdownButton, overrideStyles.dropdownButton)}
          onClick={toggle}
          ref={triggerRef}
          size="fullwidth"
          iconAfter={
            <DownIcon
              size="small"
              dangerous_className={cx(
                styles.dropdownButtonIcon,
                overrideStyles.dropdownIcon,
              )}
            />
          }
        >
          <span className={styles.dropdownButtonText}>{displayText}</span>
        </Button>
        <Popover
          {...popoverProps}
          dangerous_width={popoverWidth}
          placement={dropdownPlacement}
        >
          {showSearch && (
            <Textfield
              value={searchTerm}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={setSearchAndFilter}
              placeholder={searchPlaceholder}
              className={styles.searchBar}
            />
          )}
          {optionsLabel && (
            <label className={styles.label}>{optionsLabel}</label>
          )}
          <ul className="pop-over-list inline-check">
            {getOptions().map((option) => {
              return (
                <li key={option.value}>
                  <a
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={() => optionAction(option)}
                    // eslint-disable-next-line react/jsx-no-bind
                    onKeyUp={(e) => onKeyUp(e, option)}
                    role="button"
                    className="pop-over-list-item"
                    tabIndex={0}
                  >
                    {optionRenderer && optionRenderer(option)}
                    {!optionRenderer && (
                      <>
                        {option.label}
                        {renderCheck(option)}
                      </>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </Popover>
      </div>
    </>
  );
};
