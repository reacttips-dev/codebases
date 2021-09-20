import React, { Component } from 'react';
import { Text, Heading } from '@postman/aether';
import { Button } from '../base/Buttons';
import { Input } from '../base/Inputs';
import { InputSelectV2 } from '../base/InputSelectV2';
import BrowserActiveTrackService from '../../services/BrowserActiveTrackService';
import WebSocketProxy from '../../services/WebSocketProxyService';

export default class SettingsDevOptions extends Component {
  constructor (props) {
    super(props);

    this.state = {
      activeTrack: BrowserActiveTrackService.getCurrentTrack(),
      tracksList: BrowserActiveTrackService.getActiveTracks()
    };

    this.handleTrackUpdate = this.handleTrackUpdate.bind(this);
    this.handleTrackSubmit = this.handleTrackSubmit.bind(this);
    this.handleWebSocketProxyUpdate = this.handleWebSocketProxyUpdate.bind(this);
    this.handleWebSocketProxySubmit = this.handleWebSocketProxySubmit.bind(this);
  }

  componentDidMount () {
    (async () => {
      const proxies = await WebSocketProxy.getProxies();

      this.setState({
        webSocketProxies: proxies,
        webSocketProxy: WebSocketProxy.getCurrentProxy()
      });
    })();
  }

  handleTrackUpdate (track) {
    if (!track) {
      return;
    }

    track = (typeof track === 'string') ? track : track.value;

    this.setState({
      activeTrack: track
    });
  }

  handleTrackSubmit () {
    BrowserActiveTrackService.setCurrentTrackAndRefresh(this.state.activeTrack);
  }

  handleWebSocketProxySubmit () {
    if (WebSocketProxy.isValidWebSocketProxy(this.state.webSocketProxy)) {
      WebSocketProxy.switchWebSocketProxy(this.state.webSocketProxy);

      return pm.toasts.success(`Connected to ${this.state.webSocketProxy.name}`);
    }

    pm.logger.error('DevSettings~WebSocketProxy~Invalid Proxy', this.state.webSocketProxy);
    return pm.toasts.error('Error establishing connection to websocket proxy');
  }

  handleWebSocketProxyUpdate (server) {
    if (!WebSocketProxy.isValidWebSocketProxy(server && server.value)) {
      return;
    }

    this.setState({
      webSocketProxy: server.value
    });
  }

  getMenuObject (menuEntry) {
    return {
      id: menuEntry,
      value: menuEntry
    };
  }

  getWebSocketProxy (server) {
    return {
      id: server.name,
      value: server
    };
  }

  render () {
    let activeTrack = this.state.activeTrack || '',
        tracksList = this.state.tracksList || [],
        webSocketProxies = this.state.webSocketProxies || [],
        webSocketProxy = this.state.webSocketProxy || {};

    return (
      <div className='settings-dev-options-wrapper'>
        <div className='settings-dev-options-header'>
          <Heading text='Postman Developer Options' type='h3' styleAs='h5' />
          <div className='settings-dev-options-header-help-text'>
            <Text type='para'>These options are available to only internal Postman employees on the beta build.</Text>
          </div>
        </div>

        <div className='settings-dev-options-list'>
          <div className='settings-dev-options-list-item'>
            <div className='settings-dev-options-list-item-label'>
              <Heading type='h3' text='Active Track' styleAs='h5' className='settings-dev-options-active-menu-item' />
              <Button
                type='text'
                tooltip='Reset the active track to default'
                tooltipPlacement='top'
                onClick={this.handleTrackUpdate.bind(this, 'default')}
              >
                <Text>Reset</Text>
              </Button>
              <div className='settings-dev-options-list-item-help-text'>
                <Text type='para'>
                  This setting can be used to switch the currently active track. You can choose from the list of pre-defined options or give a custom value.
                </Text>
              </div>
            </div>
            <div className='settings-dev-options-list-item-value'>
              <InputSelectV2
                className='settings-dev-select-menu'
                selectedItem={this.getMenuObject(activeTrack)}
                getInputValue={(item) => item.value}
                optionRenderer={(item) => (<div>{item.value}</div>)}
                getFilteredList={() => tracksList.map((track) => { return this.getMenuObject(track); })}
                onSelect={this.handleTrackUpdate}
                onChange={_.debounce(this.handleTrackUpdate, 100)}
              />
              <Button
                className='settings-dev-submit-button'
                type='primary'
                tooltip='Set active track and refresh the page'
                onClick={this.handleTrackSubmit}
              >
                  Update and Refresh
                </Button>
            </div>
          </div>
        </div>

        <div className='settings-dev-options-list'>
          <div className='settings-dev-options-list-item'>
            <div className='settings-dev-options-list-item-label'>
              <Heading type='h3' text='Websocket proxy' styleAs='h5' className='settings-dev-options-active-option' />
              <div className='settings-dev-options-list-item-help-text'>
                <Text type='para'>
                  This setting can be used to connect to a custom websocket proxy instead of bifrost.
                </Text>
              </div>
            </div>
            <div className='settings-dev-options-list-item-value'>
              <InputSelectV2
                className='settings-dev-select-menu'
                selectedItem={this.getWebSocketProxy(webSocketProxy)}
                getInputValue={(item) => item.id}
                optionRenderer={(item) => (<div>{item.id}</div>)}
                getFilteredList={() => webSocketProxies.map((server) => { return this.getWebSocketProxy(server); })}
                onSelect={this.handleWebSocketProxyUpdate}
                onChange={_.debounce(this.handleWebSocketProxyUpdate, 100)}
              />
              <Button
                className='settings-dev-submit-button'
                type='primary'
                tooltip='Set websocket proxy system'
                onClick={this.handleWebSocketProxySubmit}
              >
                  Switch Proxy
                </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
