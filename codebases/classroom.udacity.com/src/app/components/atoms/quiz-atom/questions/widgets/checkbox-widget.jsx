import PropTypes from 'prop-types';
import styles from './checkbox-widget.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'atoms/quiz-widgets/checkbox-widget';

    static propTypes = {
      value: PropTypes.bool,
      marker: PropTypes.string,
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
      var { value, marker, label } = this.props;

      return (
        <span>
          <label htmlFor={'checkbox-' + marker} styleName="label">
            {label}
          </label>
          <input
            styleName="checkbox"
            type="checkbox"
            name={marker}
            id={'checkbox-' + marker}
            checked={value}
            onChange={this.handleChange}
          />
        </span>
      );
    }
  },
  styles
);
