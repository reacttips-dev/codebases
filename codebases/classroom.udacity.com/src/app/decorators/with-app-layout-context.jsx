import { LayoutConsumer } from '@udacity/ureact-app-layout';
import { getDisplayName } from 'helpers/decorator-helpers.js';

export default function withAppLayoutContext(WrappedComponent) {
  const WithAppLayoutContext = (props) => {
    return (
      <LayoutConsumer>
        {(layoutContext) => {
          return <WrappedComponent {...props} {...layoutContext} />;
        }}
      </LayoutConsumer>
    );
  };
  WithAppLayoutContext.displayName = `WithAppLayoutContext(${getDisplayName(
    WrappedComponent
  )})`;
  WithAppLayoutContext.WrappedComponent = WrappedComponent;
  return WithAppLayoutContext;
}
