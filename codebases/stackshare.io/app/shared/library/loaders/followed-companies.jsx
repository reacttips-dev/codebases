import React from 'react';
import glamorous from 'glamorous';
import {Loader} from './loader';

const Container = glamorous.div({
  margin: '20px 0'
});

const FollowedCompaniesLoader = () => {
  return (
    <Container>
      <Loader w="100%" h={31} style={{margin: '18px 0'}} animate={true} />
      <Loader w="100%" h={31} style={{margin: '18px 0'}} animate={true} />
      <Loader w="100%" h={31} style={{margin: '18px 0'}} animate={true} />
      <Loader w="100%" h={31} style={{margin: '18px 0'}} animate={true} />
    </Container>
  );
};

export default FollowedCompaniesLoader;
