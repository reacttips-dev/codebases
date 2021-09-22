import classNames from 'classnames';

import React from 'react';
import 'css!./__styles__/CourseRatingIcons';
import _t from 'i18n!nls/content-feedback';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

type Size = 'small' | 'large';

type Rating = {
  selected: boolean;
  value: number;
};

type Props = {
  value: number;
  radioName: string;
  onSelect?: (value: number) => void;
  readOnly?: boolean;
  size?: Size;
};

type State = {
  highlightValue: number;
  focusValue: number;
};

class CourseRatingIconsAccessible extends React.Component<Props, State> {
  static defaultProps = {
    size: 'small',
    readOnly: true,
  };

  state = {
    highlightValue: -1,
    focusValue: -1,
  };

  handleMouseLeave = () => {
    this.setState(() => ({
      highlightValue: -1,
    }));
  };

  handleMouseOver(value: number) {
    this.setState(() => ({
      highlightValue: value,
    }));
  }

  handleFocus(value: number) {
    this.setState(() => ({ focusValue: value }));
  }

  handleSelect(value: number) {
    this.setState(() => ({
      highlightValue: -1,
    }));

    if (this.props.onSelect) {
      this.props.onSelect(value);
    }
  }

  /**
   * Get distribution of rating based on the value
   * @param  {number} value Rating Value between 0 and 5
   * @return {array} e.g. [{value: 0, selected: true}, ...]
   */
  // TODO: Use a stricter type to represent 'Rating' than number.
  static getRatingDistribution = function (value: number): Array<Rating> {
    let i = 0.5;

    const ratings: Array<{
      value: number;
      selected: boolean;
    }> = [];

    let roundedValue = Math.round(value * 2) / 2;

    if (value !== 5) {
      roundedValue = Math.min(roundedValue, 4.5);
    }

    while (i <= roundedValue) {
      const isHalf = i % 1 !== 0;

      if (!isHalf) {
        ratings.push({
          value: i,
          selected: true,
        });

        i += 0.5;
      } else if (i + 0.5 > roundedValue) {
        ratings.push({
          value: i,
          selected: true,
        });

        i += 1;
      } else {
        i += 0.5;
      }
    }

    if (i % 1 !== 0) {
      i += 0.5;
    }

    while (i <= 5) {
      ratings.push({
        value: i,
        selected: false,
      });

      i += 1;
    }
    return ratings;
  };

  renderIcon(value: number, selected: boolean) {
    const { readOnly, radioName } = this.props;
    const { highlightValue, focusValue } = this.state;
    const highlighted = value <= highlightValue;
    const focused = typeof value !== 'undefined' && value === focusValue;
    const anyHighlight = highlightValue > -1;
    const isHalf = value % 1 !== 0;

    const classes = classNames('c-course-rating-icon', {
      'cif-star': highlighted || (selected && !anyHighlight && !isHalf),
      'cif-star-half-empty': !highlighted && selected && !anyHighlight && isHalf,
      'cif-star-o': !highlighted && (!selected || anyHighlight),
      highlight: highlighted,
      focused,
    });

    const checked = value === this.props.value;
    const tabIndex = checked ? 0 : -1;

    const inputProps = {
      type: 'radio',
      name: radioName,
      className: 'sr-only',
      onChange: () => this.handleSelect(value),
      onFocus: () => this.handleFocus(value),
      onBlur: () => this.handleFocus(-1),
      value,
      checked,
      tabIndex,
    };

    return (
      <label className={classes} onMouseOver={!readOnly ? () => this.handleMouseOver(value) : undefined} key={value}>
        <input {...inputProps} />
        <span className="sr-only">
          <FormattedMessage message={_t('{stars} {stars, plural, one {Star} other {Stars}}')} stars={value} />
        </span>
      </label>
    );
  }

  renderUnselected(ratings: Array<Rating>) {
    // if not any of the ratings are already selected, select the "unselected" option
    const selected = !ratings.map((rating) => rating.selected).some((rating) => !!rating);
    const { radioName } = this.props;
    const tabIndex = selected ? 0 : -1;
    return (
      <label className="sr-only">
        <input
          type="radio"
          value="0"
          name={radioName}
          onChange={() => this.handleSelect(0)}
          onFocus={() => this.handleFocus(0)}
          onBlur={() => this.handleFocus(-1)}
          checked={selected}
          tabIndex={tabIndex}
        />
        <span className="sr-only">{_t('Unselect rating')}</span>
      </label>
    );
  }

  render() {
    const { readOnly, value } = this.props;
    const { focusValue } = this.state;
    const classes = classNames('rc-CourseRatingIcons rc-CourseRatingIconsAccessible', this.props.size, {
      'read-only': readOnly,
      focused: focusValue === 0,
    });

    const ratings = CourseRatingIconsAccessible.getRatingDistribution(value);

    return (
      <div className={classes} onMouseLeave={this.handleMouseLeave}>
        {this.renderUnselected(ratings)}
        {ratings.map((rating) => this.renderIcon(rating.value, rating.selected))}
      </div>
    );
  }
}

export default CourseRatingIconsAccessible;
