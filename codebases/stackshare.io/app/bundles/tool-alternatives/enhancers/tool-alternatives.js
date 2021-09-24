import React, {useContext} from 'react';
import {RouteContext} from '../../../shared/enhancers/router-enhancer';
import {Query} from 'react-apollo';
import {toolBySlug} from '../../../data/tool-alternatives/queries';

const withToolAlternatives = Component => ({...restProps}) => {
  const {slug, signin} = useContext(RouteContext);

  return (
    <Query query={toolBySlug} variables={{id: slug}}>
      {({data: {tool}, loading}) => (
        <Component
          {...restProps}
          tool={tool}
          loading={loading}
          signin={signin}
          contentGroup={'Services'}
        />
      )}
    </Query>
  );
};

export default withToolAlternatives;
