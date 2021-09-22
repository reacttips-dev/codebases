/** @jsx jsx */
import React, { useEffect, useRef, useState } from 'react';
import moment, { Moment } from 'moment';

import { jsx, css } from '@emotion/react';
import { Theme, useTheme } from '@coursera/cds-core';
import { DropDown } from '@coursera/coursera-ui';

import { formatDateTimeDisplay, TIME_ONLY_DISPLAY_NO_TZ } from 'js/utils/DateTimeUtils';

type Props = {
  currentTime: Moment;
  minTime?: Moment;
  onChange: (newTime: Moment) => void;
};

const GoalSettingSetScheduleTimePickerStyles = (theme: Theme, maxHeight: number) => ({
  container: css`
    position: relative;
    margin: ${theme.spacing(8, 0)};

    .dropdown-menu {
      height: ${maxHeight}px;
      overflow: scroll;
    }
  `,
  button: css`
    padding: ${theme.spacing(8, 24)};
    border: 1px solid ${theme.palette.gray[500]};
    text-align: left;
    min-width: 110px;
    cursor: pointer;
    background: ${theme.palette.white};
  `,
});

const GoalSettingSetScheduleTimePicker: React.FC<Props> = ({ currentTime, minTime, onChange }) => {
  const maxDropdownHeight = 175;
  const picker = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  const displayTime = formatDateTimeDisplay(currentTime, TIME_ONLY_DISPLAY_NO_TZ);
  const theme = useTheme();
  const styles = GoalSettingSetScheduleTimePickerStyles(theme, maxDropdownHeight);

  const [dropdownDirection, setDropdownDirection] = useState<'top' | 'bottom'>('bottom');

  useEffect(() => {
    if (typeof window !== 'undefined' && button?.current) {
      if (window.innerHeight - button.current.getBoundingClientRect().bottom < maxDropdownHeight) {
        setDropdownDirection('top');
        return;
      }
    }
    setDropdownDirection('top');
  }, [button]);

  const renderButton = (label: string) => ({ getDropDownButtonProps }: any) => (
    <button type="button" {...getDropDownButtonProps()} css={[theme.typography.body1, styles.button]}>
      {label}
    </button>
  );

  const getListItems = () => {
    if (!minTime) {
      return [];
    }

    if (currentTime.valueOf() < minTime.valueOf()) {
      // TODO: log / report on this error!
      return [];
    }
    const lastListItem = moment(currentTime).endOf('day');
    const firstListItem = minTime.clone();

    const thirtyMinutes = 1800000;
    const startValue = firstListItem.valueOf();
    const endValue = lastListItem.valueOf();

    const items: { label: string; value: Moment }[] = [];

    let runningValue = startValue;
    while (runningValue < endValue) {
      runningValue += thirtyMinutes;
      const currentValue = moment(runningValue);
      items.push({
        label: formatDateTimeDisplay(currentValue, TIME_ONLY_DISPLAY_NO_TZ),
        value: currentValue,
      });
    }

    return items;
  };

  return (
    <div ref={picker} css={styles.container}>
      <DropDown.ButtonMenuV2
        menuRootClassName="dropdown-menu"
        dropDownPosition={{ horizontal: 'left', vertical: dropdownDirection }}
        listItemData={getListItems()}
        onClick={(event, val) => onChange(val)}
        renderButton={renderButton(displayTime)}
        usePopper
      />
    </div>
  );
};

GoalSettingSetScheduleTimePicker.defaultProps = {
  minTime: moment().startOf('day'),
};

export { GoalSettingSetScheduleTimePicker };

export default GoalSettingSetScheduleTimePicker;
