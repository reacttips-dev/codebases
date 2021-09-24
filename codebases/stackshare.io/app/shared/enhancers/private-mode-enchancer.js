import React from 'react';
import {Query} from 'react-apollo';

export const PrivateModeContext = React.createContext(false);

export function withPrivateMode(queryOrComponent, dontFire = false) {
  if (!queryOrComponent)
    throw Error(
      'This enhancer expects a gql query when acting as a provider, or a component when acting as a consumer.'
    );

  if (typeof queryOrComponent === 'function') {
    const Component = queryOrComponent;
    return function PrivateModeConsumer(props) {
      return (
        <PrivateModeContext.Consumer>
          {privateMode => <Component {...props} privateMode={privateMode} />}
        </PrivateModeContext.Consumer>
      );
    };
  } else {
    const query = queryOrComponent;
    return function(Component) {
      return function PrivateModeProvider(props) {
        // eslint-disable-next-line react/prop-types
        return dontFire && !(props && props.userId) ? (
          <Component {...props} />
        ) : (
          <Query query={query}>
            {({loading, error, data}) => {
              let privateMode = {};
              if (loading) {
                privateMode.loading = true;
              } else if (error) {
                privateMode = null;
              } else if (data.currentPrivateCompany === null) {
                privateMode = false;
              } else {
                privateMode = data.currentPrivateCompany;
              }
              return (
                <PrivateModeContext.Provider value={loading ? false : privateMode}>
                  <Component {...props} privateCompany={privateMode} />
                </PrivateModeContext.Provider>
              );
            }}
          </Query>
        );
      };
    };
  }
}
