import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CarouselItem from './CarouselItem';
import CarouselControl from './CarouselControl';
import CarouselIndicators from './CarouselIndicators';

class Carousel extends React.Component {
  constructor (props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.renderItems = this.renderItems.bind(this);
    this.hoverStart = this.hoverStart.bind(this);
    this.hoverEnd = this.hoverEnd.bind(this);
    this.state = {
      direction: 'right',
      indicatorClicked: false
    };
  }

  getChildContext () {
    return { direction: this.state.direction };
  }

  componentDidMount () {
    // Set up the cycle
    if (this.props.ride === 'carousel') {
      this.setInterval();
    }

    document.addEventListener('keyup', this.handleKeyPress);
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setInterval(nextProps);

    // Calculate the direction to turn
    if (this.props.activeIndex + 1 === nextProps.activeIndex) {
      this.setState({ direction: 'right' });
    } else if (this.props.activeIndex - 1 === nextProps.activeIndex) {
      this.setState({ direction: 'left' });
    } else if (this.props.activeIndex > nextProps.activeIndex) {
      this.setState({ direction: this.state.indicatorClicked ? 'left' : 'right' });
    } else if (this.props.activeIndex !== nextProps.activeIndex) {
      this.setState({ direction: this.state.indicatorClicked ? 'right' : 'left' });
    }
    this.setState({ indicatorClicked: false });
  }

  componentWillUnmount () {
    this.clearInterval();
    document.removeEventListener('keyup', this.handleKeyPress);
  }

  setInterval (props = this.props) {
    // make sure not to have multiple intervals going...
    this.clearInterval();
    if (props.interval) {
      this.cycleInterval = setInterval(() => {
        props.next();
      }, parseInt(props.interval, 10));
    }
  }

  clearInterval () {
    clearInterval(this.cycleInterval);
  }

  hoverStart (...args) {
    if (this.props.pause === 'hover') {
      this.clearInterval();
    }
    if (this.props.mouseEnter) {
      this.props.mouseEnter(...args);
    }
  }

  hoverEnd (...args) {
    if (this.props.pause === 'hover') {
      this.setInterval();
    }
    if (this.props.mouseLeave) {
      this.props.mouseLeave(...args);
    }
  }

  handleKeyPress (evt) {
    if (this.props.keyboard) {
      if (evt.keyCode === 37) {
        this.props.previous();
      } else if (evt.keyCode === 39) {
        this.props.next();
      }
    }
  }

  renderItems (carouselItems, className) {
    const { slide } = this.props;
    return (
      <div role='listbox' className={className}>
        {
          React.Children.map(carouselItems, (item, index) => {
            const isIn = (index === this.props.activeIndex);
            return React.cloneElement(item, {
              in: isIn,
              slide: slide
            });
          })
        }
      </div>
    );
  }

  renderIndicators (indicators) {
    const wrappedOnClick = (e) => {
      if (typeof indicators.props.onClickHandler === 'function') {
        this.setState({ indicatorClicked: true }, () => indicators.props.onClickHandler(e));
      }
    };
    return React.cloneElement(indicators, { onClickHandler: wrappedOnClick });
  }

  render () {
    const { slide, className } = this.props;
    const outerClasses = classNames(
      className,
      'carousel',
      slide && 'slide'
    );

    const innerClasses = classNames(
      'carousel-inner'
    );

    let carouselItems = [],
      controlLeft = null,
      controlRight = null,
      indicators = null;

    React.Children.forEach(this.props.children, (child) => {
      switch (child.type) {
        case CarouselItem: carouselItems.push(child); break;
        case CarouselControl:
          child.props.direction === 'prev' ? controlLeft = child : controlRight = child;
          break;
        case CarouselIndicators: indicators = child; break;
      }
    });

    return (
      <div className={outerClasses} onMouseEnter={this.hoverStart} onMouseLeave={this.hoverEnd}>
        {indicators && this.renderIndicators(indicators)}
        {!_.isEmpty(carouselItems) && this.renderItems(carouselItems, innerClasses)}
        {controlLeft}
        {controlRight}
    </div>
    );
  }
}

Carousel.propTypes = {
  // the current active slide of the carousel
  activeIndex: PropTypes.number,

  // a function which should advance the carousel to the next slide (via activeIndex)
  next: PropTypes.func.isRequired,

  // a function which should advance the carousel to the previous slide (via activeIndex)
  previous: PropTypes.func.isRequired,

  // controls if the left and right arrow keys should control the carousel
  keyboard: PropTypes.bool,

  /* If set to "hover", pauses the cycling of the carousel on mouseenter and resumes the cycling of the carousel on
   * mouseleave. If set to false, hovering over the carousel won't pause it. (default: "hover")
   */
  pause: PropTypes.oneOf(['hover', false]),

  // Autoplays the carousel after the user manually cycles the first item. If "carousel", autoplays the carousel on load.
  // This is how bootstrap defines it... I would prefer a bool named autoplay or something...
  ride: PropTypes.oneOf(['carousel']),

  // the interval at which the carousel automatically cycles (default: 5000)
  // eslint-disable-next-line react/no-unused-prop-types
  interval: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool
  ]),
  children: PropTypes.array,

  // called when the mouse enters the Carousel
  mouseEnter: PropTypes.func,

  // called when the mouse exits the Carousel
  mouseLeave: PropTypes.func,

  // controls whether the slide animation on the Carousel works or not
  slide: PropTypes.bool,
  className: PropTypes.string
};

Carousel.defaultProps = {
  interval: 5000,
  pause: 'hover',
  keyboard: true,
  slide: true
};

Carousel.childContextTypes = {
  direction: PropTypes.string
};

export default Carousel;
