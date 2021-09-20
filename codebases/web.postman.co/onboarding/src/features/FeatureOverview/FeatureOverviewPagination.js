import React, { Component } from 'react';
import { TEAM_OVERVIEW_CONSTANTS } from './TeamOverviewConstants';
import styled from 'styled-components';

const CircleContainer = styled.div`
  .dot {
    height: 6px;
    width: 6px;
    border-radius: 50%;
    display: inline-block;
    margin-right: var(--spacing-s);
  }

  .background-dark {
    background-color: var(--content-color-secondary);
  }

  .background-light {
    background-color: var(--highlight-background-color-tertiary);
  }
`;

export default class FeatureOverviewPagination extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    const overviewState = this.props.overviewState;

    return (
      <CircleContainer>
        <div>
        <div className={`dot background-${overviewState === TEAM_OVERVIEW_CONSTANTS.state.COLLABORATE ? 'dark' : 'light'}`} />
        <div className={`dot background-${overviewState === TEAM_OVERVIEW_CONSTANTS.state.COMMENT ? 'dark' : 'light'}`} />
        <div className={`dot background-${overviewState === TEAM_OVERVIEW_CONSTANTS.state.TRACK ? 'dark' : 'light'}`} />
        <div className={`dot background-${overviewState === TEAM_OVERVIEW_CONSTANTS.state.API ? 'dark' : 'light'}`} />
      </div>
      </CircleContainer>
    );
  }
}
