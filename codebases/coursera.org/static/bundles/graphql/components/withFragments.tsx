import React from 'react';

import { filter, propType } from 'graphql-anywhere';

import { DocumentNode } from 'graphql';

type FragmentMap = { [key: string]: DocumentNode };

export interface WithFragmentsComponent<Props extends {}, Fragments extends FragmentMap>
  extends React.ComponentClass<Props> {
  fragments: Fragments;
}

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

// eslint-disable-next-line arrow-parens
const filterProps = <Props extends {}>(unfilteredProps: Props, fragments: FragmentMap): Props => {
  return Object.keys(unfilteredProps).reduce((result, key) => {
    if (fragments[key]) {
      // @ts-ignore TS7053 need way to type this better; "'string' can't be used to index type '{}'"
      return { ...result, [key]: filter(fragments[key], unfilteredProps[key]) };
    } else {
      return result;
    }
  }, unfilteredProps);
};

const getDisplayName = <Props,>(Component: React.ComponentType<Props>): string => {
  return Component.displayName || Component.name || 'Component';
};

// eslint-disable-next-line arrow-parens
const withFragments = <Fragments extends FragmentMap>(fragments: Fragments) => <Props extends {}>(
  Component: React.ComponentType<Props>
): WithFragmentsComponent<Props, Fragments> => {
  return class extends React.Component<Props> {
    static displayName = `WithFragments(${getDisplayName<Props>(Component)})`;

    static propTypes = Object.keys(fragments).reduce(
      (result, key) => ({ ...result, [key]: propType(fragments[key]) }),
      {}
    );

    static fragments = fragments;

    render() {
      const filteredProps = filterProps(this.props, fragments);

      return <Component {...filteredProps} />;
    }
  };
};

export default withFragments;
