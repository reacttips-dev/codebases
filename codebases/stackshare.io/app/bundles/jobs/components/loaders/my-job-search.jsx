import React from 'react';
import glamorous from 'glamorous';
import {Loader} from '../../../../shared/library/loaders/loader';

const Container = glamorous.div({
  margin: '25px 0'
});

const MyJobSearchLoader = () => {
  return (
    <Container>
      <Loader w="100%" h={220} style={{margin: '18px 0'}} animate={true} />
    </Container>
  );
};

export default MyJobSearchLoader;
