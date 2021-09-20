import { LayoutConsumer } from '@udacity/ureact-app-layout';
import { getDisplayName } from 'helpers/decorator-helpers.js';

export default function withHeaderCollapsed(WrappedComponent) {
  class WithHeaderCollapsed extends React.Component {
    static propTypes = _.omit(WrappedComponent.propTypes, 'isHeaderCollapsed');

    render() {
      return (
        <LayoutConsumer>
          {({ isContentScrolled, isShortBrowser }) => (
            <WrappedComponent
              isHeaderCollapsed={isContentScrolled || isShortBrowser}
              {...this.props}
            />
          )}
        </LayoutConsumer>
      );
    }
  }

  WithHeaderCollapsed.displayName = `WithHeaderCollapsed(${getDisplayName(
    WrappedComponent
  )})`;
  WithHeaderCollapsed.WrappedComponent = WrappedComponent;
  return WithHeaderCollapsed;
}
