import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Flex, Button, TextInput } from '@postman/aether';

import { validateEmail } from '../api';
import NavigationService from '../../../../../../../js/services/NavigationService';
import AnalyticsService from '../../../../../../../js/modules/services/AnalyticsService';
import styled from 'styled-components';

const StyledTextInput = styled(TextInput)`
  height: 36px;
  color: var(--content-color-primary);
  background-color: var(--background-color-primary);
  border: none;
  border-radius: var(--border-radius-default) 0 0 var(--border-radius-default);
  padding-left: 10px;

  &:hover {
    border: none
  }


  input {
    font-size: var(--text-size-l);
    line-height: var(--line-height-l);

    &::placeholder {
      color: var(--content-color-tertiary);
    }
  }
`;

const StyledButton = styled(Button)`
  height: 36px;
  padding: 0px var(--spacing-m);
  border-radius: 0 var(--border-radius-s) var(--border-radius-s) 0;
`;

const StyledFlexWrapper = styled(Flex)`
  border: var(--border-width-default) var(--border-style-solid) var(--base-color-brand);
  border-radius: var(--border-radius-default);
`;

const StyledInputTextWrapper = styled.div`
    flex:1;
`;

const InputButton = ({ placeholder, buttonText, className, traceId, analyticsLabel }) => {
  const [inputValue, setEmail] = useState('');

  const handleSubmit = async () => {
    let email = inputValue,
      isNewUser = await validateEmail(email);

    AnalyticsService.addEventV2AndPublish({
      category: 'home',
      action: 'click',
      label: 'signup',
      entityType: analyticsLabel,
      value: 1,
      traceId
    });
    AnalyticsService.addEventV2AndPublish({
      category: 'home',
      action: 'enter',
      label: 'email',
      entityType: email,
      value: 1,
      traceId
    });

    if (isNewUser) {
      NavigationService.openURL(`${pm.identityUrl}/signup?email=${encodeURIComponent(email)}`);
    } else {
      NavigationService.openURL(`${pm.identityUrl}/login?email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <StyledFlexWrapper className={className} wrap='wrap'>
      <StyledInputTextWrapper>
        <StyledTextInput
          value={inputValue}
          type='email'
          size='medium'
          placeholder={placeholder}
          className={'input-button'}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          onKeyDown={(e) => {
            // On enter pressed
            if (e.keyCode === 13) {
              handleSubmit();
            }
          }}
        />
      </StyledInputTextWrapper>
      <StyledButton
        type='primary'
        size='medium'
        text={buttonText}
        onClick={handleSubmit}
      />
    </StyledFlexWrapper>
  );
};

InputButton.propTypes = {
  placeholder: PropTypes.string,
  buttonText: PropTypes.string,
  className: PropTypes.string,

  // for client Analytics
  traceId: PropTypes.string,
  analyticsLabel: PropTypes.string
};

export default InputButton;
