import Progress from './_progress';
import PropTypes from 'prop-types';
import { SlidesProvider } from './_context';
import classNames from 'classnames';
import styles from './_slides.scss';

class Slides extends React.Component {
  static displayName = 'onboarding/slides/_slides';
  static propTypes = {
    title: PropTypes.node,
    children: PropTypes.node,
    onFinish: PropTypes.func,
    onEnterSlide: PropTypes.func,
    stylePrefix: PropTypes.string,
  };

  static defaultProps = {
    onFinish: _.noop,
    onEnterSlide: _.noop,
    title: null,
    children: null,
    stylePrefix: '',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const slideCount = React.Children.count(_.compact(nextProps.children));
    if (slideCount !== prevState.slideCount) {
      return {
        slideCount,
        // handle removal of children, could identify removed child, but that gets tricky
        slideIndex: Math.min(prevState.slideIndex, slideCount - 1),
        onEnterSlide: nextProps.onEnterSlide || _.noop,
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    // use constructor to add member functions to state
    this.state = {
      prevSlide: this.prevSlide,
      nextSlide: this.nextSlide,
      slideIndex: 0,
    };
  }

  prevSlide = () => {
    this.setState(({ slideIndex }) => {
      return {
        slideIndex: Math.max(slideIndex - 1, 0),
      };
    });
  };

  nextSlide = () => {
    if (this.state.slideIndex === this.state.slideCount - 1) {
      return this.props.onFinish();
    } else {
      this.setState(({ slideIndex, slideCount }) => {
        return {
          slideIndex: Math.min(slideIndex + 1, slideCount - 1),
        };
      });
    }
  };

  _renderSlide() {
    return React.Children.toArray(this.props.children)[this.state.slideIndex];
  }

  render() {
    const { title, stylePrefix } = this.props;
    return (
      <SlidesProvider value={this.state}>
        <div styleName={classNames('slides', stylePrefix)}>
          <div>
            <h4 styleName={'title'}>{title}</h4>
            <Progress />
          </div>
          {this._renderSlide()}
        </div>
      </SlidesProvider>
    );
  }
}

export default cssModule(Slides, styles, { allowMultiple: true });
