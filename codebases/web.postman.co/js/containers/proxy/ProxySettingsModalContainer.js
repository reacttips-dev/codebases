import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../components/base/Modals';
import { Button } from '../../components/base/Buttons';
import KeyMaps from '../../components/base/keymaps/KeyMaps';
import ProxySettingsTabs from '../../components/proxy/ProxySettingsTabs';
import ProxySettingsTabContents from '../../components/proxy/ProxySettingsTabContents';
import ProxySettingsTabContent from '../../components/proxy/ProxySettingsTabContent';
import ProxySettingsConnection from '../../components/proxy/ProxySettingsConnection';
import ProxySettingsFilters from '../../components/proxy/ProxySettingsFilters';
import InterceptorSettingsTab from '../../components/interceptor/InterceptorSettingsTab';

const STATUS_CONNECTING = 'connecting';
const STATUS_CONNECTED = 'connected';
const STATUS_DISCONNECTING = 'disconnecting';
const STATUS_DISCONNECTED = 'disconnected';
const DEFAULT_PORT = 5555;

import { getStore } from '../../stores/get-store';

@pureRender
export default class ProxySettingsModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      activeTab: 'Connection',
      connection: {
        port: DEFAULT_PORT,
        selectedTarget: {
          id: 'history',
          name: 'History'
        },
        filterItems: [],
        status: STATUS_DISCONNECTED
      },
      filters: {
        url: '',
        url_disabled: '',
        methods: ''
      }
    };

    this.openModal = this.toggleOpen.bind(this, true);
    this.closeModal = this.toggleOpen.bind(this, false);
    this.handleTabSelect = this.handleTabSelect.bind(this);

    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleFilterSave = this.handleFilterSave.bind(this);

    this.handleTargetSelect = this.handleTargetSelect.bind(this);
    this.handleConnect = this.handleConnect.bind(this);
    this.handlePortChange = this.handlePortChange.bind(this);
    this.handleCancelTargetSelect = this.handleCancelTargetSelect.bind(this);
    this.getFilterItems = this.getFilterItems.bind(this);
    this.handleProxyConnectionAttemptSuccess = this.handleProxyConnectionAttemptSuccess.bind(this);
    this.handleProxyConnectionAttemptFailed = this.handleProxyConnectionAttemptFailed.bind(this);
    this.handleProxyDisConnectionAttemptSuccess = this.handleProxyDisConnectionAttemptSuccess.bind(this);
    this.handleProxyDisConnectionAttemptFailed = this.handleProxyDisConnectionAttemptFailed.bind(this);
  }

  /** Public API's **/

  UNSAFE_componentWillMount () {
    this.model = pm.tcpReader;
    this.attachListeners();
  }

  componentWillUnmount () {
    this.detachListeners();
    this.model = null;
  }

  attachListeners () {
    pm.mediator.on('proxyStartSuccess', this.handleProxyConnectionAttemptSuccess, this);
    pm.mediator.on('proxyStartFailure', this.handleProxyConnectionAttemptFailed, this);
    pm.mediator.on('proxyStopSuccess', this.handleProxyDisConnectionAttemptSuccess, this);
    pm.mediator.on('proxyStopFailure', this.handleProxyDisConnectionAttemptFailed, this);

    pm.mediator.on('openProxySettingsModal', this.openModal);
    pm.mediator.on('closeProxySettingsModal', this.closeModal);
  }

  detachListeners () {
    pm.mediator.off('proxyStartSuccess', this.handleProxyConnectionAttemptSuccess);
    pm.mediator.off('proxyStartFailure', this.handleProxyConnectionAttemptFailed);
    pm.mediator.off('proxyStopSuccess', this.handleProxyDisConnectionAttemptSuccess);
    pm.mediator.off('proxyStopFailure', this.handleProxyDisConnectionAttemptFailed);

    pm.mediator.off('openProxySettingsModal', this.openModal);
    pm.mediator.off('closeProxySettingsModal', this.closeModal);
  }

  getCustomStyles () {
    return {
      marginTop: '15vh',
      height: '70vh'
    };
  }

  getKeyMapHandlers () {
    if (this.state.activeTab === 'Filters') {
      return { 'submit': pm.shortcuts.handle('submit', this.handleFilterSave) };
    }
    return { 'submit': pm.shortcuts.handle('submit', this.handleConnect) };
  }

  toggleOpen (isOpen) {
    this.setState({ isOpen: isOpen || !this.state.isOpen }, () => {
      this.state.isOpen && this.setInitialValues();
    });
  }

  handleTabSelect (id) {
    if (id === this.state.activeTab) {
      return;
    }

    this.setState({ activeTab: id });
  }

  setInitialValues () {
    this.setState((prevState) => {
      return {
        filters: this.model.filters,
        connection: {
          ...this.state.connection,
          filterItems: this.getFilterItems(getStore('ActiveWorkspaceStore').collections),
          status: this.model.status === 'connected' ? STATUS_CONNECTED : prevState.connection.status,
          port: pm.settings.getSetting('proxyPort') || DEFAULT_PORT
        }
      };
    });
  }

  /** Filter API's **/

  handleFilterSave () {
    let model = this.model;
    model.filters = this.state.filters;
    model.save();
    this.closeModal();
  }

  handleFilterChange (key, value) {
    this.setState({
      filters: {
        ...this.state.filters,
        [key]: value
      }
    });
  }

  /** Connections API's **/

  handleTargetSelect (value) {
    this.setState({
      connection: {
        ...this.state.connection,
        selectedTarget: { id: value.id }
      }
    });
  }

  handleConnect () {
    let model = this.model,
        target = this.state.connection.selectedTarget;

    if (target === null) {
      pm.toasts.error('Select a target to proceed');
      return;
    }

    _.assign(model, {
      target_type: target.id === 'history' ? 'history' : 'collection',
      target_id: target.id === 'history' ? 'history' : target.id,
      port: this.state.connection.port
    });
    model.save();

    if (this.state.connection.status === STATUS_CONNECTED) {
      model.disconnect();
      this.setState({
        connection: {
          ...this.state.connection,
          status: STATUS_DISCONNECTING
        }
      });
    }
    else if (this.state.connection.status === STATUS_DISCONNECTED) {
      model.connect();
      this.setState({
        connection: {
          ...this.state.connection,
          status: STATUS_CONNECTING
        }
      });
    }
  }

  handlePortChange (value) {
    this.setState({
      connection: {
        ...this.state.connection,
        port: value
      }
    });

    pm.settings.setSetting('proxyPort', value);
  }

  handleCancelTargetSelect () {
    this.setState({
      connection: {
        ...this.state.connection,
        selectedTarget: null
      }
    });
  }

  getFilterItems (collections) {
    let historyObjArray = [{
      meta: {
        id: 'history',
        name: 'History'
      }
    }];
    let filterItems = _.chain(collections)
      .filter((collection) => getStore('PermissionStore').can('edit', 'collection', collection.id))
      .map((collection) => {
        let collectionItem = {
          meta: {
            type: 'collection',
            id: collection.id,
            name: 'Collection: ' + collection.name
          }
        };
        return collectionItem;
      })
      .value();

    return historyObjArray.concat(filterItems);
  }

  handleProxyConnectionAttemptSuccess () {
    this.setState({
      connection: {
        ...this.state.connection,
        status: STATUS_CONNECTED
      }
    });
    pm.toasts.success('Proxy Connected');
    this.closeModal();
  }

  handleProxyConnectionAttemptFailed () {
    pm.toasts.error('Proxy Connection failed');
    this.setState({
      connection: {
        ...this.state.connection,
        status: STATUS_DISCONNECTED
      }
    });
  }

  handleProxyDisConnectionAttemptSuccess () {
    pm.toasts.success('Proxy Disconnected');
    this.setState({
      connection: {
        ...this.state.connection,
        status: STATUS_DISCONNECTED
      }
    });
  }

  handleProxyDisConnectionAttemptFailed () {
    pm.toasts.error('Proxy Disconnection failed');
    this.setState({
      connection: {
        ...this.state.connection,
        status: STATUS_CONNECTED
      }
    });
  }

  render () {
    let status = this.state.connection.status;
    return (
      <Modal
        className='proxy-modal'
        customStyles={this.getCustomStyles()}
        isOpen={this.state.isOpen}
        onRequestClose={this.closeModal}
      >
        <ModalHeader>CAPTURE</ModalHeader>
        <ModalContent>
          <KeyMaps keyMap={pm.shortcuts.getShortcuts()} handlers={this.getKeyMapHandlers()}>
            <div className='settings-container notification-panel-list'>
              <ProxySettingsTabs
                activeTab={this.state.activeTab}
                onSelect={this.handleTabSelect}
              />
              <ProxySettingsTabContents
                activeKey={this.state.activeTab}
              >
                <ProxySettingsTabContent key='Connection'>
                  <ProxySettingsConnection
                    {...this.state.connection}
                    onCancelTargetSelect={this.handleCancelTargetSelect}
                    onPortChange={this.handlePortChange}
                    onTargetSelect={this.handleTargetSelect}
                  />
                  <ProxySettingsFilters
                    filters={this.state.filters}
                    onFilterChange={this.handleFilterChange}
                  />
                </ProxySettingsTabContent>
                <ProxySettingsTabContent key='Cookies'>
                  <InterceptorSettingsTab />
                </ProxySettingsTabContent>
              </ProxySettingsTabContents>
            </div>
          </KeyMaps>
        </ModalContent>
        <ModalFooter>
          {
          this.state.activeTab === 'Connection' &&
            <div>
              {
              _.isEqual(status, STATUS_CONNECTING) &&
                <Button type='primary'>
                  Connecting
                </Button>
            }
              {
              _.isEqual(status, STATUS_CONNECTED) &&
                <Button
                  type='primary'
                  onClick={this.handleConnect}
                >
                  Disconnect
                </Button>
            }
              {
              _.isEqual(status, STATUS_DISCONNECTING) &&
                <Button type='primary'>
                  Disconnecting
                </Button>
            }
              {
              _.isEqual(status, STATUS_DISCONNECTED) &&
                <Button
                  type='primary'
                  onClick={this.handleConnect}
                >
                  Connect
                </Button>
            }
            </div>
        }
          {
          this.state.activeTab === 'Filters' &&
            <Button
              type='primary'
              onClick={this.handleFilterSave}
            >Save</Button>
        }
        </ModalFooter>
      </Modal>
    );
  }
}
