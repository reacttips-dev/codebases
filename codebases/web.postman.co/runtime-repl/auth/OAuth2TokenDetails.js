import React, { Component } from 'react';
import classnames from 'classnames';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import WarningButton from '@postman-app-monolith/renderer/js/components/base/WarningButton';
import WarningIcon from '@postman-app-monolith/renderer/js/components/base/Icons/WarningIcon';
import InfoButton from '@postman-app-monolith/renderer/js/components/base/InfoButton';
import EditIcon from '@postman-app-monolith/renderer/js/components/base/Icons/EditIcon';
import InlineInput from '@postman-app-monolith/renderer/js/components/base/InlineInput';

const BANNED_DETAILS = ['result', 'id', 'name', 'access_token', 'token_type'];

export default class OAuth2TokenDetails extends Component {
  constructor (props) {
    super(props);

    this.state = {
      showEditNameToggle: true
    };

    this.handleNameChange = this.handleNameChange.bind(this);
  }


  getTokenItemClasses (warning) {
    return classnames({
      'oauth2-token-details-item-group': true,
      'oauth2-token-details-item-group--warning': warning
    });
  }

  toggleNameEdit (isEditing) {
    const tokenNameField = this.refs.tokenName;

    // Open the edit inputbox and select the whole token string for renaming
    if (tokenNameField && isEditing) {
      tokenNameField.startEditing();
      tokenNameField.focus();
      tokenNameField.selectAll();
    }

    this.setState({
      showEditNameToggle: !isEditing
    });
  }

  handleNameChange (updatedName) {
    if (!updatedName || typeof updatedName !== 'string') {
      return;
    }

    const updatedToken = _.clone(this.props.token);

    if (!updatedToken) {
      return;
    }

    updatedToken.name = updatedName;
    this.props.onUpdateToken(updatedToken);
  }

  beautifyTokenField (value) {
    const retVal = JSON.stringify(value);

    if (retVal && retVal[0] === '"') {
      return retVal.replace(/"/g, '');
    }

    return retVal;
  }

  render () {
    const { token } = this.props,
      maskedToken = _.pickBy(token, (detailValue, detailName) => !_.includes(BANNED_DETAILS, detailName)),
      isAccessTokenMissing = !token.access_token,
      isTokenTypeIncorrect = token.token_type && (token.token_type).toLowerCase() !== 'bearer';

    return (
      <div className='oauth2-token-details-wrapper'>
        {
          this.props.isExpired && (
            <div className='oauth2-token-details-warning'>
              <div className='oauth2-token-details-warning__icon'>
                <WarningIcon size='sm' />
              </div>
              <div className='oauth2-token-details-warning__message'>
                This token has expired
              </div>
            </div>
          )
}
        <div className='oauth2-token-details-header'>
          <div className='oauth2-token-details-header__title'>
            Token Details
          </div>
          <div className='oauth2-token-details-header__action-group'>
            <Button
              disabled={isAccessTokenMissing}
              type='primary'
              size='small'
              onClick={this.props.onUseToken.bind(this, token)}
            >
              Use Token
            </Button>
          </div>
        </div>
        <div className={this.getTokenItemClasses()}>
          <div className='oauth2-token-details-item-group__label'>
            Token Name
          </div>
          <div className='oauth2-token-details-item-group__value'>
            <InlineInput
              ref='tokenName'
              allowEmpty={false}
              editable
              value={token.name}
              onToggleEdit={this.toggleNameEdit.bind(this)}
              onSubmit={this.handleNameChange}
            />
            {
              this.state.showEditNameToggle && (
                <div className='oauth2-token-details-item-group__value-edit-button'>
                  <Button onClick={this.toggleNameEdit.bind(this, true)}>
                    <EditIcon size='xs' />
                  </Button>
                </div>
              )
}
          </div>
        </div>
        <div className={this.getTokenItemClasses(isAccessTokenMissing)}>
          <div className='oauth2-token-details-item-group__label'>
            Access Token
            {isAccessTokenMissing && (
              <InfoButton
                tooltip={(
                  <span>
                    <span className='oauth2-token-details-tooltip__highlight'>access_token</span>
                    {' '}
not found in the response. If the access token value is present elsewhere in the response,
you can copy and use that in the Access Token input field.
                  </span>
                )}
                type='error'
              />
            )}
          </div>
          <div className='oauth2-token-details-item-group__value'>
            {token.access_token}
          </div>
        </div>
        {token.token_type && (
          <div className={this.getTokenItemClasses(isTokenTypeIncorrect)}>
            <div className='oauth2-token-details-item-group__label'>
              Token Type
              {isTokenTypeIncorrect && (
                <WarningButton
                  tooltip={(
                    <span>
                      This token type is only partially supported by Postman.
                      Your authorization header will continue to be prefixed with
                      {' '}
                      <span className='oauth2-token-details-tooltip__highlight'>Bearer</span>
.
                    </span>
                  )}
                  tooltipPlacement='right'
                />
              )}
            </div>
            <div className='oauth2-token-details-item-group__value'>
              {token.token_type}
            </div>
          </div>
        )}
        {
          _.map(maskedToken, (value, key) => (
            <div
              className={this.getTokenItemClasses()}
              key={key}
            >
              <div className='oauth2-token-details-item-group__label'>
                {key}
              </div>
              <div className='oauth2-token-details-item-group__value'>
                {this.beautifyTokenField(value)}
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}
