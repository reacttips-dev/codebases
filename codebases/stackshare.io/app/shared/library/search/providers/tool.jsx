import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {ApolloContext} from '../../../enhancers/graphql-enhancer';
import {SearchContext} from './context';
import {toolSearch} from '../../../../data/shared/queries';

const performSearch = client => async keyword => {
  const tools = await client.query({query: toolSearch, variables: {keyword}});
  return tools.data.toolSearch.map(res => ({
    id: res.slug,
    name: res.name,
    type: 'tool',
    imageUrl: res.imageUrl,
    _result: res
  }));
};

const ToolSearchProvider = ({children}) => {
  const client = useContext(ApolloContext);
  return <SearchContext.Provider value={performSearch(client)}>{children}</SearchContext.Provider>;
};

ToolSearchProvider.propTypes = {
  children: PropTypes.any
};

export default ToolSearchProvider;
