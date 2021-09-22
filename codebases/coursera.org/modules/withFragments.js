// @flow
import React from 'react';
import _ from 'underscore';

import {filter, propType} from 'graphql-anywhere';

import type { FragmentDefinitionNode } from 'graphql';

type FragmentMap = {[key: string]: FragmentDefinitionNode};

// module.exports = withFragments({
//   course: gql`
//     fragment SomeCourseFragment on CoursesV1 {
//       name
//       slug
//     }
//   `
// })(SomeComponent);

// This function will handle data masking and validating whether or not enough data is being
// passed to this component.

const filterProps = (unfilteredProps, fragments: FragmentMap) => {
  return _.mapObject(unfilteredProps, (value, key) => {
    if (fragments[key]) {
      return filter(fragments[key], value);
    }
    return value;
  });
};

const getDisplayName = (Component: ReactClass<*>): string => {
  return Component.displayName || Component.name || 'Component';
};

module.exports = (fragments: FragmentMap) =>
  (Component: ReactClass<*>): ReactClass<*> => {
    class WithFragments extends React.Component {
      static displayName = `WithFragments(${getDisplayName(Component)})`;
      static propTypes = _.mapObject(fragments, fragment => propType(fragment));
      static fragments = fragments;

      render() {
        const filteredProps = filterProps(this.props, fragments);

        return <Component {...filteredProps} />;
      }
    }

    return WithFragments;
  };
