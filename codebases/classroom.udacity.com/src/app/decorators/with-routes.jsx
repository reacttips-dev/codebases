import PropTypes from 'prop-types';
import RouteHelper from 'helpers/route-helper';
import { getDisplayName } from 'helpers/decorator-helpers';
import { hoistStatics } from 'recompose';
import invariant from 'invariant';

// Replacement for Routes Mixin
/*
 * Example Usage.
 *
 * import withRoutes from 'decorators/with-routes';
 *
 * @withRoutes('partPath', 'nanodegreePath')
 * class Foo extends React.Component {
 *   render() {
 *     <a href={this.props.partPath()} />
 *   }
 * }
 *
 * Passes down
 * - ...pathFunctions: func
 */

//  combined course and nanodegree keys, since they won't overlap at all anyways
const PARAM_HIERARCHY = [
  'nanodegreeKey',
  'partKey',
  'moduleKey',
  'courseKey',
  'lessonKey',
  'conceptKey',
];

function withRoutes(WrappedComponent, pathFunctionNames) {
  invariant(
    _.every(pathFunctionNames, _.partial(_.has, RouteHelper)),
    `One of ${pathFunctionNames} is not found in RouteHelpers`
  );
  const pathFunctions = _.pick(RouteHelper, pathFunctionNames);

  class WithRoutes extends React.Component {
    static displayName = `WithRoutes(${getDisplayName(WrappedComponent)})`;

    static contextTypes = {
      params: PropTypes.objectOf(PropTypes.string),
    };

    // Strip out any keys that are lower in the hierarchy than any provided keys
    // e.g. if we provide a partKey, then a conceptKey in context wouldn't be valid
    getContextParams(providedParams) {
      const { params } = this.context;
      const topProvidedParamPosition = _.chain(providedParams)
        .keys()
        .map(_.partial(_.indexOf, PARAM_HIERARCHY))
        .without(-1)
        .min()
        .value();

      if (_.isNumber(topProvidedParamPosition)) {
        return _.omit(params, PARAM_HIERARCHY.slice(topProvidedParamPosition));
      } else {
        return params;
      }
    }

    getParams(providedParams) {
      return {
        ...this.getContextParams(providedParams),
        ...providedParams,
      };
    }

    // Wrap all the selected path functions in local context
    pathFunctions = _.mapValues(
      pathFunctions,
      (pathFunction) => (providedParams) => {
        return pathFunction(this.getParams(providedParams));
      }
    );

    render() {
      return <WrappedComponent {...this.props} {...this.pathFunctions} />;
    }
  }

  WithRoutes.WrappedComponent = WrappedComponent;
  return WithRoutes;
}

export default (...pathFunctionNames) =>
  hoistStatics((WrappedComponent) =>
    withRoutes(WrappedComponent, pathFunctionNames)
  );
