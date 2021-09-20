import TwoPaneIcon from '../../components/base/Icons/TwoPaneIcon';
import SinglePaneIcon from '../../components/base/Icons/SinglePaneIcon';

export default {
  name: 'TwoPane',
  position: 'right',
  getComponent: function ({
    React,
    PluginInterface,
    StatusBarComponents,
    constants
  }) {
    return class TwoPane extends React.Component {
      constructor (props) {
        super(props);
        this.state = { layout: PluginInterface.get('layout') };
      }

      UNSAFE_componentWillMount () {
        PluginInterface.register('layout', this.handleLayout, this);
      }

      handleLayout (payload) {
        this.setState({ layout: payload });
      }

      handleClick () {
        PluginInterface.toggleTwoPaneLayout();
      }

      getShortcut () {
        let platform = PluginInterface.get('platform');
        if (_.includes(platform, 'Mac')) {
          return '⌥⌘V';
        }
        else {
          return 'Ctrl + Alt + V';
        }
      }

      getTooltipContent (isTwoPane) {
        // when  Pane view switcher is relevant for the current Tab
        return `${isTwoPane ? 'Single pane view' : 'Two pane view'} (${this.getShortcut()})`;
      }

      getIcon () {
        let activeTheme = PluginInterface.get('theme'),
            layout = this.state.layout,
            { REQUESTER_TAB_LAYOUT_1_COLUMN, REQUESTER_TAB_LAYOUT_2_COLUMN } = constants.layout;

        if (_.isEqual(layout, REQUESTER_TAB_LAYOUT_2_COLUMN)) {
          return (
            <SinglePaneIcon size='xs' />
          );
        }
        else {
          return (
            <TwoPaneIcon size='xs' />
          );
        }
      }

      render () {
        const { Item, Icon } = StatusBarComponents,
            { REQUESTER_TAB_LAYOUT_2_COLUMN } = constants.layout,
            isTwoPane = (this.state.layout === REQUESTER_TAB_LAYOUT_2_COLUMN),
            tooltipContent = this.getTooltipContent(isTwoPane);

        return (
          <Item
            className={`plugin__layout ${isTwoPane ? 'single-pane' : 'two-pane'}`}
            tooltip={tooltipContent}
          >
            <Icon
              onClick={this.handleClick}
              icon={this.getIcon()}
            />
          </Item>
        );
      }
    };
  }
};

