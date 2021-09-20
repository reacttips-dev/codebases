import { Icon } from '@postman/aether';
import {
  DOCS_URL,
  DOCS_SECURITY_URL,
  SUPPORT_URL,
  TWITTER_URL,
  POSTMAN_COMMUNITY
} from '../../constants/AppUrlConstants';

export default {
  name: 'Help',
  position: 'right',

  getComponent: function ({
    React,
    PluginInterface,
    StatusBarComponents
  }) {
    class Help extends React.Component {
      constructor (props) {
        super(props);
      }

      handleItemSelect (item) {
        switch (item) {
          case 'releases':
            PluginInterface.openModal('release-notes');
            break;
          case 'shortcuts':
            PluginInterface.openModal('settings', { tab: 'shortcuts' });
            break;
          case 'docs':
            PluginInterface.openURL(DOCS_URL);
            break;
          case 'security':
            PluginInterface.openURL(DOCS_SECURITY_URL);
            break;
          case 'support':
            PluginInterface.openURL(SUPPORT_URL);
            break;
          case 'twitter':
            PluginInterface.openURL(TWITTER_URL);
            break;
          case 'community':
            PluginInterface.openURL(POSTMAN_COMMUNITY);
            break;
          default:
            break;
        }
      }

      getIcon () {
        return (
          <Icon name='icon-state-help-stroke' size='small' />
        );
      }

      render () {
        let { Item, Icon, Drawer } = StatusBarComponents;

        return (
          <Item
            className='plugin__help'
            tooltip='Help & Feedback'
            {...this.props}
          >
            <Drawer
              className='plugin__help__drawer'
              button={() => {
                return (
                  <Icon
                    className='plugin__help__icon'
                    icon={this.getIcon()}
                  />
                );
              }}
              onSelect={this.handleItemSelect}
              items={[
                ...(window.SDK_PLATFORM !== 'browser' ? [{
                  key: 'releases',
                  label: 'Release Notes'
                }] : []),
                {
                  key: 'docs',
                  label: 'Documentation'
                },
                {
                  key: 'security',
                  label: 'Security'
                },
                {
                  key: 'support',
                  label: 'Support'
                },
                {
                  key: 'twitter',
                  label: '@getpostman'
                },
                {
                  key: 'community',
                  label: 'Community'
                },
                {
                  key: 'shortcuts',
                  label: 'Keyboard Shortcuts'
                }
              ]}
            />
          </Item>
        );
      }
    }

    return Help;
  }
};
