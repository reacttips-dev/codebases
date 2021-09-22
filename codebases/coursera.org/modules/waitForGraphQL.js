import { branch, compose, renderComponent, renderNothing } from 'recompose';
import { graphql } from 'react-apollo';

// // We want to completely hide the `loading` state from the underlying component, so until that happens,
// // we're not going to pre-process our data downstream. In particular, this allows us to do safe destructuring
// // of our data in the component itself (which would not normally work if the data hasn't arrived yet.)
export default function waitForGraphQL(
  query: any,
  config: Object = {},
  loadingComponent: Class<React$Component<*, *, *>>
) {
  return compose(
    graphql(query, config),
    branch(
      ({ data, data: { loading } }) => loading,
      loadingComponent ? renderComponent(loadingComponent) : renderNothing
    )
  );
}
