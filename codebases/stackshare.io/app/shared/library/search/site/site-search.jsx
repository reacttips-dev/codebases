import {useMemo} from 'react';
import PropTypes from 'prop-types';
import {debounce} from '../../../utils/debounce';
import {withApollo} from 'react-apollo';
import {siteSearch} from '../../../../data/shared/queries';

const processSearchResults = hits => {
  if (!hits || hits.length === 0) {
    return null;
  }

  // This is object's keys are ordered
  // The bit after the # is used to build the link out to the search page
  const searchResults = {
    'Service#tools': [],
    'Function#groups': [],
    'Category#categories': [],
    'Stackup#stackups': [],
    'User#users': [],
    'Post#posts': [],
    'Stack#stacks': []
  };
  hits.forEach(({type, name, username, title, canonicalUrl, imageUrl, id}) => {
    const key = Object.keys(searchResults).find(k => k.split('#')[0] === type);
    if (key) {
      searchResults[key].push({
        name: name ? name : username ? username : title,
        canonicalUrl,
        imageUrl,
        id
      });
    }
  });

  return searchResults;
};

const createSearch = (client, onResults) =>
  debounce(keyword => {
    client
      .query({
        query: siteSearch,
        variables: {keyword}
      })
      .then(result => onResults(processSearchResults(result.data.siteSearch)));
  }, 500);

const SiteSearch = ({client, children, onResults}) => {
  const doSearch = useMemo(() => createSearch(client, onResults), [client, onResults]);

  return children(value => doSearch(value));
};

SiteSearch.propTypes = {
  children: PropTypes.func,
  onResults: PropTypes.func,
  client: PropTypes.shape({query: PropTypes.func}) // ApolloClient
};

export default withApollo(SiteSearch);
