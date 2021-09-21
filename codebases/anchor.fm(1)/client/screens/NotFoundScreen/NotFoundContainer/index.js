import React from 'react';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import NotFoundScreen from '../index';

// Dispatch a history state of 404 to the given path name
const mapDispatchToProps = dispatch => ({
  handleNotFound: path => {
    dispatch(routerActions.replace(path, { status: 404 }));
  },
});

const mapStateToProps = ({ user: { user } }) => ({ isLoggedIn: Boolean(user) });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotFoundScreen);
