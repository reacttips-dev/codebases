import React, { Component } from 'react';
import { connect } from 'react-redux';
import RecordOnMobile from '../RecordOnMobile';
import {
  isIOS,
  isAndroidChrome,
  getOpenInAppUrl,
} from '../../../helpers/serverRenderingUtils';

const mapStateToProps = ({ browser, station, user }, routerProps) => ({
  isIOS: isIOS(),
  isAndroidChrome: isAndroidChrome(),
  openInAppUrl: getOpenInAppUrl(
    `${routerProps.location.pathname}${routerProps.location.search}`
  ),
});

export default connect(mapStateToProps)(RecordOnMobile);
