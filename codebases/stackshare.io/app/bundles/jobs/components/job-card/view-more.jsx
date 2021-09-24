import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {FOCUS_BLUE} from '../../../../shared/style/colors';
import {PHONE} from '../../../../shared/style/breakpoints';
import Info from '../../../../shared/library/icons/info.svg';

const ViewMore = glamorous.a({
  color: FOCUS_BLUE,
  display: 'flex',
  marginTop: 3,
  alignItems: 'center',
  textDecoration: 'none',
  [PHONE]: {
    alignItems: 'baseline',
    padding: '15px 0'
  }
});

const InfoIcon = glamorous(Info)({
  height: 12,
  width: 12,
  marginRight: 5
});

const ViewMorePanel = ({job}) => {
  return (
    <ViewMore href={job.path} title={`${job.companyName} StackShare's company profile`}>
      <InfoIcon />
      <span>{`Explore ${job.companyName}’s decisions, blog posts, tech talks & more…`}</span>
    </ViewMore>
  );
};

ViewMorePanel.propTypes = {
  job: PropTypes.object
};

export default ViewMorePanel;
