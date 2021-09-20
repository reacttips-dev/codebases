import AnalyticsMixin from 'mixins/analytics-mixin';
import createReactClass from 'create-react-class';
import { getDisplayName } from 'helpers/decorator-helpers.js';

/*
 * Example Usage.
 *
 * import withAnalytics from 'decorators/analytics';
 *
 * @withAnalytics
 * class Foo extends React.Component {
 *   render() {
 *     this.props.track('Foo')
 *     //...
 *   }
 * }
 *
 * Passes down
 * - track: func
 */
export default function withAnalytics(WrappedComponent) {
  const WithAnalytics = createReactClass({
    displayName: `WithAnalytics(${getDisplayName(WrappedComponent)})`,

    mixins: [AnalyticsMixin],

    render() {
      return (
        <WrappedComponent
          {...this.props}
          track={this.track}
          trackVideoSeen={this.trackVideoSeen}
          getBaseInfo={this._getBaseInfo}
        />
      );
    },
  });

  WithAnalytics.WrappedComponent = WrappedComponent;
  return WithAnalytics;
}
