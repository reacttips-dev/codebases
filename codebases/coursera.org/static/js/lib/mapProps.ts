/**
 * mapProps
 *
 * Useful for creating props from an existing set of props.
 *
 * Example use case:
 *
 * class SomeComponent extends React.Component {
 *   static propTypes = {
 *     courseId: React.PropTypes.string,
 *     instructorId: React.PropTypes.string
 *     course: React.PropTypes.object,
 *     instructor: React.PropTypes.object
 *     isLoaded: React.PropTypes.bool.isRequired
 *   }
 *
 *   render() {
 *     const {course, instructor, isLoaded} = this.props;
 *
 *     if (!isLoaded) {
 *       return <AppLoadingSpinner />
 *     }
 *
 *     return <SomeCourse course={course} instructor={instructor} />
 *   }
 * }
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
 * )(SomeComponent)
 */
import * as React from 'react';

import hoistNonReactStatics from 'js/lib/hoistNonReactStatics';

interface InferableComponentEnhancerWithProps<TInjectedProps, TNeedsProps> {
  <P extends TInjectedProps>(component: React.ComponentType<P>): React.ComponentClass<TInjectedProps & TNeedsProps>;
}

type mapper<TInner, TOutter> = (input: TInner) => TOutter;

export default function mapProps<TInner, TOutter>(
  mapFn: mapper<TOutter, TInner>
): InferableComponentEnhancerWithProps<TInner, TOutter> {
  return function <P extends TInner>(Component: React.ComponentType<P>): React.ComponentClass<TInner & TOutter> {
    const componentName = Component.displayName || Component.name;

    class MapPropsWrapper extends React.Component<TInner & TOutter> {
      static displayName = componentName + 'MappedProps';

      render() {
        // @ts-ignore
        return React.createElement(Component, Object.assign({}, this.props, mapFn(this.props)));
      }
    }

    hoistNonReactStatics(MapPropsWrapper, Component);
    return MapPropsWrapper;
  };
}
