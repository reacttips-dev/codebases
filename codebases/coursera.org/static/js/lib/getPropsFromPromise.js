/**
 * getPropsFromPromise
 *
 * Load data from a promise. It does not block render while it is fetching
 * the promise.
 *
 * 1. If you want to block rendering your component until the data is there, use this
 * in conjunction with `js/lib/waitFor`.
 *
 * module.exports = compose(
 *   getPropsFromPromise((props) => {
 *     return Q.all([
 *     	getCourseFromId(props.courseId),
 *     	getInstructorForCourse(props.courseId)
 *     ]).spread((course, instructor) => ({
 *       course: course
 *       instructor: instructor
 *     }))
 *   }),
 *   waitFor(props => !!course && !!instructor)
 * )(SomeComponent)
 *
 * 2. If you want to custom handle logic in your component while the data is loading,
 * use `js/lib/mapProps` to give yourself an `isLoaded` prop that your component can hook onto
 *
 * module.exports = compose(
 *   getPropsFromPromise((props) => {
 *     return Q.all([
 *     	getCourseFromId(props.courseId),
 *     	getInstructorForCourse(props.courseId)
 *     ]).spread((course, instructor) => ({
 *       course: course
 *       instructor: instructor
 *     }))
 *   }),
 *   mapProps(props => ({
 *     ...props,
 *     isLoaded: !!course && !!instructor
 *   }))
 * )(SomeComponent)*
 */
import _ from 'underscore';

import React from 'react';
import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';

export default (promiseFactoryFn) => {
  return (Component) => {
    const componentName = Component.displayName || Component.name;
    class GetPropsFromPromiseWrapper extends React.Component {
      static displayName = componentName + 'GetPropsFromPromiseWrapper';

      componentDidMount() {
        this.update(this.props);
      }

      componentWillReceiveProps(nextProps) {
        const refresh = _([].concat(Object.keys(nextProps), Object.keys(this.props)))
          .chain()
          .uniq()
          // TODO(Lewis): investigate why these are being passed into props from React Router
          .without(...['children', 'history', 'location', 'params', 'route', 'routeParams', 'routes'])
          .some((propKey) => !_.isEqual(this.props[propKey], nextProps[propKey]))
          .value();

        if (refresh) {
          this.update(nextProps);
        }
      }

      update(props) {
        const promise = promiseFactoryFn(props).then((data) => {
          this.setState(data);
        });

        if (promise.catch) {
          promise.catch((e) => {
            throw e;
          });
        }

        if (promise.done) {
          promise.done();
        }
      }

      render() {
        return React.createElement(Component, Object.assign({}, this.props, this.state));
      }
    }
    hoistNonReactStatics(GetPropsFromPromiseWrapper, Component);

    return GetPropsFromPromiseWrapper;
  };
};
