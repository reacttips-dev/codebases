import React, {useContext} from 'react';
import glamorous from 'glamorous';
import {
  Container,
  AvatarContainer,
  UserPositionDetails,
  MetaData,
  Location,
  Bookmarks
} from '../shared/styles';
import {MobileContext} from '../../../../shared/enhancers/mobile-enhancer';
import {Loader} from '../../../../shared/library/loaders/loader';

const Name = glamorous.div({
  margin: '17px 0'
});

const UserDetailsLoader = () => {
  const isMobile = useContext(MobileContext);

  return (
    <Container>
      <AvatarContainer>
        <Loader w={70} h={70} style={{borderRadius: 70}} animate={true} />
      </AvatarContainer>
      <Name>
        <Loader w={200} h={25} animate={true} />
      </Name>
      <MetaData>
        <UserPositionDetails>
          <Loader
            w={250}
            h={15}
            style={!isMobile ? {margin: '3px 0'} : {margin: '10px auto'}}
            animate={true}
          />
        </UserPositionDetails>
        <Location>
          <Loader
            w={100}
            h={15}
            style={!isMobile ? {margin: '3px 0'} : {margin: '9px auto'}}
            animate={true}
          />
        </Location>
        <Bookmarks>
          <Loader
            w={150}
            h={15}
            style={!isMobile ? {margin: '3px 0'} : {margin: '9px auto'}}
            animate={true}
          />
        </Bookmarks>
      </MetaData>
    </Container>
  );
};

export default UserDetailsLoader;
