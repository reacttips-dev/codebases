import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import OAuth2ManageAccessTokensModal from './OAuth2ManageAccessTokensModal';

@pureRender
export default class OAuth2ManageTokensModalContainer extends Component {
  constructor (props) {
    super(props);
    this.model = pm.oAuth2Manager;
    this.state = {
      isOpen: false,
      selectedTokenId: null,
      savedOAuth2Tokens: [],
      oauth2EditorsObject: {
        accessTokenUrl: '',
        authUrl: '',
        client_authentication: 'header',
        clientId: '',
        clientSecret: '',
        grant_type: 'authorization_code',
        name: '',
        password: '',
        redirect_uri: '',
        scope: '',
        showPassword: false,
        state: '',
        username: ''
      }
    };

    this.setInitialState = this.setInitialState.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleUpdateToken = this.handleUpdateToken.bind(this);
    this.handleDeleteToken = this.handleDeleteToken.bind(this);
    this.handleNewToken = this.handleNewToken.bind(this);
    this.handleTokenSelect = this.handleTokenSelect.bind(this);
    this.handleUseToken = this.handleUseToken.bind(this);
    this.handleDeleteAll = this.handleDeleteAll.bind(this);
    this.handleDeleteExpired = this.handleDeleteExpired.bind(this);
  }

  UNSAFE_componentWillMount () {
    this.model.on('change', this.setInitialState);
    this.attachModelListeners();
    this.setInitialState();
  }

  componentWillUnmount () {
    this.model.off('change', this.setInitialState);
    this.detachModelListeners();
  }

  getCustomStyles () {
    return {
      marginTop: '20vh',
      width: '800px',
      height: '55vh',
      maxHeight: '400px'
    };
  }

  setInitialState () {
    const state = {
      oauth2EditorsObject: this.model.get('oAuth2'),
      savedOAuth2Tokens: this.model.get('savedOAuth2Tokens')
    };

    this.setState(state);
  }

  attachModelListeners () {
    pm.mediator.on('openNewOAuth2Token', this.handleNewToken);
    pm.mediator.on('openManageTokensModal', this.handleOpen);
  }

  detachModelListeners () {
    pm.mediator.off('openNewOAuth2Token', this.handleNewToken);
    pm.mediator.off('openManageTokensModal', this.handleOpen);
  }

  handleNewToken (token, callback) {
    this._callback = callback;

    this.setState({
      selectedTokenId: token && token.id,
      isOpen: true
    });
  }

  handleOpen (opts, callback) {
    this._callback = callback;

    this.setState((prev) => ({
      isOpen: true,
      selectedTokenId: prev.savedOAuth2Tokens && prev.savedOAuth2Tokens.id
    }));
  }

  handleClose () {
    this._callback = null;
    this.setState({ isOpen: false });
  }

  handleUpdateToken (updatedToken) {
    this.model.updateOAauth2Token(updatedToken);
  }

  handleDeleteToken (token) {
    const { savedOAuth2Tokens } = this.state;

    let nextState;

    // Do nothing if token being deleted is not the token in view
    if (token.id !== this.state.selectedTokenId) {
      nextState = {};
    } else { // Set the view to the next token in list
      // Remove token being deleted from the list
      const newTokenList = _.reject(savedOAuth2Tokens, ['id', token.id]),
        tokenPosition = _.findIndex(newTokenList, ['id', token.id]),

        // Find next element to select
        tokenToSelect = _.nth(newTokenList, tokenPosition + 1) || _.first(newTokenList);

      // Move selection to next item if possible, close modal id all items are removed,
      nextState = tokenToSelect ? { selectedTokenId: tokenToSelect.id } : { isOpen: false };
    }

    this.setState(
      nextState,
      () => {
        this.model.processOAuth2DeleteToken(token);
      }
    );
  }

  handleDeleteAll () {
    this.model.deleteAllTokens(() => {
      // No tokens left. Close the modal.
      this.setState({ isOpen: false });
    });
  }

  handleDeleteExpired () {
    this.model.deleteExpiredTokens(() => {
      const remainingTokens = this.model.get('savedOAuth2Tokens');

      if (remainingTokens.length) {
        // Select first from remaining tokens
        this.setState({ selectedTokenId: remainingTokens[0].id });
      } else {
        // No tokens left. Close the modal.
        this.setState({ isOpen: false });
      }
    });
  }

  handleTokenSelect (token) {
    this.setState({ selectedTokenId: token.id });
  }

  handleUseToken (token) {
    this.setState({ isOpen: false }, () => {
      _.isFunction(this._callback) && this._callback(token);
    });
  }

  render () {
    const { oauth2EditorsObject } = this.state;

    return (
      <OAuth2ManageAccessTokensModal
        isOpen={this.state.isOpen}
        oAuth2={oauth2EditorsObject}
        savedOAuth2Tokens={this.state.savedOAuth2Tokens}
        selectedTokenId={this.state.selectedTokenId}
        onClose={this.handleClose}
        onSavedAccessTokenUpdate={this.handleUpdateToken}
        onSavedAccessTokenDelete={this.handleDeleteToken}
        onTokenSelect={this.handleTokenSelect}
        onUseToken={this.handleUseToken}
        deleteAll={this.handleDeleteAll}
        deleteExpired={this.handleDeleteExpired}
      />
    );
  }
}
