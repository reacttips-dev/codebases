import React, { Component } from 'react';
import classes from 'classnames';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalContent } from '@postman-app-monolith/renderer/js/components/base/Modals';
import {
  Dropdown, DropdownButton, DropdownMenu, MenuItem
} from '@postman-app-monolith/renderer/js/components/base/Dropdowns';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import DeleteIcon from '@postman-app-monolith/renderer/js/components/base/Icons/DeleteIcon';
import OAuth2TokenDetails from './OAuth2TokenDetails';

const DELETE_OPTIONS = [
  { action: 'delete_expired', name: 'Expired tokens' },
  { action: 'delete_all', name: 'All tokens' }
];

export default class OAuth2ManageAccessTokensModal extends Component {
  constructor (props) {
    super(props);
    this.handleDeleteToken = this.handleDeleteToken.bind(this);
    this.handleBulkDelete = this.handleBulkDelete.bind(this);
  }

  getCustomStyles () {
    return {
      marginTop: '20vh',
      width: '800px',
      height: '80vh',
      maxHeight: '450px'
    };
  }

  getSidebarItemClasses (token) {
    const { selectedTokenId } = this.props;

    return classes({
      'oauth2-manage-tokens-sidebar__item': true,
      'oauth2-manage-tokens-sidebar__item--active': selectedTokenId && (selectedTokenId === token.id)
    });
  }

  handleDeleteToken (token, e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.onSavedAccessTokenDelete(token);
  }

  handleBulkDelete (action) {
    switch (action) {
      case 'delete_expired':
        this.props.deleteExpired();
        break;

      case 'delete_all':
        this.props.deleteAll();
        break;

      default:
    }
  }

  render () {
    const { savedOAuth2Tokens } = this.props,
      { selectedTokenId } = this.props;

    let selectedToken;

    selectedTokenId && (selectedToken = _.find(savedOAuth2Tokens, ['id', this.props.selectedTokenId]));

    return (
      <Modal
        className='oauth2-manage-tokens-modal'
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onClose}
        customStyles={this.getCustomStyles()}
      >
        <ModalHeader>MANAGE ACCESS TOKENS</ModalHeader>
        <ModalContent>
          <div className='oauth2-manage-tokens-sidebar'>
            <div className='oauth2-manage-tokens-sidebar__header'>
              <div>All Tokens</div>
              <Dropdown
                className='oauth2-manage-tokens-sidebar__bulk-delete-actions'
                onSelect={this.handleBulkDelete}
              >
                <DropdownButton type='text'>
                  <Button>Delete</Button>
                </DropdownButton>
                <DropdownMenu align-right>
                  {
                    DELETE_OPTIONS.map((menuItem) => (
                      <MenuItem
                        key={menuItem.action}
                        refKey={menuItem.action}
                      >
                        <span>{menuItem.name}</span>
                      </MenuItem>
                    ))
                  }
                </DropdownMenu>
              </Dropdown>
            </div>
            {
              _.map(savedOAuth2Tokens, (token) => {
                const isExpired = _.invoke(pm.oAuth2Tokens.get(token.id), 'isExpired');

                return (
                  <div
                    className={this.getSidebarItemClasses(token)}
                    key={token.id}
                    onClick={this.props.onTokenSelect.bind(this, token)}
                  >
                    <div className='oauth2-manage-tokens-sidebar__token-name-wrapper'>
                      <div className={`oauth2-manage-tokens-sidebar__token-name ${isExpired ? 'oauth2-manage-tokens-sidebar__token-name--expired' : ''}`}>
                        {token.name}
                      </div>
                      <DeleteIcon
                        className='oauth2-token-delete-icon'
                        size='xs'
                        onClick={this.handleDeleteToken.bind(this, token)}
                      />
                    </div>
                  </div>
                );
              })
            }
          </div>
          <div className='oauth2-manage-tokens-description'>
            {
              selectedToken &&
              (
                <OAuth2TokenDetails
                  token={selectedToken}
                  onUseToken={this.props.onUseToken}
                  onUpdateToken={this.props.onSavedAccessTokenUpdate}
                  isExpired={_.invoke(pm.oAuth2Tokens.get(selectedToken.id), 'isExpired')}
                />
              )
            }
          </div>
        </ModalContent>
      </Modal>
    );
  }
}

OAuth2ManageAccessTokensModal.propTypes = { savedOAuth2Tokens: PropTypes.array.isRequired };
