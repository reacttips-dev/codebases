import React, {useContext, useEffect} from 'react';
import glamorous from 'glamorous';
import BigTitle from '../../../shared/library/typography/big-title';
import LoadMoreButton from '../../../shared/library/buttons/load-more';
import JobCard from './job-card';
import {BASE_TEXT} from '../../../shared/style/typography';
import JobCardLoader from './loaders/job-card';
import {TARMAC} from '../../../shared/style/colors';
import PillLabel from '../../../shared/library/buttons/base/pill-label';
import {CurrentUserContext} from '../../../shared/enhancers/current-user-enhancer';
import {flattenEdges} from '../../../shared/utils/graphql';
import {BAR} from '../../../shared/library/notices/themes';
import Notice, {InfoIcon} from '../../../shared/library/notices/notice';
import {JobsContext} from '../enhancers/jobs';
import {useSendAnalyticsEvent} from '../../../shared/enhancers/analytics-enhancer';
import {AlgoliaJobsContext} from '../../../shared/enhancers/algolia-jobs-enhancer';
import {JOBS_SEARCH} from '../constants/analytics';
import {Loader} from '../../../shared/library/loaders/loader';

const Container = glamorous.div({
  margin: '10px 0',
  ...BASE_TEXT
});

export const Center = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 20
});

const JobList = () => {
  const jobsContext = useContext(JobsContext);
  const currentUser = useContext(CurrentUserContext);
  const sendAnalyticsEvent = useSendAnalyticsEvent();
  const algoliaJobsContext = useContext(AlgoliaJobsContext);
  const aroundLatLng =
    jobsContext.geoLocation &&
    jobsContext.geoLocation.lat &&
    jobsContext.geoLocation.lng &&
    `${jobsContext.geoLocation.lat},${jobsContext.geoLocation.lng}`;
  const locationParams = aroundLatLng ? {aroundLatLng: aroundLatLng} : {aroundLatLngViaIP: true};

  useEffect(() => {
    algoliaJobsContext
      .search({
        query: jobsContext.query,
        ...locationParams,
        offset: 0,
        length: jobsContext.hitsPerPage,
        hitsPerPage: jobsContext.hitsPerPage,
        aroundPrecision: process.env.JOB_SEARCH_ALGOLIA_GEO_PRECISION
      })
      .then(jobsContext.setLoading(true))
      .then(data => {
        jobsContext.setAllJobData(data);
        if (data.hits) {
          const normalizeData = data.hits.map(
            ({
              apply_url,
              location,
              company_name,
              company_image_url,
              company_website,
              public_id,
              title,
              company_verified,
              tools,
              remote,
              company_path,
              sponsored
            }) => ({
              url: apply_url,
              location,
              companyName: company_name,
              imageUrl: company_image_url,
              companyWebsite: company_website,
              id: public_id,
              title,
              verified: company_verified,
              stack: tools,
              remote,
              path: company_path,
              sponsored
            })
          );
          jobsContext.setJobData(normalizeData);
          jobsContext.setLoading(false);
          sendAnalyticsEvent(JOBS_SEARCH, {...jobsContext.terms, location});
        }
      });
  }, [jobsContext.terms, jobsContext.geoLocation, jobsContext.hitsPerPage]);

  const bookmarkedJobs = currentUser && flattenEdges(currentUser.bookmarkedJobs);

  const bookmarkedJobData =
    currentUser &&
    currentUser.bookmarkedJobs &&
    bookmarkedJobs.map(jobs => {
      return {
        id: jobs.id,
        imageUrl: jobs.company.imageUrl,
        companyName: jobs.company.name,
        path: jobs.company.path,
        title: jobs.title,
        tools: jobs.tools,
        location: jobs.location,
        url: jobs.angellistJobUrl,
        bookmarked: jobs.bookmarked
      };
    });

  const bookmarkedJobsIds =
    currentUser &&
    currentUser.bookmarkedJobs &&
    bookmarkedJobs.map(jobs => {
      return jobs.id;
    });

  const jobCount = jobsContext.jobData && jobsContext.jobData.length;
  const disableShowMore = jobsContext.count === jobCount;

  return (
    <Container>
      {jobsContext.loading && (
        <Loader w={85} h={25} style={{margin: '0 0 13px 0'}} animate={true} />
      )}
      {jobsContext.jobData &&
        jobsContext.jobData.length !== 0 &&
        !jobsContext.bookmarkSearch &&
        (!jobsContext.loading || jobsContext.hitsPerPage > 15) && (
          <>
            <BigTitle>
              Jobs
              <PillLabel flavour={TARMAC}>{jobsContext.count}</PillLabel>
            </BigTitle>
            <JobCard jobData={jobsContext.jobData} bookmarkedJobsIds={bookmarkedJobsIds} />
          </>
        )}
      {jobsContext.jobData && jobsContext.jobData.length !== 0 && jobsContext.bookmarkSearch && (
        <>
          {currentUser.bookmarkedJobs.count === 0 && (
            <Notice
              theme={BAR}
              fullWidth={true}
              icon={<InfoIcon />}
              title="You don't seem to have any bookmarked jobs yet, go back to search and bookmark some jobs"
            />
          )}
          {currentUser.bookmarkedJobs.count !== 0 && (
            <>
              <BigTitle>
                Jobs
                <PillLabel flavour={TARMAC}>{currentUser.bookmarkedJobs.count}</PillLabel>
              </BigTitle>
              <JobCard jobData={bookmarkedJobData} />
            </>
          )}
        </>
      )}
      {jobsContext.loading && <JobCardLoader />}
      {jobsContext.jobData &&
        !jobsContext.jobData.length &&
        !jobsContext.loading &&
        !jobsContext.bookmarkSearch && (
          <Notice
            theme={BAR}
            fullWidth={true}
            icon={<InfoIcon />}
            title="We couldn't find any jobs matching your search. Please try to refine your search to see some jobs."
          />
        )}
      {jobsContext.jobData &&
        jobsContext.count >= 15 &&
        !disableShowMore &&
        !jobsContext.bookmarkSearch &&
        !jobsContext.loading && (
          <Center>
            <LoadMoreButton
              loading={jobsContext.loading}
              onClick={() => {
                jobsContext.setHitsPerPage(jobsContext.hitsPerPage + 15);
              }}
            />
          </Center>
        )}
    </Container>
  );
};

export default JobList;
