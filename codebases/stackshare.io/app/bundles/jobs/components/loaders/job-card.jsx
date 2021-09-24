import React, {useContext} from 'react';
import Text from '../../../../shared/library/typography/text';
import {MobileContext} from '../../../../shared/enhancers/mobile-enhancer';
import {Bottom, CtaPannel, JobDetails, JobsCardContainer, Top} from '../shared/styles';
import {Loader} from '../../../../shared/library/loaders/loader';

const renderCtaPanel = () => {
  return (
    <CtaPannel>
      <Loader w={100} h={40} style={{marginRight: 10, flexGrow: 1}} animate={true} />
      <Loader w={40} h={40} animate={true} />
    </CtaPannel>
  );
};

const renderViewMore = () => {
  const isMobile = useContext(MobileContext);
  return <Loader w={isMobile ? '100%' : 300} h={15} animate={true} />;
};

const JobCardLoader = () => {
  const isMobile = useContext(MobileContext);

  const counter = [1, 2, 3, 4];

  return (
    <>
      {counter.map(i => {
        return (
          <JobsCardContainer key={i}>
            <Top>
              <JobDetails>
                <div>
                  <Loader w={65} h={65} style={{marginRight: 15}} animate={true} />
                </div>
                <div>
                  <Loader w={200} h={25} style={{margin: '0 0 10px 0'}} animate={true} />
                  <Text>
                    <Loader w={100} h={15} style={{margin: '0 0 7px 0'}} animate={true} />
                  </Text>
                  {!isMobile && renderViewMore()}
                </div>
              </JobDetails>
              {isMobile && (
                <div style={{margin: '20px 0', display: 'flex', width: '100%'}}>
                  {renderViewMore()}
                </div>
              )}
              {!isMobile && renderCtaPanel()}
            </Top>
            <Bottom>
              <div style={{display: 'flex'}}>
                <Loader w={33} h={33} style={{marginRight: 10}} animate={true} />
                <Loader w={33} h={33} style={{marginRight: 10}} animate={true} />
                <Loader w={33} h={33} animate={true} />
              </div>
              <div>
                <Loader w={100} h={25} animate={true} />
              </div>
            </Bottom>
            {isMobile && renderCtaPanel()}
          </JobsCardContainer>
        );
      })}
    </>
  );
};

export default JobCardLoader;
