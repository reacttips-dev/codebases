import PropTypes from 'prop-types';
import styles from './radio-button-widget.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'atoms/quiz-widgets/radio-button-widget';

    static propTypes = {
      value: PropTypes.bool,
      marker: PropTypes.string,
      group: PropTypes.string,
      onChange: PropTypes.func,
    };

    static defaultProps = {
      value: false,
      onChange: _.noop,
    };

    handleChange = (evt) => {
      this.props.onChange(evt.target.checked);
    };

    render() {
      const { group, marker, label, value } = this.props;

      return (
        <span>
          <label htmlFor={'radio-' + marker} styleName="label">
            {label}
          </label>
          <input
            styleName="radio"
            type="radio"
            name={group}
            value={marker}
            id={'radio-' + marker}
            checked={value}
            onChange={this.handleChange}
          />
        </span>
      );
    }
  },
  styles
);
