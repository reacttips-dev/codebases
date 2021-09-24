import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {ApolloContext} from '../../../enhancers/graphql-enhancer';
import {SearchContext} from './context';
import {companySearch, toolSearch} from '../../../../data/shared/queries';

const createSearch = ({client, terms}) => async keyword => {
  const [tools, companies] = await Promise.all([
    client.query({query: toolSearch, variables: {keyword}}),
    client.query({query: companySearch, variables: {keyword}})
  ]);

  let results = [];

  results.push({id: keyword.toLowerCase(), name: keyword, type: 'keyword'});

  tools.data.toolSearch.forEach(res => {
    results.push({id: res.slug, name: res.name, type: 'tool', imageUrl: res.imageUrl});
  });

  companies.data.companySearch.forEach(res => {
    results.push({
      slug: res.slug,
      id: res.id,
      name: res.name,
      type: 'company',
      imageUrl: res.imageUrl
    });
  });

  return terms.length === 0
    ? results
    : results.filter(r => !terms.map(t => t.name).includes(r.name));
};

const JobSearchProvider = ({children, terms = []}) => {
  const client = useContext(ApolloContext);
  return (
    <SearchContext.Provider value={createSearch({client, terms})}>
      {children}
    </SearchContext.Provider>
  );
};

JobSearchProvider.propTypes = {
  children: PropTypes.any,
  terms: PropTypes.array
};

export default JobSearchProvider;
