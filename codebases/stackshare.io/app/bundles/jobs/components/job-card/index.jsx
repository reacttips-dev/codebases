import React from 'react';
import PropTypes from 'prop-types';
import SingleJobPosting from './single-job-posting';

const JobCard = ({jobData, bookmarkedJobsIds}) => {
  return (
    <>
      {jobData &&
        jobData.map(job => {
          const services = job.stack
            ? job.stack.map(service => {
                return {
                  id: service.id,
                  imageUrl: service.image_url,
                  path: service.canonical_url,
                  name: service.name
                };
              })
            : job.tools;
          return (
            <SingleJobPosting
              key={job.id}
              job={job}
              bookmarkedJobsIds={bookmarkedJobsIds}
              services={services}
            />
          );
        })}
    </>
  );
};

JobCard.propTypes = {
  jobData: PropTypes.array,
  bookmarkedJobsIds: PropTypes.array
};

export default JobCard;
