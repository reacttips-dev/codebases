import {toolSearch, topicSearch, siteSearch, companySearch} from '../shared/resolvers';
export default searchIndex => {
  return {
    Query: {
      ...companySearch(searchIndex),
      ...siteSearch(searchIndex),
      ...toolSearch(searchIndex),
      ...topicSearch(searchIndex)
    }
  };
};
