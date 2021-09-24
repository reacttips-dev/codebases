import React, {useContext, useState} from 'react';
import {RouteContext} from '../../../shared/enhancers/router-enhancer';
export const JobsContext = React.createContext(false);

// eslint-disable-next-line react/prop-types
const withJobs = Component => ({currentUser, toolSlug, toolName, imageUrl, ...restProps}) => {
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [terms, setTerms] = useState(
    toolSlug
      ? [
          {
            id: toolSlug,
            imageUrl: imageUrl,
            name: toolName,
            type: 'tool'
          }
        ]
      : []
  );
  const [location, setLocation] = useState(null);
  const [allJobData, setAllJobData] = useState(null);
  const [bookmarkSearch, setBookmarkSearch] = useState(false);
  const [hitsPerPage, setHitsPerPage] = useState(15);
  const [showMyCompanies, setShowMyCompanies] = useState(false);
  const [companySearch, setCompanySearch] = useState(false);
  const [myJobSearch, setMyJobSearch] = useState(false);
  const geoLocation = location && location._geoloc;
  const currentUserLoaded = currentUser && !currentUser.loading;
  const searchTerms = terms.map(({name}) => name);
  const query = searchTerms.join(' ');

  const context = {
    setTerms,
    terms,
    setLocation,
    location,
    setBookmarkSearch,
    bookmarkSearch,
    jobData,
    setJobData,
    loading,
    setLoading,
    count: allJobData && allJobData.nbHits,
    setAllJobData,
    setHitsPerPage,
    hitsPerPage,
    searchTerms,
    currentUserLoaded,
    showMyCompanies,
    setShowMyCompanies,
    companySearch,
    setCompanySearch,
    myJobSearch,
    setMyJobSearch,
    geoLocation,
    query
  };

  const {signin} = useContext(RouteContext);
  return (
    <JobsContext.Provider value={context}>
      <Component {...restProps} signin={signin} toolSlug={toolSlug} />
    </JobsContext.Provider>
  );
};

export default withJobs;
