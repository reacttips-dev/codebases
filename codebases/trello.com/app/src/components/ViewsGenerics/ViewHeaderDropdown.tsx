import React from 'react';

import { forTemplate } from '@trello/i18n';
import { GroupByOption, ZoomLevel } from './types';

import { ViewDropdown } from './ViewDropdown';

const format = forTemplate('views');

type HeaderDropdownOption = ZoomLevel | GroupByOption;

interface ViewHeaderDropdownProps {
  options: HeaderDropdownOption[];
  currentOption: string;
  onChangeOption: (item: HeaderDropdownOption) => void;
  sendTrackingEvent: (selectedValue: HeaderDropdownOption) => void;
  hideUnscheduledPopover?: () => void;
}

export const ViewHeaderDropdown = ({
  options,
  currentOption,
  onChangeOption,
  sendTrackingEvent,
  hideUnscheduledPopover,
}: ViewHeaderDropdownProps) => {
  const optionAction = (option: HeaderDropdownOption) => {
    sendTrackingEvent(option);
    hideUnscheduledPopover && hideUnscheduledPopover();
    onChangeOption(option);
  };

  const dropDownOptions = options.map((option) => ({
    value: option,
    label: format(option),
    isSelected: currentOption === option,
  }));

  return (
    <ViewDropdown
      options={dropDownOptions}
      // eslint-disable-next-line react/jsx-no-bind
      onChangeOption={(option) =>
        optionAction(option.value as HeaderDropdownOption)
      }
      displayText={format(currentOption)}
      popoverWidth={160}
    />
  );
};
