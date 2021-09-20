import React, { Component } from 'react';
import { Button } from '@postman/aether';
import styled from 'styled-components';
import { observer } from 'mobx-react';
import { addParamsToUrl } from '../../../common/utils/url';

import XPath from '../../../components/base/XPaths/XPath';
import AnalyticsService from '../../../modules/services/AnalyticsService';

import { SIGNED_OUT_HEADER_BREAKPOINT } from './constants';

const StyledUserInfoContainer = styled.div`
  margin-right: var(--spacing-m);

  @media screen and (max-width: ${SIGNED_OUT_HEADER_BREAKPOINT}px) {
    margin-top: var(--spacing-xxl);
    grid-template-columns: 1fr 1fr;
    display: grid;
  }
`,
StyledSignInButton = styled(Button)`
  margin-right: var(--spacing-s);
`;

@observer
export default class SignedOutHeaderCTA extends Component {
  constructor (props) {
    super(props);

    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleCreateAccount = this.handleCreateAccount.bind(this);
  }

  handleLoginClick () {
    const { traceId } = this.props;

    AnalyticsService.addEventV2AndPublish({
      category: 'home',
      action: 'click',
      label: 'signin',
      traceId,
      value: 1
    });
    window.location.assign(addParamsToUrl(`${pm.identityUrl}/login`, {
      continue: `${window.location.href}`
    }));
  }

  handleCreateAccount () {
    const { traceId } = this.props;

    AnalyticsService.addEventV2AndPublish({
      category: 'home',
      action: 'click',
      label: 'signup',
      entityType: 'header',
      traceId,
      value: 1
    });
    window.location.assign(addParamsToUrl(`${pm.identityUrl}/signup`, {
      continue: `${window.location.href}`
    }));
  }

  render () {
    return (
      <StyledUserInfoContainer>
        <XPath identifier='signIn'>
          <StyledSignInButton
            size='medium'
            type='outline'
            onClick={this.handleLoginClick}
            text='Sign In'
          />
          <Button
            size='medium'
            type='primary'
            onClick={this.handleCreateAccount}
            text='Sign Up for Free'
          />
        </XPath>
      </StyledUserInfoContainer>
    );
  }
}
