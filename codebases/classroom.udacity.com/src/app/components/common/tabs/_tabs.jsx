import { THEMES, ThemeType } from 'constants/theme';

import PropTypes from 'prop-types';
import styles from './_tabs.scss';

@cssModule(styles)
export default class Tabs extends React.Component {
  static displayName = 'common/tabs';

  static propTypes = {
    selectedTabId: PropTypes.string,
    children: PropTypes.node,
    theme: ThemeType,
  };

  static defaultProps = {
    selectedTabId: '',
    theme: THEMES.LIGHT,
  };

  state = {
    mobileOpen: false,
  };

  handleTabClick = (id, evt) => {
    const { selectedTabId } = this.props;
    const currentTab = id === selectedTabId;

    // If tab is active, do not change page, instead toggle state.mobileOpen
    if (currentTab) {
      evt.preventDefault();
      this.setState(({ mobileOpen }) => ({ mobileOpen: !mobileOpen }));
    }
  };

  render() {
    const { children, selectedTabId, theme = THEMES.LIGHT } = this.props;
    const { mobileOpen } = this.state;
    return (
      <div styleName={`container-${theme}`}>
        <ol styleName={mobileOpen ? 'tabs-mobile-open' : 'tabs-mobile-closed'}>
          {React.Children.map(
            children,
            (child) =>
              child &&
              React.cloneElement(child, {
                isSelected: child.props.id === selectedTabId,
                onClick: this.handleTabClick,
              })
          )}
        </ol>
      </div>
    );
  }
}
