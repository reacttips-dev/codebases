import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import 'css!./__styles__/CourseRatingIcons';

class CourseRatingIcons extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func,
    readOnly: PropTypes.bool,
    value: PropTypes.number.isRequired,
    size: PropTypes.oneOf(['small', 'large']),
  };

  static defaultProps = {
    size: 'small',
    readOnly: true,
  };

  state = {
    highlightValue: -1,
  };

  handleMouseLeave = () => {
    this.setState({
      highlightValue: -1,
    });
  };

  handleMouseOver(value: $TSFixMe) {
    this.setState({
      highlightValue: value,
    });
  }

  handleSelect(value: $TSFixMe) {
    this.setState({
      highlightValue: -1,
    });

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'onSelect' does not exist on type 'Readon... Remove this comment to see the full error message
    if (this.props.onSelect) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onSelect' does not exist on type 'Readon... Remove this comment to see the full error message
      this.props.onSelect(value);
    }
  }

  /**
   * Get distribution of rating based on the value
   * @param  {number} value Rating Value between 0 and 5
   * @return {array} e.g. [{value: 0, selected: true}, ...]
   */
  static getRatingDistribution = function (value: $TSFixMe) {
    let i = 0.5;
    const ratings = [];

    let roundedValue = Math.round(value * 2) / 2;

    if (value !== 5) {
      roundedValue = Math.min(roundedValue, 4.5);
    }

    while (i <= roundedValue) {
      const isHalf = i % 1 !== 0;

      if (!isHalf) {
        ratings.push({
          // @ts-ignore ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'never'.
          value: i,
          // @ts-ignore ts-migrate(2322) FIXME: Type 'boolean' is not assignable to type 'never'.
          selected: true,
        });

        i += 0.5;
      } else if (i + 0.5 > roundedValue) {
        ratings.push({
          // @ts-ignore ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'never'.
          value: i,
          // @ts-ignore ts-migrate(2322) FIXME: Type 'boolean' is not assignable to type 'never'.
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
        // @ts-ignore ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'never'.
        value: i,
        // @ts-ignore ts-migrate(2322) FIXME: Type 'boolean' is not assignable to type 'never'.
        selected: false,
      });

      i += 1;
    }

    return ratings;
  };

  renderIcon(value: $TSFixMe, selected: $TSFixMe) {
    const highlighted = value <= this.state.highlightValue;
    const anyHighlight = this.state.highlightValue > -1;
    const isHalf = value % 1 !== 0;

    const classes = classNames('c-course-rating-icon', 'cif-icon', {
      'cif-star': highlighted || (selected && !anyHighlight && !isHalf),
      'cif-star-half-empty': !highlighted && selected && !anyHighlight && isHalf,
      'cif-star-o': !highlighted && (!selected || anyHighlight),
      highlight: highlighted,
    });

    return (
      <i
        key={value}
        className={classes}
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'false | (() => void)' is not assignable to t... Remove this comment to see the full error message
        onMouseOver={!this.props.readOnly && (() => this.handleMouseOver(value))}
        onClick={() => this.handleSelect(value)}
        aria-hidden="true"
      />
    );
  }

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'size' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const classes = classNames('rc-CourseRatingIcons', this.props.size, {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'readOnly' does not exist on type 'Readon... Remove this comment to see the full error message
      'read-only': this.props.readOnly,
    });

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'value' does not exist on type 'Readonly<... Remove this comment to see the full error message
    const ratings = CourseRatingIcons.getRatingDistribution(this.props.value);

    return (
      <div className={classes} onMouseLeave={this.handleMouseLeave} data-e2e="course-rating">
        {ratings.map(({ value, selected }) => this.renderIcon(value, selected))}
      </div>
    );
  }
}

export default CourseRatingIcons;
