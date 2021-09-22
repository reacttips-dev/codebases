import React from 'react';
import classNames from 'classnames';
import moment, { Moment } from 'moment';

import { DropDown } from '@coursera/coursera-ui';

import { formatDateTimeDisplay, TIME_ONLY_DISPLAY_NO_TZ } from 'js/utils/DateTimeUtils';

import 'css!bundles/goal-setting/components/__styles__/GoalSettingSetScheduleTimePicker';

type Props = {
  currentTime: Moment;
  minTime: Moment;
  onChange: (newTime: Moment) => void;
};

type State = {
  isOpen: boolean;
};

export class GoalSettingSetScheduleTimePicker extends React.Component<Props, State> {
  private picker: HTMLElement | null;

  static defaultProps = {
    minTime: moment().startOf('day'),
  };

  state = {
    isOpen: false,
  };

  constructor(props: Props) {
    super(props);
    this.picker = null;
  }

  componentDidMount() {
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('keyup', this.handleDocumentKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('keyup', this.handleDocumentKeyUp);
  }

  handleDocumentClick = (event: MouseEvent) => {
    if (this.picker && this.picker.contains(event.target as Node)) {
      return;
    }
    this.setState({ isOpen: false });
  };

  handleDocumentKeyUp = (event: KeyboardEvent) => {
    // ESC key
    if (event.keyCode === 27) {
      this.setState({ isOpen: false });
    }
  };

  handleItemSelection = (value: Moment) => () => {
    const { onChange } = this.props;
    onChange(value);
    this.toggleMenu();
  };

  assignRef = (node: HTMLElement | null) => {
    this.picker = node;
  };

  toggleMenu = () => {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen,
    }));
  };

  renderListItems() {
    const { minTime } = this.props;

    const items: React.ReactNode[] = [];
    const firstListItem = minTime.clone();
    const lastListItem = moment().endOf('day');

    do {
      const label = formatDateTimeDisplay(firstListItem, TIME_ONLY_DISPLAY_NO_TZ);
      const item = (
        <DropDown.Item
          onClick={this.handleItemSelection(firstListItem.clone())}
          rootClassName="dropdown-item"
          key={firstListItem.unix()}
          label={label}
        />
      );

      items.push(item);

      firstListItem.add(30, 'minutes');
    } while (firstListItem.isBefore(lastListItem));

    return items;
  }

  render() {
    const { currentTime } = this.props;
    const { isOpen } = this.state;

    const displayTime = formatDateTimeDisplay(currentTime, TIME_ONLY_DISPLAY_NO_TZ);

    return (
      <div ref={this.assignRef} className="rc-GoalSettingSetScheduleTimePicker">
        <button type="button" className={classNames('picker', { opened: isOpen })} onClick={this.toggleMenu}>
          {displayTime}
        </button>
        {isOpen && (
          <div className="dropdown">
            <DropDown.List maxHeight={175} rootClassName="dropdown-list" showBorder={true} borderColor="#bdbdbd">
              {this.renderListItems()}
            </DropDown.List>
          </div>
        )}
      </div>
    );
  }
}

export default GoalSettingSetScheduleTimePicker;
