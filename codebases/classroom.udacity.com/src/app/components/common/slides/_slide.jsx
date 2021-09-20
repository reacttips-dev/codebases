import PropTypes from 'prop-types';
import { SlidesConsumer } from './_context';
import styles from './_slide.scss';

export const Body = cssModule(
  ({ children, className }) => {
    return (
      <div styleName="body" className={className}>
        {children}
      </div>
    );
  },
  styles,
  { errorWhenNotFound: false }
);

Body.displayName = 'onboarding/slides/_slide/body';

export const Footer = cssModule(
  ({ children, className }) => {
    return (
      <div styleName="footer" className={className}>
        {children}
      </div>
    );
  },
  styles,
  { errorWhenNotFound: false }
);

Footer.displayName = 'onboarding/slides/_slide/footer';

Body.propTypes = Footer.propTypes = {
  children: PropTypes.node,
};

@cssModule(styles)
class InnerSlide extends React.Component {
  static displayName = 'onboarding/slides/_slide/inner-slide';
  static propTypes = {
    onEnterSlide: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    children: PropTypes.node,
  };

  componentDidMount() {
    const { onEnterSlide, name } = this.props;
    onEnterSlide(name);
  }

  render() {
    const { children } = this.props;
    return <div styleName="slide">{children}</div>;
  }
}

export const Slide = ({ children, name = 'Slide' }) => (
  <SlidesConsumer>
    {({ onEnterSlide }) => (
      <InnerSlide onEnterSlide={onEnterSlide} name={name}>
        {children}
      </InnerSlide>
    )}
  </SlidesConsumer>
);

Slide.displayName = 'onboarding/slides/_slide';
Slide.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
};

export default Slide;
