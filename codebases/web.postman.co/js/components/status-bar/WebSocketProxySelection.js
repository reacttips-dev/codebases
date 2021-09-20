import { Icon as IconElement } from '@postman/aether';
import { observer } from 'mobx-react';
import WebSocketProxyService from '../../services/WebSocketProxyService';

export default {
  name: 'WebSocketProxySelection',
  position: 'right',

  getComponent: function ({
    React,
    PluginInterface,
    StatusBarComponents
  }) {
    return class WebSocketProxySelection extends React.Component {
      constructor (props) {
        super(props);

        this.state = {
          webSocketServer: WebSocketProxyService.getCurrentProxy()
        };

        pm.windowEvents.addListener('dev-settings-websocket-proxy-update',
          this.updateWebSocketProxy.bind(this));
      }

      handleClick () {
        PluginInterface.openModal('settings', { tab: 'devOptions' });
      }

      updateWebSocketProxy () {
        this.setState({
          webSocketServer: WebSocketProxyService.getCurrentProxy()
        });
      }

      render () {
        let { Item, Text } = StatusBarComponents;

        return (
          <Item
            className='plugin__activeTrack'
            tooltip='Switch Web Socket Proxxy'
          >
            <Text
              render={() => {
                return (
                  <div
                    className='active-track-button'
                    onClick={this.handleClick}
                  >
                    <IconElement name='icon-state-connectionSecure-stroke' size='small' />
                    <span className='active-track-label'>
                      {this.state.webSocketServer.name}
                    </span>
                  </div>
                );
              }}
            />
          </Item>
        );
      }
    };
  }
};
