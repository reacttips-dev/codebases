import React from 'react';
import PropTypes from 'prop-types';
import {graphql} from 'react-apollo';

// function isLocal(selection) {
//   return selection.directives.findIndex(d => d.name.value === 'client') !== -1;
// }

export const ApolloContext = React.createContext(null);

export function withApolloContext(Component) {
  const LegacyContextBridge = (props, {client}) => (
    <ApolloContext.Provider value={client}>
      <Component {...props} />
    </ApolloContext.Provider>
  );
  LegacyContextBridge.contextTypes = {
    client: PropTypes.object.isRequired
  };
  return LegacyContextBridge;
}

export function withProps(stubProps) {
  return function(Component) {
    return function WithProps(props) {
      return <Component {...props} {...stubProps} />;
    };
  };
}

export function withPolling(shouldBePolling) {
  return function(Component) {
    let isPolling = false;
    function WithPolling({startPolling, stopPolling, ...restProps}) {
      const shouldBe = shouldBePolling(restProps);
      if (shouldBe && !isPolling) {
        isPolling = true;
        startPolling();
      } else if (!shouldBe && isPolling) {
        isPolling = false;
        stopPolling();
      }
      return <Component {...restProps} />;
    }
    WithPolling.propTypes = {
      startPolling: PropTypes.func.isRequired,
      stopPolling: PropTypes.func.isRequired
    };
    return WithPolling;
  };
}

export function withMutation(
  gql,
  mapMutateToProps,
  refetchQueries = [],
  awaitRefetchQueries = false
) {
  const {
    variableDefinitions,
    name: {value: propName},
    operation
  } = gql.definitions[0];
  if (operation !== 'mutation') {
    throw Error(`withMutation() expected type "mutation", received type "${operation}"!`);
  }
  const variableNames = variableDefinitions.map(def => def.variable.name.value);
  return graphql(gql, {
    options: {refetchQueries, awaitRefetchQueries},
    props: ({mutate, ownProps}) => {
      if (mapMutateToProps) {
        return mapMutateToProps(mutate, ownProps);
      } else {
        return {
          [propName]: (...args) => {
            mutate({
              variables: variableNames.reduce((o, name, i) => ({...o, [name]: args[i]}), {})
            });
          }
        };
      }
    }
  });
}

export function withQuery(gql, mapDataToProps, mapPropsToVariables, mapPropsToSkip, opts) {
  const {
    selectionSet,
    name: {value: propName},
    operation
  } = gql.definitions[0];
  if (operation !== 'query') {
    throw Error(`withQuery() expected type "query", received type "${operation}"!`);
  }
  if (selectionSet.selections.length > 1) {
    throw Error(`withQuery() only supports a single selection set!`);
  }

  const [selection] = selectionSet.selections;

  return graphql(gql, {
    props: ({data}) => {
      if (mapDataToProps) {
        return mapDataToProps(data);
      } else {
        const field = selection.name.value;
        return {
          [propName]: data[field]
        };
      }
    },
    skip: mapPropsToSkip ? mapPropsToSkip : false,
    options: props => {
      let options = {
        // this updates the loading flag when fetchMore is invoked
        notifyOnNetworkStatusChange: true,
        ...opts
      };
      if (mapPropsToVariables) {
        options.variables = mapPropsToVariables(props);
      }
      return options;
    }
  });
}
