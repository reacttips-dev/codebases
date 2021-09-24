import React, {useContext, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ASH, TARMAC} from '../../../../shared/style/colors';
import BigTitle from '../../../../shared/library/typography/big-title';
import Text from '../../../../shared/library/typography/text';
import DwellTracker from '../../../../shared/utils/dwell-tracker';
import {MobileContext} from '../../../../shared/enhancers/mobile-enhancer';
import LocationSvg from '../../../../shared/library/icons/location-icon.svg';
import Services from '../../../../shared/library/services';
import {Bottom, JobDetails, JobsCardContainer, Top} from '../shared/styles';
import {useSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';
import {JobsContext} from '../../enhancers/jobs';
import {JOBS_CLICK, JOBS_VIEW, JOBS_DWELL} from '../../constants/analytics';
import CtaPanel from './cta-panel';
import ViewMorePanel from './view-more';

const Logo = glamorous.img({
  width: 65,
  height: 65,
  borderRadius: 4,
  marginRight: 15,
  border: `1px solid ${ASH}`
});

const Link = glamorous.a({
  color: TARMAC,
  '&:hover': {
    color: TARMAC,
    textDecoration: 'underline'
  }
});

const Title = glamorous(BigTitle)({
  margin: 0,
  lineHeight: '25px'
});

const Location = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  marginLeft: 10
});

const LocationIcon = glamorous(LocationSvg)({
  width: 15,
  height: 15
});

const LocationText = glamorous(Text)({
  lineHeight: '18px'
});

const LocationIconContainer = glamorous.div({
  width: 15,
  height: 15,
  marginRight: 5
});

const SingleJobPosting = ({job, bookmarkedJobsIds, services}) => {
  const isMobile = useContext(MobileContext);
  const jobsContext = useContext(JobsContext);
  const sendAnalyticsEvent = useSendAnalyticsEvent();
  const cardRef = useRef(null);

  useEffect(() => {
    let viewTracker;
    let dwellTracker;
    if (cardRef.current) {
      viewTracker = new DwellTracker(
        cardRef.current,
        () => {
          sendAnalyticsEvent(JOBS_VIEW, {...job, details: false});
        },
        0
      );
      dwellTracker = new DwellTracker(
        cardRef.current,
        () => {
          sendAnalyticsEvent(JOBS_DWELL, {...job, details: false});
        },
        3000
      );
    }
    return () => {
      viewTracker.destroy();
      dwellTracker.destroy();
    };
  }, [cardRef.current]);

  const onJobClick = ({job}) => {
    sendAnalyticsEvent(JOBS_CLICK, {...job, details: false});
  };

  return (
    <JobsCardContainer innerRef={cardRef} sponsored={job.sponsored} key={job.id}>
      <Top>
        <JobDetails>
          <div>
            <a href={job.path} title={`${job.companyName} company profile`}>
              <Logo src={job.imageUrl} alt={job.companyName} />
            </a>
          </div>
          <div>
            <Title>
              <a
                href={job.url}
                title={job.title}
                rel="noopener noreferrer nofollow"
                target="_blank"
                onClick={() => onJobClick({job})}
              >
                {job.title}
              </a>
            </Title>
            <Text>at </Text>
            <Link href={job.path} title={`${job.companyName} company profile`}>
              {job.companyName}
            </Link>
            {!isMobile && job.sponsored && <ViewMorePanel job={job} />}
          </div>
        </JobDetails>
        {isMobile && job.sponsored && <ViewMorePanel job={job} />}
        {!isMobile && <CtaPanel job={job} bookmarkedJobsIds={bookmarkedJobsIds} />}
      </Top>
      <Bottom>
        <Services
          showPopOver={false}
          searchTerms={jobsContext.searchTerms}
          showJobs={false}
          onActivate={() => {}}
          onClick={() => {}}
          sortItems={true}
          services={services}
          serviceCount={isMobile ? 4 : 15}
        />
        <Location>
          <LocationIconContainer>
            <LocationIcon />
          </LocationIconContainer>
          <LocationText>{job.location}</LocationText>
        </Location>
      </Bottom>
      {isMobile && <CtaPanel job={job} bookmarkedJobsIds={bookmarkedJobsIds} />}
    </JobsCardContainer>
  );
};

SingleJobPosting.propTypes = {
  job: PropTypes.object,
  bookmarkedJobsIds: PropTypes.array,
  services: PropTypes.array
};

export default SingleJobPosting;
