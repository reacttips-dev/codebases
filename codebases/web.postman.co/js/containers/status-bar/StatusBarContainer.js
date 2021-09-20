import React, { Component } from 'react';
import { observer } from 'mobx-react';
import StatusBar from '../../models/status-bar/StatusBar';
import plugins from '../../components/status-bar/plugins';

import PluginInterface from '../../plugins/PluginInterface';
import Item from '../../components/status-bar/base/Item';
import Text from '../../components/status-bar/base/Text';
import Icon from '../../components/status-bar/base/Icon';
import Pane from '../../components/status-bar/base/Pane';
import Drawer from '../../components/status-bar/base/Drawer';

import {
  REQUESTER_TAB_LAYOUT_1_COLUMN,
  REQUESTER_TAB_LAYOUT_2_COLUMN
} from '@@runtime-repl/request-http/RequesterTabLayoutConstants';

import XPath from '../../components/base/XPaths/XPath';

let PluginEnvironment = {
  React,
  PluginInterface,
  StatusBarComponents: {
    Item,
    Text,
    Icon,
    Pane,
    Drawer
  },
  constants: {
    layout: {
      REQUESTER_TAB_LAYOUT_1_COLUMN,
      REQUESTER_TAB_LAYOUT_2_COLUMN
    }
  }
};

@observer
export default class StatusBarContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      items: [],
      activeItem: null
    };

    this.addItem = this.addItem.bind(this);
    this.addItems = this.addItems.bind(this);
    this.toggleActive = this.toggleActive.bind(this);
    this.items = null;
  }

  componentDidMount () {
    StatusBar.initialize();
    StatusBar.loadPlugins(plugins);
  }

  UNSAFE_componentWillMount () {
    StatusBar.on('loadedPlugins', this.addItems);
    StatusBar.on('add', this.addItem);
  }

  componentWillUnmount () {
    StatusBar.off('loadedPlugins', this.addItems);
    StatusBar.off('add', this.addItem);
    this.items = null;
  }

  addItem (item) {
    this.items.push({
      item: item,
      component: item.getComponent(PluginEnvironment)
    });
    let items = _.concat(this.state.items, item);
    this.setState({ items });
  }

  addItems (items) {
    this.items = _.map(plugins, (item) => {
      return {
        item: item,
        component: item.getComponent(PluginEnvironment)
      };
    });
    this.setState({ items });
  }

  toggleActive (item) {
    this.setState({ activeItem: this.state.activeItem === item ? null : item });
  }

  render () {
    return (
      <XPath identifier='statusBar'>
        <div className='status-bar-container status-bar'>
          <div className='sb-section'>
            {
              _.map(this.items, (item, index) => {
                return React.createElement(item.component, {
                  key: index,
                  isOpen: _.isEqual(this.state.activeItem, item.item.name),
                  toggleActive: this.toggleActive.bind(this, item.item.name)
                });
              })
            }
          </div>
        </div>
      </XPath>
    );
  }
}
