import { compose } from 'underscore';
import { graphql } from 'react-apollo';
import waitFor from 'js/lib/waitFor';

// We want to completely hide the `loading` state from the underlying component, so until that happens,
// we're not going to pre-process our data downstream. In particular, this allows us to do safe destructuring
// of our data in the component itself (which would not normally work if the data hasn't arrived yet.)
const filterPropsUntilLoad = (operationOptions = {}) => ({ data: { loading, ...restOfData }, ...restOfArgs }) => {
  if (loading) {
    return { loading };
  } else if (operationOptions.props) {
    // operationOptions.props allows us to modify props before they passed into the child component
    // http://dev.apollodata.com/react/higher-order-components.html#graphql-api
    return operationOptions.props({ data: restOfData, ...restOfArgs });
  } else {
    return { data: restOfData, ...restOfArgs };
  }
};

const waitForGraphQL = (query, operationOptions, loadingComponent) => {
  return compose(
    graphql(query, {
      ...operationOptions,
      props: filterPropsUntilLoad(operationOptions),
    }),
    waitFor(({ loading }) => !loading, loadingComponent)
  );
};

export default waitForGraphQL;
export { filterPropsUntilLoad };
