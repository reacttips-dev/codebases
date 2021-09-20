import { Icon as IconElement } from '@postman/aether';
import BrowserActiveTrackService from '../../services/BrowserActiveTrackService';

export default {
  name: 'BrowserActiveTrackSelection',
  position: 'right',

  getComponent: function ({
    React,
    PluginInterface,
    StatusBarComponents
  }) {
    return class BrowserActiveTrackSelection extends React.Component {
      constructor (props) {
        super(props);

        this.state = {
          activeTrack: BrowserActiveTrackService.getCurrentTrack()
        };
      }

      handleClick () {
        PluginInterface.openModal('settings', { tab: 'devOptions' });
      }

      render () {
        let { Item, Text } = StatusBarComponents;

        return (
          <Item
            className='plugin__activeTrack'
            tooltip='Switch Active Track'
          >
            <Text
              render={() => {
                return (
                  <div
                    className='active-track-button'
                    onClick={this.handleClick}
                  >
                    <IconElement name='icon-action-tag-stroke' size='small' />
                    <span className='active-track-label'>
                      {this.state.activeTrack}
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
