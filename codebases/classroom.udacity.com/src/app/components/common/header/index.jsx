/**
 * Renders the top header
 */
import { Flex } from '@udacity/veritas-components';
import Hamburger from 'components/common/hamburger';
import PropTypes from 'prop-types';
import styles from './index.scss';

@cssModule(styles)
export default class Header extends React.Component {
  static displayName = 'common/header';

  static propTypes = {
    theme: PropTypes.oneOf(['light', 'dark', 'big']),
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
    hamburgerAlwaysVisible: PropTypes.bool,
    justify: PropTypes.string,
  };

  static defaultProps = {
    justify: 'start',
    theme: 'light',
    children: null,
    hamburgerAlwaysVisible: false,
  };

  _renderTitle() {
    const { title } = this.props;

    return (
      <h1 id="header-title" aria-live="assertive">
        {title}
      </h1>
    );
  }

  _themeToStyle(theme) {
    if (theme === 'big') {
      return 'big-header';
    } else if (theme === 'light') {
      return 'light-header';
    }
    return 'dark-header';
  }

  render() {
    const { theme, children, justify, hamburgerAlwaysVisible } = this.props;
    const shouldRenderChildrenInside = theme !== 'big';
    const styleName = this._themeToStyle(theme);

    return (
      <nav styleName={styleName} aria-label="inner-nav">
        <Flex justify={justify} align="center" full>
          <Hamburger
            alwaysVisible={hamburgerAlwaysVisible}
            styleName="hamburger"
          />
          {this._renderTitle()}
          {/* Span that will enable the title to remain in the center */}
          {(shouldRenderChildrenInside && children) || <span />}
        </Flex>
        {!shouldRenderChildrenInside && children}
      </nav>
    );
  }
}
