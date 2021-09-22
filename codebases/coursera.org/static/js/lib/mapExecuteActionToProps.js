/**
 * mapExecuteActionToProps
 *
 * Example:
 * const EnrollmentManager extends React.Component {
 *   static propTypes = {
 *     courseId: React.PropTypes.string.isRequired,
 *     handleEnroll: React.PropTypes.func,
 *     handleUnenroll: React.PropTypes.func,
 *   }
 * }
 *
 * const mapFn = (executeAction, props) => ({
 *   handleEnroll: () => {
 *     return executeAction(enrollAction, { courseId: props.courseId });
 *   },
 *   handleUnenroll: () => {
 *     return executeAction(unenrollAction, { courseId: props.courseId });
 *   }
 * })
 *
 * module.exports = _.compose(
 *   connectToStores(
 *     ['CourseStore'],
 *     ({CourseStore}) => ({
 *       courseId: CourseStore.getCourseId()
 *     })
 *   ),
 *   mapExecuteActionToProps(mapFn)
 * )(EnrollButton);
 */
import React from 'react';

import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';

function mapExecuteActionToProps(mapFn) {
  return function (Component) {
    const componentName = Component.displayName || Component.name;

    class FluxibleContextConnector extends React.Component {
      static displayName = componentName + 'FluxibleContextConnector';

      static contextTypes = {
        executeAction: React.PropTypes.func,
      };

      getExecuteActionProps(props) {
        if (!this.context.executeAction) {
          throw new Error(`${componentName} could not find an executeAction function to use.`);
        }

        return mapFn(this.context.executeAction, this.props);
      }

      render() {
        return React.createElement(Component, Object.assign({}, this.props, this.getExecuteActionProps()));
      }
    }

    hoistNonReactStatics(FluxibleContextConnector, Component);

    return FluxibleContextConnector;
  };
}

export default mapExecuteActionToProps;
