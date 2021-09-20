import Buttons from './_buttons';
import EvaluationsService from 'services/evaluations-service';
import PropTypes from 'prop-types';
import QuestionStaticPlaceholder from './question-static-placeholder';
import StaticContentPlaceholder from 'components/common/static-content-placeholder';
import WidgetContainer from './widgets/widget-container';
import { __ } from 'services/localization-service';
import keycode from 'keycode';
import styles from './image-form-question.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'atoms/quiz-atom/questions/image-form-question';

    static propTypes = {
      evaluationId: PropTypes.string.isRequired,
      nodeKey: PropTypes.string.isRequired,
      nodeId: PropTypes.number.isRequired,
      backgroundImage: PropTypes.string.isRequired,
      widgets: PropTypes.array,
      altText: PropTypes.string,
      unstructuredData: PropTypes.object,
      onSave: PropTypes.func,
      onResult: PropTypes.func,
      onViewAnswer: PropTypes.func,
    };

    static contextTypes = {
      root: PropTypes.object.isRequired,
    };

    static defaultProps = {
      widgets: [],
      unstructuredData: {},
      onSave: _.noop,
      onResult: _.noop,
      onViewAnswer: null,
    };

    state = {
      value: {},
    };

    componentDidMount() {
      const widgetMap = _.keyBy(this.props.widgets, 'marker');
      const initialFormData = _.mapValues(widgetMap, (widget) => {
        if (
          widget.model === 'CheckboxWidget' ||
          widget.model === 'RadioButtonWidget'
        ) {
          return widget.initial_value === 'true';
        }
        return widget.initial_value;
      });

      this.setState({
        value: { ...initialFormData, ...this.props.unstructuredData },
      });
    }

    handleWidgetChange = (widget, nextWidgetValue) => {
      if (widget.model === 'RadioButtonWidget') {
        this.setState(({ value: prevValue }) => ({
          value: {
            ...prevValue,
            ..._.chain(this.props.widgets)
              .filter({ group: widget.group })
              .keyBy('marker')
              .mapValues(_.constant(false))
              .value(),
            [widget.marker]: nextWidgetValue,
          },
        }));
      } else {
        this.setState(({ value: prevValue }) => ({
          value: {
            ...prevValue,
            [widget.marker]: nextWidgetValue,
          },
        }));
      }
    };

    handleKeyPress = (evt) => {
      // on enter, submit the quiz as long as the enter wasn't from a textarea
      if (keycode(evt) === 'enter' && evt.target.tagName !== 'TEXTAREA') {
        evt.preventDefault();
        this.handleSubmit();
      }
    };

    handleSubmit = () => {
      this.props.onSave(this.state.value);

      return EvaluationsService.grade({
        evaluationId: this.props.evaluationId,
        parts: this.state.value,
        atomKey: this.props.nodeKey,
        atomId: this.props.nodeId,
        rootKey: this.context.root.key,
        rootId: this.context.root.id,
      }).then((evaluation) => this.props.onResult(evaluation));
    };

    _renderForm() {
      const { backgroundImage, widgets, altText } = this.props;

      return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <form onKeyPress={this.handleKeyPress}>
          <div styleName="image-container" style={{ position: 'relative' }}>
            <img
              style={{ width: '100%', maxHeight: '100%' }}
              src={backgroundImage}
              alt={altText}
            />
            {_.map(widgets, (widget, idx) => (
              <WidgetContainer
                key={idx}
                value={this.state.value[widget.marker]}
                onChange={(nextWidgetValue) =>
                  this.handleWidgetChange(widget, nextWidgetValue)
                }
                {...widget}
              />
            ))}
          </div>
        </form>
      );
    }

    render() {
      const { onViewAnswer } = this.props;
      return (
        <StaticContentPlaceholder
          placeholder={
            <QuestionStaticPlaceholder
              atomName={__('quiz')}
              onViewAnswer={onViewAnswer}
            />
          }
        >
          <div className="clearfix">
            {this._renderForm()}
            <Buttons onSubmit={this.handleSubmit} onViewAnswer={onViewAnswer} />
          </div>
        </StaticContentPlaceholder>
      );
    }
  },
  styles
);
