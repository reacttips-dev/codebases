import PropTypes from 'prop-types';
import StyleHelper from 'helpers/style-helper';
import Widgets from './index';

export default class extends React.Component {
  static displayName = 'atoms/quiz-atom/questions/widgets/widget-container';

  static propTypes = {
    model: PropTypes.oneOf(_.keys(Widgets)).isRequired,
    placement: PropTypes.object.isRequired,
    onChange: PropTypes.func,
    value: PropTypes.any,
  };

  render() {
    var {
      model,
      placement: { x, y, width, height },
    } = this.props;

    // handles cases where we don't have support for the given widget type
    var Widget = Widgets[model] || Widgets['TextInputWidget'];

    var style = {
      top: StyleHelper.toP(y),
      left: StyleHelper.toP(x),
      position: 'absolute',
      width: StyleHelper.toP(width),
      height: StyleHelper.toP(height),
    };

    if (model === 'RadioButtonWidget' || model === 'CheckboxWidget') {
      style.maxWidth = '15px';
      style.maxHeight = '15px';
    }

    return (
      <div style={style}>
        <Widget {...this.props} />
      </div>
    );
  }
}
