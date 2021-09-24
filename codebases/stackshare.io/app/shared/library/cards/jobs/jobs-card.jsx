import React, {useRef} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Title from '../../typography/title';
import Text from '../../typography/text';
import Button from '../../buttons/base/link';
import {ASH, TARMAC, WHITE} from '../../../style/colors';
import LocationIcon from '../../icons/location-icon.svg';
import Services from '../../services';
import SuitcaseIcon from '../../icons/suitcase-icon.svg';
import {FONT_FAMILY} from '../../../style/typography';
import {PHONE} from '../../../style/breakpoints';
import {withSendAnalyticsEvent} from '../../../enhancers/analytics-enhancer';
// import DwellTracker from '../../../../shared/utils/dwell-tracker';
import PrivatePublicIndicator from '../../../../shared/library/private-public-indicator';
import LazyLoadImage from '../../../utils/lazy-loading-images';

const Container = glamorous.div({
  background: WHITE,
  position: 'relative',
  border: `1px solid ${ASH}`,
  borderRadius: 4,
  margin: '10px 0 3px 0',
  padding: '15px 20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  fontFamily: FONT_FAMILY
});

const Details = glamorous.div({
  order: 1,
  flexGrow: 1
});

const Link = glamorous.a({
  color: TARMAC,
  '&:hover': {
    color: TARMAC,
    textDecoration: 'underline'
  }
});

const Location = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  margin: '5px 0',
  [PHONE]: {
    fontSize: '13px'
  },
  '>svg': {
    marginRight: '3px'
  }
});

const Cta = glamorous.div({
  order: 2,
  margin: '10px 0'
});

const Footer = glamorous.div({
  display: 'flex',
  margin: '15px 0 0 0',
  alignItems: 'center',
  justifyContent: 'space-between'
});

const Logo = glamorous.img({
  width: 50,
  height: 50,
  border: `1px solid ${ASH}`,
  borderRadius: 2
});

const StyledTitle = glamorous(Title)({
  margin: '5px 0 0 0',
  [PHONE]: {
    fontSize: '18px'
  }
});

const PubPrivContainer = glamorous.div({
  position: 'absolute',
  top: 25,
  right: 20
});

const Jobs = ({
  companyName = null,
  companyLogo = null,
  url,
  title,
  location,
  services,
  id,
  sendAnalyticsEvent,
  path,
  isPrivate
}) => {
  const cardRef = useRef(null);

  // useEffect(() => {
  //   let viewTracker;
  //   let dwellTracker;
  //   if (cardRef.current) {
  //     viewTracker = new DwellTracker(
  //       cardRef.current,
  //       () => {
  //         sendAnalyticsEvent('view_jobcard', {
  //           jobTitle: title,
  //           jobUrl: url,
  //           location,
  //           companyName: companyName
  //         });
  //       },
  //       0
  //     );
  //     dwellTracker = new DwellTracker(
  //       cardRef.current,
  //       () => {
  //         sendAnalyticsEvent('dwell_jobcard', {
  //           jobTitle: title,
  //           jobUrl: url,
  //           location,
  //           companyName: companyName
  //         });
  //       },
  //       3000
  //     );
  //   }
  //   return () => {
  //     viewTracker.destroy();
  //     dwellTracker.destroy();
  //   };
  // }, [cardRef.current]);

  const handleServicePopover = (serviceId, serviceName, path) => {
    sendAnalyticsEvent('hover_jobCard_servicePopover', {
      serviceId,
      serviceName,
      path
    });
  };

  const handleServicePopoverClick = (serviceId, serviceName, path) => {
    sendAnalyticsEvent('click_jobCard_servicePopover', {
      serviceId,
      serviceName,
      path
    });
  };

  const handleJobClick = (title, url, location) => {
    sendAnalyticsEvent('click_jobCard', {
      jobTitle: title,
      jobUrl: url,
      location,
      companyName: companyName
    });
  };

  return (
    <Container innerRef={cardRef} key={id}>
      {isPrivate && (
        <PubPrivContainer>
          <PrivatePublicIndicator typeIndicator="BlueRoundLarge" />
        </PubPrivContainer>
      )}
      <Details>
        {companyLogo && companyName && (
          <a href={path} title={`${companyName}'s company profile`}>
            <LazyLoadImage>
              <Logo src={companyLogo} alt={companyName} />
            </LazyLoadImage>
          </a>
        )}
        <StyledTitle>
          <a
            href={url}
            title={title}
            target="_blank"
            data-testid="jobsTitle"
            rel="noreferrer noopener nofollow"
            onClick={() => handleJobClick(title, url, location, companyName)}
          >
            {title}
          </a>
        </StyledTitle>
        {companyName && (
          <Link href={path} title={`${companyName}'s company profile`}>
            {companyName}
          </Link>
        )}
        <Location>
          <LocationIcon />
          <Text>{location}</Text>
        </Location>
      </Details>
      <Cta>
        <Button
          data-testid="jobsCta"
          title={title}
          href={url}
          target="_blank"
          rel="noreferrer noopener nofollow"
          onClick={() => handleJobClick(title, url, location, companyName)}
        >
          View Job Details
        </Button>
        <Footer>
          <Services
            services={services}
            onActivate={() => {
              handleServicePopover();
            }}
            onClick={() => {
              handleServicePopoverClick();
            }}
          />
          <SuitcaseIcon />
        </Footer>
      </Cta>
    </Container>
  );
};

Jobs.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  location: PropTypes.string,
  services: PropTypes.array,
  companyName: PropTypes.string,
  companyLogo: PropTypes.string,
  id: PropTypes.string,
  sendAnalyticsEvent: PropTypes.func,
  path: PropTypes.string,
  isPrivate: PropTypes.bool
};

export default withSendAnalyticsEvent(Jobs);
