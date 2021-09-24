import React from 'react';
import {Query} from 'react-apollo';

export const CurrentUserContext = React.createContext(false);

export function withCurrentUser(queryOrComponent, dontFire = false) {
  if (!queryOrComponent)
    throw Error(
      'This enhancer expects a gql query when acting as a provider, or a component when acting as a consumer.'
    );

  if (typeof queryOrComponent === 'function') {
    const Component = queryOrComponent;
    return function CurrentUserConsumer(props) {
      return (
        <CurrentUserContext.Consumer>
          {currentUser => <Component {...props} currentUser={currentUser} />}
        </CurrentUserContext.Consumer>
      );
    };
  } else {
    const query = queryOrComponent;
    return function(Component) {
      return function CurrentUserProvider(props) {
        // eslint-disable-next-line react/prop-types
        return dontFire && !(props && props.userId) ? (
          <Component {...props} />
        ) : (
          <Query query={query}>
            {({loading, error, data}) => {
              let user = {};
              if (loading) {
                user.loading = true;
              } else if (error) {
                user = null;
              } else {
                user = data.me; // data.me is null if user is anonymous
              }
              return (
                <CurrentUserContext.Provider value={loading ? false : user}>
                  <Component {...props} currentUser={user} />
                </CurrentUserContext.Provider>
              );
            }}
          </Query>
        );
      };
    };
  }
}
