import React from 'react';
import glamorous from 'glamorous';
import {WHITE} from '../../../shared/style/colors';
import {PHONE} from '../../../shared/style/breakpoints';
import UserDetails from './user-details';
import MyJobSearch from './my-job-search';
import FollowedCompanies from './followed-companies';

const Container = glamorous.div({
  gridArea: 'sidebar',
  background: WHITE,
  paddingLeft: 43,
  paddingRight: 43,
  marginLeft: -43,
  borderLeft: '1px solid #ebebeb',
  borderRight: '1px solid #ebebeb',
  [PHONE]: {
    border: 0,
    paddingLeft: 0,
    paddingRight: 0,
    width: '100vw',
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0
  }
});
const Sidebar = () => {
  return (
    <Container>
      <UserDetails />
      <MyJobSearch />
      <FollowedCompanies />
    </Container>
  );
};

export default Sidebar;
