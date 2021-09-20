import { IconMenu } from '@udacity/veritas-icons';
import PropTypes from 'prop-types';
import { RoundButton } from '@udacity/veritas-components';
import { __ } from 'services/localization-service';
import classnames from 'classnames';
import styles from './hamburger.scss';
import withAppLayoutContext from 'decorators/with-app-layout-context';
class Hamburger extends React.Component {
  static displayName = 'common/hamburger';

  static propTypes = {
    alwaysVisible: PropTypes.bool,
    className: PropTypes.string,
    // App Layout Context
    isMobile: PropTypes.bool.isRequired,
    isSidebarOpen: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
  };

  static defaultProps = {
    alwaysVisible: false,
  };

  handleToggle = (evt) => {
    evt.preventDefault();
    evt.currentTarget.blur();
    this.props.toggleSidebar();
  };

  render() {
    const { alwaysVisible, className, isMobile, isSidebarOpen } = this.props;
    return (
      (alwaysVisible || isMobile || !isSidebarOpen) && (
        <div className={classnames(styles['hamburger'], className)}>
          <RoundButton
            onClick={this.handleToggle}
            icon={
              <IconMenu
                color="cerulean"
                size="md"
                title={__('Toggle Sidebar')}
              />
            }
            variant="minimal-inverse"
          />
        </div>
      )
    );
  }
}

export default withAppLayoutContext(Hamburger);
