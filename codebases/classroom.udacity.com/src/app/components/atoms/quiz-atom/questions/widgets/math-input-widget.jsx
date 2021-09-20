/* global MathQuill */
if (!window.jQuery) {
  window.jQuery = require('jquery');
}

// This loads it into window.MathQuill, it's not a great library :(
// It also must come after the jquery load as it relies on that being there.
require('mathquill/build/mathquill');

import PropTypes from 'prop-types';
import styles from './math-input-widget.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'atoms/quiz-widgets/math-input-widget';

    static propTypes = {
      value: PropTypes.string,
      marker: PropTypes.string,
      onChange: PropTypes.func,
    };

    static defaultProps = {
      value: null,
      marker: null,
      onChange: _.noop,
    };

    componentDidMount() {
      const MQ = MathQuill.getInterface(2);
      const mathquillElement = document.getElementById(
        this.mathquillElementId()
      );
      // eslint-disable-next-line new-cap
      const mathquillField = MQ.MathField(mathquillElement, {
        handlers: {
          edit: () => {
            const text = mathquillField.latex(); // This call both draws it on screen, and returns it.
            this.props.onChange(text);
          },
        },
      });

      const { value } = this.props;
      if (!_.isEmpty(value)) {
        mathquillField.latex(value);
      }
    }

    mathquillElementId = () => {
      const { marker } = this.props;
      return 'math-input-widget-' + marker;
    };

    render() {
      const { label } = this.props;
      const style = { width: '100%', height: '100%' };

      // MathQuill needs to take over ownership of this span and manipulate as needed, hence the use of dangerouslySetInnerHTML
      const innerHtml = {
        __html: `<span id='${this.mathquillElementId()}' style='width:100%;height:100%'></span>`,
      };

      return (
        <span style={style}>
          <label htmlFor={this.mathquillElementId()} styleName="label">
            {label}
          </label>
          <span dangerouslySetInnerHTML={innerHtml} />
        </span>
      );
    }
  },
  styles
);
