import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import moment from 'moment-timezone';

import { EventList } from 'postman-collection';

import { Modal, ModalHeader, ModalContent, ModalFooter } from '../../components/base/Modals';
import { Button } from '../../components/base/Buttons';
import { Tabs, Tab } from '../../components/base/Tabs';
import AnalyticsService from '../../modules/services/AnalyticsService';
import { fetchAllTags } from './services/VersionTagService';
import { fetchAvailableRegions } from './services/MonitorRegionsService';
import NavigationService from '../../services/NavigationService';

import util from '../../utils/util';
import httpStatusCodes from '@@runtime-repl/request-http/httpstatuscodes';
import CreateNewMonitorModal from '../../components/new-button/CreateNewMonitorModal';
import { createEvent, findEvents, getEventData } from '../../modules/model-event';
import dispatchUserAction from '../../modules/pipelines/user-action';
import { CREATION_CEILING_HIT_ERROR } from '../../constants/MonitoringErrors';

import { getStore } from '../../stores/get-store';
import UserController from '../../modules/controllers/UserController';
import CollectionController from '@@runtime-repl/collection/datastores/controllers/CollectionController';

import { onChangesetResponse } from '../../modules/services/SyncChangesetEventService';
import { openAuthenticatedRoute } from '../../modules/services/APIService';
import SuccessIcon from '../../components/base/Icons/SuccessIcon';
import XPath from '../../components/base/XPaths/XPath';

import UrlService from '../../../monitors/services/UrlService';
import MasterMonitorStore from '../../../monitors/stores/domain/MasterMonitorStore';

import { when } from 'mobx';

import { MONITOR_EMAIL_VALIDATION_ERROR, MONITOR_FORM } from '../../../monitors/utils/messages';
import { OPEN_CREATE_NEW_IDENTIFIER } from '../../../onboarding/navigation/constants';

let getAllStatusList = () => {
  return _.reduce(httpStatusCodes, (acc, obj, key) => {
    acc.push({ value: `${key} ${obj.name}` });
    return acc;
  }, []);
};

let initialState = {
  monitorId: '',
  isOpen: false,
  activeStep: 1,
  loading: false,
  activeSource: 'new',
  isLoadingVersions: false,
  isLoadingRegions: false,
  enableRegionSelection: false,
  enableMinuteSelection: false,
  errorFetchingRegions: false,
  errorFetchingVersions: false,
  ownCollections: [],
  ownEnvironments: [],
  ownVersions: [],
  availableRegions: [],
  selectedRegionMode: 'auto',
  selectedOptions: {
    name: '',
    requests: [],
    tests: [{
      name: 'Check Response code',
      code: 'pm.response.to.have.status({{variable}});',
      enabled: true,
      suggestions: getAllStatusList(),
      type: 'number',
      placeholder: 'Enter response code'
    }, {
      name: 'Check Response time',
      code: 'pm.expect(pm.response.responseTime).to.be.below({{variable}});',
      enabled: true,
      postfix: 'ms',
      type: 'number',
      placeholder: 'Enter response time'
    }],
    collectionId: '',
    ownerId: '',
    environmentId: '',
    versionId: null,
    schedule: '0 0 0 * * *',
    regions: []
  },
  from: 'create_new_x',
  monitorStatus: {
    loading: true,
    error: false
  },
  collectionStatus: {
    loading: true,
    error: false
  },
  userStatus: {
    isSyncEnabled: false,
    isLoggedIn: false
  },
  saveToActivity: false,
  workspaceId: null,
  notifications: {
    enabled: false,
    recipients: []
  },
  retry: {
    enabled: false,
    attempts: 2
  },
  notificationLimit: {
    isValid: true,
    value: 3
  },
  followRedirects: true,
  strictSSL: true,
  requestTimeout: {
    enabled: false,
    timeout: 5000
  },
  requestDelay: {
    enabled: false,
    delay: 0
  },
  errors: {},
  showTooltip: false
};

const maxNotificationLimit = 99,
      maxRetryAttempts = 2,
      OFFLINE_MESSAGE = 'You can take this action once you are back online',
      EMAIL_REGEX = /^[^@]+@[^.]+\..+$/;

@observer
export default class CreateNewMonitorModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = initialState;

    this.isInvalidInput = this.isInvalidInput.bind(this);
    this.loadWorkspaceCollections = this.loadWorkspaceCollections.bind(this);
    this.loadOwnEnvironments = this.loadOwnEnvironments.bind(this);
    this.loadOwnVersions = this.loadOwnVersions.bind(this);
    this.fetchAndSetAvailableRegions = this.fetchAndSetAvailableRegions.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChangeSource = this.handleChangeSource.bind(this);

    this.handleSelectCollection = this.handleSelectCollection.bind(this);
    this.handleSelectEnvironment = this.handleSelectEnvironment.bind(this);
    this.handleTestToggle = this.handleTestToggle.bind(this);
    this.handleRequestChange = this.handleRequestChange.bind(this);
    this.handleSelectVersion = this.handleSelectVersion.bind(this);
    this.handleMonitorNameChange = this.handleMonitorNameChange.bind(this);
    this.handleMonitorScheduleChange = this.handleMonitorScheduleChange.bind(this);
    this.handleRegionSelectorChange = this.handleRegionSelectorChange.bind(this);
    this.handleRegionChange = this.handleRegionChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleOfflineRetry = this.handleOfflineRetry.bind(this);
    this.handleVersionFetchRetry = this.handleVersionFetchRetry.bind(this);
    this.handleRetry = this.handleRetry.bind(this);
    this.handleBack = this.handleBack.bind(this);

    this.constructCollection = this.constructCollection.bind(this);
    this.constructMonitor = this.constructMonitor.bind(this);

    this.handleNotificationChange = this.handleNotificationChange.bind(this);
    this.handleNotificationLimitChange = this.handleNotificationLimitChange.bind(this);
    this.handleRetryConfigChange = this.handleRetryConfigChange.bind(this);
    this.handleTimeoutChange = this.handleTimeoutChange.bind(this);
    this.handleDelayChange = this.handleDelayChange.bind(this);
    this.handleStrictSSLChange = this.handleStrictSSLChange.bind(this);
    this.handleRedirectChange = this.handleRedirectChange.bind(this);
    this.handleOpenMonitor = this.handleOpenMonitor.bind(this);
    this.handleShowTooltip = this.handleToggleTooltip.bind(this, true);
    this.handleHideTooltip = this.handleToggleTooltip.bind(this, false);

    this.enableFeatures = this.enableFeatures.bind(this);
    this.validateNotificationRecipients = this.validateNotificationRecipients.bind(this);
  }

  onClick = () => {
    this.refs.content.onClick();
  };

  handleNotificationChange (enabled, recipientIndex, recipient) {
    if (_.isUndefined(recipientIndex)) {
      this.setState({ notifications: { enabled, recipients: this.state.notifications.recipients } });
      return;
    }
    let recipients = [
      ..._.slice(this.state.notifications.recipients, 0, recipientIndex),
      recipient,
      ..._.slice(this.state.notifications.recipients, recipientIndex + 1)
    ];

    recipients = _.compact(recipients);

    this.validateNotificationRecipients(recipients);

    this.setState({
      notifications: { enabled, recipients }
    });
  }

  validateNotificationRecipients (recipients) {
    const errors = {};

    recipients.forEach((recipient, index) => {
      let error = (!!_.size(recipient) && !EMAIL_REGEX.test(recipient)) ? 'invalid' :
        (recipients.indexOf(recipient) !== index) ? 'duplicate' : false;

      errors[index] = error && {
        message: MONITOR_EMAIL_VALIDATION_ERROR[error],
        error
      };
    });

    this.setState({
      errors: {
        ...this.state.errors,
        recipients: errors
      }
    });
  }

  handleNotificationLimitChange (value) {
    this.setState({
      notificationLimit: {
        isValid: value > 0 && value <= maxNotificationLimit,
        value
      }
    });
  }

  handleRetryConfigChange (enabled, attempts = this.state.retry.attempts) {
    this.setState({
      retry: {
        enabled,
        attempts
      }
    });
  }

  handleToggleTooltip (value) {
    this.setState({
      showTooltip: value
    });
  }

  handleTimeoutChange (enabled, timeout = this.state.requestTimeout.timeout) {
    this.setState({
      requestTimeout: {
        enabled,
        timeout
      }
    });
  }

  handleDelayChange (enabled, delay = this.state.requestDelay.delay) {
    this.setState({
      requestDelay: {
        enabled,
        delay
      }
    });
  }

  handleStrictSSLChange (value) {
    this.setState({ strictSSL: !value });
  }

  handleRedirectChange (value) {
    this.setState({ followRedirects: !value });
  }

  componentDidMount () {
    pm.mediator.on('openCreateNewMonitorModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('openCreateNewMonitorModal', this.handleOpen);
  }

  getStyles () {
    return {
      marginTop: '10vh',
      height: '75vh',
      minWidth: '900px',
      width: '80vw'
    };
  }

  loadWorkspaceCollections () {
    let editableCollections = getStore('ActiveWorkspaceStore').editableCollections;
    this.setState({ ownCollections: editableCollections });
  }

  loadOwnEnvironments () {
    let ownEnvironments = getStore('ActiveWorkspaceStore').environments,
        sortedEnvironments = _.sortBy(ownEnvironments, (environment) => {
          return environment.name.toLowerCase();
        }),
        allEnvironments = _.concat({ id: null, name: 'No Environment' }, sortedEnvironments);

    this.setState({ ownEnvironments: allEnvironments });
  }

  loadOwnVersions (criteria) {
    return fetchAllTags(criteria);
  }

  handleClose () {
    this.handleSaveToActivity();
    this.setState({
      isOpen: false
    });
    this.onSuccess = null;
    this.disposer && this.disposer();
  }

  handleSaveToActivity () {
    if (!this.state.saveToActivity) {
      return;
    }
    let options = _.pick(this.state.selectedOptions, ['name', 'collectionId', 'environmentId']);
    let metaObj = {
      activeSource: this.state.activeSource,
      collectionStatus: this.state.collectionStatus,
      monitorStatus: this.state.monitorStatus,
      selectedOptions: options
    };
    pm.mediator.trigger('saveXFlowActivity', 'monitor', metaObj);
  }

  fetchAndSetAvailableRegions (defaultSelectedRegions) {
    return fetchAvailableRegions()
      .then((regions) => {
        defaultSelectedRegions.push(_.get(_.find(regions, { default: true }), 'id'));

        this.setState({
          availableRegions: regions,
          isLoadingRegions: false,
          selectedOptions: {
            ...this.state.selectedOptions,
            regions: defaultSelectedRegions
          }
        });
      })
      .catch((err) => {
        this.setState({ isLoadingRegions: false, errorFetchingRegions: true });
        pm.logger.warn('Failed to fetch regions', err);
        pm.toasts.error(_.get(err, 'message') || 'Error occurred while fetching regions');
      });
  }

  handleOpen (openState = {}, onSuccess) {
    if (this.state.isOpen) {
      return;
    }

    let shouldLoadVersions = _.get(openState, 'selectedOptions.collectionId'),
      defaultSelectedRegions = [],
      from = _.get(openState, 'from');

    // Add the user's email as default for notifications
    UserController.get()
      .then((user) => {
        this.setState({
          notifications: {
            enabled: true,
            recipients: [user.email]
          }
        });
      });

    // Check pm.billing to not be undefined and retrieve plan features from Billing API
    when(
      () => pm.billing,
      () => this.enableFeatures()
    );

    this.setState({
      ...initialState,
      ...openState,
      selectedOptions: {
        ...initialState.selectedOptions,
        ...openState.selectedOptions
      },
      availableRegions: [],
      isOpen: true,
      isLoadingRegions: true,
      isLoadingVersions: shouldLoadVersions,
      from: from
    }, () => {
      AnalyticsService.addEvent('monitor', 'initiate_create', this.state.from);
    });

    if (shouldLoadVersions) {
      return this.loadOwnVersions({ collectionUid: `${_.get(openState, 'selectedOptions.ownerId')}-${_.get(openState, 'selectedOptions.collectionId')}` })
        .then((versions) => {
          this.setState({
            ...initialState,
            ...openState,
            ownVersions: versions,
            isLoadingVersions: false,
            selectedOptions: {
              ...this.state.selectedOptions,
              versionId: _.get(versions, '0.id')
            },
            isOpen: true
          });
        })
        .catch((err) => {
          this.setState({ isLoadingVersions: false, errorFetchingVersions: true });
          pm.logger.warn('Failed to fetch tags', err);
          pm.toasts.error(_.get(err, 'message') || 'Error occurred while fetching tags');
        })

        // Avoid state reset (by loadOwnVersions) before region rendering
        .then(() => {
          this.fetchAndSetAvailableRegions(defaultSelectedRegions);
          this.onSuccess = onSuccess;
        });
    }
    else {
      this.fetchAndSetAvailableRegions(defaultSelectedRegions);
    }

    this.onSuccess = onSuccess;
  }

  handleChangeSource (activeSource) {
    this.setState({ activeSource }, () => {
      if (this.state.activeSource === 'workspace') {
        this.loadWorkspaceCollections();
      }
    });
  }

  handleSelectVersion (versionId) {
    this.setState((state) => {
      return {
        selectedOptions: {
          ...state.selectedOptions,
          versionId
        }
      };
    });
  }

  handleSelectCollection (collection) {
    let newState = {},
      defaultSelectedRegions = [];
    switch (this.state.activeSource) {
      case 'new':
        newState = {
          selectedOptions: {
            ...this.state.selectedOptions,
            collectionId: ''
          }
        };
        break;
      case 'workspace':
        newState = {
          selectedOptions: {
            ...this.state.selectedOptions,
            collectionId: collection.id,
            name: collection.name + ' 1',
            ownerId: collection.owner
          }
        };
        break;
    }

    this.setState({ isLoadingRegions: true });

    fetchAvailableRegions()
      .then((regions) => {
        defaultSelectedRegions.push(_.get(_.find(regions, { default: true }), 'id'));

        this.setState({
          ...newState,
          availableRegions: regions,

          selectedOptions: {
            ...this.state.selectedOptions,
            regions: defaultSelectedRegions
          },
          isLoadingRegions: false
        }, () => {
          this.refs.content.onCollectionSelect && this.refs.content.onCollectionSelect();
        });
      })
      .catch((err) => {
        this.setState({ isLoadingRegions: false, errorFetchingRegions: true });
        pm.logger.warn('Failed to fetch regions', err);
        pm.toasts.error(_.get(err, 'message') || 'Error occurred while fetching regions');
      });

    this.loadOwnEnvironments();

    // check for collection uid for fetching versions
    if (collection.uid) {
      this.setState({ activeStep: 2, isLoadingVersions: true, ...newState });
      this.loadOwnVersions({ collectionUid: collection.uid })
        .then((versions) => {
          this.setState({
            ...newState,
            selectedOptions: {
              ...this.state.selectedOptions,
              versionId: _.get(versions, '0.id')
            },
            isLoadingVersions: false,
            ownVersions: versions
          }, () => {
            this.refs.content.onCollectionSelect && this.refs.content.onCollectionSelect();
          });
        })
        .catch((err) => {
          this.setState({ isLoadingVersions: false, errorFetchingVersions: true });
          pm.logger.warn('Failed to fetch tags', err);
          pm.toasts.error(_.get(err, 'message') || 'Error occurred while fetching tags');
        });
      }
      else {
        this.setState({
          ...newState,
          activeStep: 2,
          isLoadingVersions: false
        }, () => {
          this.refs.content.onCollectionSelect && this.refs.content.onCollectionSelect();
        });
      }
  }

  handleSelectEnvironment (environmentId) {
    this.setState((state) => {
      return {
        selectedOptions: {
          ...state.selectedOptions,
          environmentId
        }
      };
    });
  }

  handleTestToggle (index, enabled) {
    this.setState((state) => {
      let newTests = state.selectedOptions.tests;
      newTests[index].enabled = enabled;

      return {
        selectedOptions: {
          ...state.selectedOptions,
          tests: newTests
        }
      };
    });
  }

  handleRequestChange (requests) {
    this.setState((state) => {
      let newRequests = _.map(requests, (request) => {
        return {
          url: request.url,
          method: request.method,
          body: request.body,
          description: request.description,
          tests: [
            parseInt(request.testResponseCode),
            parseInt(request.testResponseTime)
          ]
        };
      });

      return {
        selectedOptions: {
          ...state.selectedOptions,
          requests: newRequests
        }
      };
    });
  }

  handleMonitorNameChange (name) {
    this.setState((state) => {
      return {
        selectedOptions: {
          ...state.selectedOptions,
          name
        }
      };
    });
  }

  handleMonitorScheduleChange (schedule) {
    this.setState((state) => {
      return {
        selectedOptions: {
          ...state.selectedOptions,
          schedule
        }
      };
    });
  }

  handleRegionSelectorChange (regionMode) {
    this.setState({
      selectedRegionMode: regionMode
    });
  }

  handleRegionChange (regionName) {
    let regions = this.state.selectedOptions.regions;

    if (_.includes(regions, regionName)) {
      _.remove(regions, (r) => { return r === regionName; });
    }
    else {
      regions.push(regionName);
    }

    this.setState((state) => {
      return {
        selectedOptions: {
          ...state.selectedOptions,
          regions
        }
      };
    });
  }

  handleCreate () {
    if (!getStore('SyncStatusStore').isSocketConnected) {
      pm.toasts.error('Unable to create monitor');
      this.setState({ isOffline: true });
      return;
    }

    if (_.isEmpty(this.state.selectedOptions.name) || _.isEmpty(this.state.selectedOptions.regions)) {
      return;
    }

    if (_.isEmpty(this.state.selectedOptions.collectionId)) {
      this.setState({ loading: true });
      this.constructCollection((collectionId) => {
        this.disposer = onChangesetResponse({
          model: 'collection',
          action: 'import',
          modelId: collectionId
        }, (err) => {
          this.disposer();
          if (err) {
            this.setState({ loading: false });
            return;
          }

          this.constructMonitor();
        });
      });
    }
    else {
      this.constructMonitor();
    }
  }

  handleVersionFetchRetry () {
    this.setState({ isLoadingVersions: true, errorFetchingVersions: false }, () => {
      this.loadOwnVersions({
        collectionUid: `${_.get(this.state, 'selectedOptions.ownerId')}-${_.get(this.state, 'selectedOptions.collectionId')}`
      })
      .then((versions) => {
        this.setState({
          ownVersions: versions,
          isLoadingVersions: false,
          selectedOptions: {
            ...this.state.selectedOptions,
            versionId: _.get(versions, '0.id')
          }
        });
      })
      .catch((err) => {
        this.setState({ isLoadingVersions: false, errorFetchingVersions: true });
        pm.logger.warn('Failed to fetch tags', err);
        pm.toasts.error(_.get(err, 'message') || 'Error occurred while fetching tags');
      });
    });
  }

  handleRetry () {
    if (!getStore('SyncStatusStore').isSocketConnected) {
      return;
    }

    if (this.state.collectionStatus.error) {
      this.setState({
        collectionStatus: {
          error: false,
          loading: true
        },
        monitorStatus: {
          error: false,
          loading: true
        }
      }, () => {
        this.constructCollection((collectionId) => {
          this.disposer = onChangesetResponse({
            model: 'collection',
            action: 'import',
            modelId: collectionId
          }, (err) => {
            this.disposer();
            if (err) {
              return;
            }

            this.constructMonitor();
          });
        });
      });
    }
    else if (this.state.monitorStatus.error) {
      this.setState({
        monitorStatus: {
          error: false,
          loading: true
        }
      }, () => {
        this.constructMonitor();
      });
    }
  }

  handleBack (activeStep) {
    if (activeStep === 0) {
      this.handleClose();
      return NavigationService.transitionTo(OPEN_CREATE_NEW_IDENTIFIER);
    }

    this.setState({ activeStep });
  }

  handleOfflineRetry () {
    if (!getStore('SyncStatusStore').isSocketConnected) {
      return;
    }

    if (this.state.activeStep === 2) {
      this.handleCreate();
    }
  }

  enableFeatures () {
    pm.billing.onPlanFeaturesLoad()
    .then(() => {
      this.setState({
        ...this.state,
        enableMinuteSelection: _.get(pm.billing.plan.features, 'monitor_resolution_enabled', false),
        enableRegionSelection: _.get(pm.billing.plan.features, 'monitor_region_selection_enabled', false)
      });
    })
    .catch(() => {
      pm.logger.warn('Failed to fetch plan info');
      pm.toasts.error('Error occurred while fetching user plan');
    });
  }

  async constructCollection (callback) {
    let { id: ownerId } = await UserController.get(),
      collection = {
        name: this.state.selectedOptions.name,
        id: util.guid(),
        owner: ownerId
      },
      requests = _.map(this.state.selectedOptions.requests,
        (request) => {
          let tests = _.reduce(request.tests, (acc, test, testIndex) => {
                if (this.state.selectedOptions.tests[testIndex].enabled) {
                  acc.push('\t' + _.replace(this.state.selectedOptions.tests[testIndex].code, '{{variable}}', parseInt(test)));
                }
                return acc;
              }, []),

          testCode = _.join([
            'pm.test(\'Some test name\', function () {',
            ...tests,
            '})'
          ], '\n');
          return {
            id: util.guid(),
            url: request.url,
            method: request.method,
            data: request.body,
            dataMode: 'raw',
            collection: collection.id,
            name: request.url,
            description: request.description,
            time: new Date().getTime(),
            events: new EventList({}, [{ listen: 'test', script: testCode || '' }]).toJSON()
          };
      }),
      order = _.map(requests, 'id');

    _.assign(collection, { requests, order });

    let getOriginMeta = (from) => {
        if (from.startsWith('history')) {
          return 'history/monitor';
        }

        return from === 'create_new_x' ? 'cnx' : from;
      },
      collectionEvent = createEvent(
        'create_deep',
        'collection',
        { collection },
        null,
        { origin: getOriginMeta(this.state.from) }
      );

    try {
      let response = await dispatchUserAction(collectionEvent);
      if (!_.isEmpty(_.get(response, 'error'))) {
        pm.logger.error('Error in creating monitor', response.error);
        return;
      }

      this.setState((state) => {
        return {
          selectedOptions: {
            ...state.selectedOptions,
            collectionId: collection.id,
            ownerId: collection.owner
          },
          collectionStatus: {
            ...state.collectionStatus,
            loading: false,
            error: false
          }
        };
      }, () => {
        callback && callback(collection.id);
      });
    }
    catch (err) {
      pm.logger.error('Error in pipeline for creating monitor', err);
    }
  }

  constructMonitor (callback) {
    let selectedOptions = this.state.selectedOptions;
    this.setState({ loading: true });

    return CollectionController.getCollection({ id: selectedOptions.collectionId })
      .then(({ id, owner }) => {
            let uuid = `${owner}-${id}`,
            notificationArray = this.state.notifications.enabled ? _.map(this.state.notifications.recipients, (recipient) => {
              return {
                type: 'email',
                'address': recipient
              };
            }) : [];

            let requestBody = {
              name: selectedOptions.name,
              collection: uuid,
              schedule: {
                cronPattern: selectedOptions.schedule,
                timeZone: moment.tz.guess()
              },
              options: {
                strictSSL: this.state.strictSSL,
                followRedirects: this.state.followRedirects,
                requestTimeout: this.state.requestTimeout.enabled ? parseInt(this.state.requestTimeout.timeout) : null,
                requestDelay: this.state.requestDelay.enabled ? parseInt(this.state.requestDelay.delay) : 0
              },
              notifications: {
                onFailure: notificationArray,
                onError: notificationArray
              },
              retry: this.state.retry.enabled ? { attempts: parseInt(this.state.retry.attempts) } : {}
            };
            this.state.selectedRegionMode === 'manual' && (requestBody.distribution = _.map(selectedOptions.regions, (region) => { return { region, runCount: 1 }; }));
            requestBody.versionTag = selectedOptions.versionId === 'latest' ? null : selectedOptions.versionId;

            if (this.state.notifications.enabled) {
              requestBody.notificationLimit = parseInt(this.state.notificationLimit.value);
            }

            if (!_.isEmpty(selectedOptions.environmentId)) {
              let environment = getStore('EnvironmentStore').find(selectedOptions.environmentId);
              requestBody.environment = environment.uid;
            }

            new MasterMonitorStore().saveMonitorConfiguration({
              data: requestBody,
              workspaceId: getStore('ActiveWorkspaceStore').id
            }).then((monitor) => {
              this.setState((state) => {
                return {
                  monitorId: monitor && monitor.id,
                  monitorStatus: {
                    ...state.monitorStatus,
                    loading: false,
                    error: false
                  },
                  saveToActivity: true
                };
              }, () => {
                this.onSuccess && this.onSuccess();
                AnalyticsService.addEvent('monitor', 'confirm_create', this.state.from);
                monitor.action = 'monitorAdded';
                pm.eventBus.channel('monitor-updates').publish(monitor);
                UrlService.gotoMonitorUrl({
                  monitorId: this.state.monitorId,
                  monitorName: selectedOptions.name
                });
                this.handleClose();
              });
            }).catch((e) => {
              if (_.get(e, 'name') === CREATION_CEILING_HIT_ERROR) {
                this.setState({ activeStep: 2 });

                return pm.toasts.error(_.get(e, 'message', 'Monitor creation limit reached.'), { timeout: 10000 });
              }

              this.setState((state) => {
                return {
                  monitorStatus: {
                    ...state.monitorStatus,
                    loading: false,
                    error: true
                  }
                };
              });
            });
      });
  }

  handleOpenMonitor () {
    if (_.isEmpty(this.state.monitorId)) {
      return;
    }

    AnalyticsService.addEvent('monitor', 'view_run_details', 'collection_browser');
    openAuthenticatedRoute(`${pm.dashboardUrl}/monitor/${this.state.monitorId}`);
  }

  getStepClasses (step) {
    return classnames({ 'is-done': this.state.activeStep > step, 'incomplete-tab-steps': this.state.activeStep < step });
  }

  isInvalidInput () {
    return (
      (this.state.requestTimeout.enabled && this.state.requestTimeout.timeout < 1) ||
      (this.state.requestDelay.enabled && this.state.requestDelay.delay < 1) ||
      (this.state.notifications.enabled && _.some(this.state.errors.recipients)) ||
      _.isEmpty(this.state.selectedOptions.name) ||
      (this.state.selectedRegionMode === 'manual' && _.isEmpty(this.state.selectedOptions.regions)) ||
      (this.state.notifications.enabled && !this.state.notificationLimit.isValid)
    );
  }

  render () {
    let currentUser = getStore('CurrentUserStore'),
        isLoggedIn = currentUser && currentUser.isLoggedIn,
        isSyncEnabled = getStore('GateKeeperStore').isSyncEnabled,
        isOffline = !getStore('SyncStatusStore').isSocketConnected;

    return (
      <XPath identifier='createMonitorModal' isVisible={this.state.isOpen}>
        <Modal
          className='create-new-monitor-modal'
          isOpen={this.state.isOpen}
          onRequestClose={this.handleClose}
          customStyles={this.getStyles()}
        >
          <ModalHeader>
            <Tabs
              type='primary'
              defaultActive={1}
              activeRef={this.state.activeStep}
            >
              <Tab className={this.getStepClasses(1)} refKey={1}>{ this.state.activeStep <= 1 ? '1.' : <SuccessIcon size='xs' /> }<span>&nbsp;Select collection to monitor</span></Tab>
              <Tab className={this.getStepClasses(2)} refKey={2}>{ this.state.activeStep <= 2 ? '2.' : <SuccessIcon size='xs' /> }<span>&nbsp;Configuration</span></Tab>
              <Tab className={this.getStepClasses(3)} refKey={3}>{ this.state.activeStep <= 3 ? '3.' : <SuccessIcon size='xs' /> }<span>&nbsp;Next steps</span></Tab>
            </Tabs>
          </ModalHeader>
          <ModalContent className={`step${this.state.activeStep}`}>
            {
              isLoggedIn && isSyncEnabled &&
                <CreateNewMonitorModal
                  ref='content'
                  activeStep={this.state.activeStep}
                  selectedRegionMode={this.state.selectedRegionMode}
                  showTooltip={this.state.showTooltip}
                  activeSource={this.state.activeSource}
                  errorFetchingVersions={this.state.errorFetchingVersions}
                  enableRegionSelection={this.state.enableRegionSelection}
                  enableMinuteSelection={this.state.enableMinuteSelection}
                  isLoadingVersions={this.state.isLoadingVersions}
                  isLoadingRegions={this.state.isLoadingRegions}
                  isOffline={isOffline}
                  onOfflineRetry={this.handleOfflineRetry}
                  onChangeSource={this.handleChangeSource}
                  ownCollections={this.state.ownCollections}
                  ownEnvironments={this.state.ownEnvironments}
                  ownVersions={this.state.ownVersions}
                  onSelectCollection={this.handleSelectCollection}
                  onSelectEnvironment={this.handleSelectEnvironment}
                  onSelectVersion={this.handleSelectVersion}
                  selectedOptions={this.state.selectedOptions}

                  onTestToggle={this.handleTestToggle}
                  onRequestChange={this.handleRequestChange}
                  onMonitorNameChange={this.handleMonitorNameChange}
                  onMonitorScheduleChange={this.handleMonitorScheduleChange}
                  onRegionSelectorChange={this.handleRegionSelectorChange}
                  onShowTooltip={this.handleShowTooltip}
                  onHideTooltip={this.handleHideTooltip}
                  onRegionChange={this.handleRegionChange}
                  onCreateMonitor={this.handleCreate}
                  onVersionFetchRetry={this.handleVersionFetchRetry}
                  onMonitorClick={this.handleOpenMonitor}
                  onRetry={this.handleRetry}
                  onClose={this.handleClose}

                  monitorStatus={this.state.monitorStatus}
                  collectionStatus={this.state.collectionStatus}

                  notifications={this.state.notifications}
                  notificationLimit={this.state.notificationLimit}
                  maxNotificationLimit={maxNotificationLimit}
                  retry={this.state.retry}
                  maxRetryAttempts={maxRetryAttempts}
                  regions={this.state.availableRegions}
                  requestTimeout={this.state.requestTimeout}
                  requestDelay={this.state.requestDelay}
                  followRedirects={this.state.followRedirects}
                  strictSSL={this.state.strictSSL}

                  onNotificationChange={this.handleNotificationChange}
                  onNotificationLimitChange={this.handleNotificationLimitChange}
                  onRetryChange={this.handleRetryConfigChange}
                  onRequestDelayChange={this.handleDelayChange}
                  onRequestTimeoutChange={this.handleTimeoutChange}
                  onStrictSSLChange={this.handleStrictSSLChange}
                  onFollowRedirectsChange={this.handleRedirectChange}
                  loading={this.state.loading}
                  errors={this.state.errors}
                  isEditable={false}
                  collectionFromContainer={this.state.selectedOptions}
                  activeSourceFromContainer={this.state.activeSource}
                  from={this.state.from}
                />
            }
          </ModalContent>
          {
            isLoggedIn &&
              isSyncEnabled &&
              !this.state.errorFetchingVersions &&
              !this.state.isLoadingVersions &&
              !this.state.collectionStatus.error &&
              !this.state.monitorStatus.error &&
                <ModalFooter className={`step${this.state.activeStep}`}>
                {
                  this.state.activeStep === 1 &&
                    <div className='create-new-monitor-modal__footer'>
                      <XPath identifier='next'>
                        <Button
                          type='primary'
                          disabled={_.isEmpty(this.state.selectedOptions.requests) || this.state.activeSource !== 'new' || isOffline}
                          onClick={this.handleSelectCollection}
                          tooltip={isOffline && OFFLINE_MESSAGE}
                        >Next</Button>
                      </XPath>
                      <XPath identifier='back'>
                        <Button
                          type='secondary'
                          onClick={this.handleBack.bind(this, 0)}
                          disabled={isOffline}
                          tooltip={isOffline && OFFLINE_MESSAGE}
                        >Back</Button>
                      </XPath>
                    </div>
                }

                {
                  this.state.activeStep === 2 &&
                    <div className='create-new-monitor-modal__footer'>
                      <div>
                        <XPath identifier='back'>
                          <Button
                            type='secondary'
                            onClick={this.handleBack.bind(this, 1)}
                            disabled={isOffline}
                            tooltip={isOffline && OFFLINE_MESSAGE}
                          >Back</Button>
                        </XPath>
                        <XPath identifier='create'>
                          <Button
                            type='primary'
                            disabled={isOffline || this.state.loading}
                            onClick={this.onClick}
                            tooltip={isOffline && OFFLINE_MESSAGE}
                          >{MONITOR_FORM.labels.button.create}</Button>
                        </XPath>
                      </div>
                    </div>
                }

                {
                  this.state.activeStep === 3 &&
                    <div className='create-new-monitor-modal__footer'>
                      <XPath identifier='close'>
                        <Button
                          type='primary'
                          onClick={this.handleClose}
                          disabled={isOffline}
                        >Close</Button>
                      </XPath>
                    </div>
                }
                </ModalFooter>
          }
        </Modal>
      </XPath>
    );
  }
}
