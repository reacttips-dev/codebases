import PropTypes from 'prop-types';
import styles from './text-input-widget.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'atoms/quiz-widgets/text-input-widget';

    static propTypes = {
      value: PropTypes.string,
      marker: PropTypes.string,
      is_text_area: PropTypes.bool,
      onChange: PropTypes.func,
    };

    static defaultProps = {
      value: '',
      marker: null,
      is_text_area: false,
      onChange: _.noop,
    };

    handleChange = (evt) => {
      this.props.onChange(evt.target.value);
    };

    render() {
      var { value, marker, is_text_area, label } = this.props;
      var id = 'text-' + marker;
      var attrs = {
        style: { width: '100%', height: '100%' },
        name: marker,
        value,
        onChange: this.handleChange,
      };

      if (is_text_area) {
        return (
          <div styleName="container">
            <label htmlFor={id} styleName="label">
              {label}
            </label>
            <textarea {...attrs} styleName="textarea" id={id} />
          </div>
        );
      } else {
        return (
          <span styleName="container">
            <label htmlFor={id} styleName="label">
              {label}
            </label>
            <input {...attrs} styleName="text-input" type="text" id={id} />
          </span>
        );
      }
    }
  },
  styles
);
