import { AtomFeedbackConsumer } from './atom-feedback-context';
import createReactClass from 'create-react-class';
import { getDisplayName } from 'helpers/decorator-helpers.js';

export default function withFeedbackContext(WrappedComponent) {
  const withFeedbackContext = createReactClass({
    displayName: `withFeedbackContext(${getDisplayName(WrappedComponent)})`,

    render() {
      return (
        <AtomFeedbackConsumer>
          {(feedbackContext) => (
            <WrappedComponent {...this.props} {...feedbackContext} />
          )}
        </AtomFeedbackConsumer>
      );
    },
  });

  withFeedbackContext.WrappedComponent = WrappedComponent;
  return withFeedbackContext;
}
