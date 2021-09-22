import _ from 'underscore';
import _t from 'i18n!nls/widget';

/* eslint-disable react/no-find-dom-node */

import PropTypes from 'prop-types';

import Q from 'q';
import $ from 'jquery';
import React from 'react';
import classNames from 'classnames';

import isMobileApp from 'js/lib/isMobileApp';
import Icon from 'bundles/iconfont/Icon';
import { SvgMaximize, SvgClose } from '@coursera/coursera-ui/svg';
import { color } from '@coursera/coursera-ui';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

import WidgetErrorMessage from 'bundles/widget/components/WidgetErrorMessage';
import { handleWidgetRpcAction } from 'bundles/widget/utils';
import {
  registerWidget,
  connectToWidget,
  removeWidget,
  toggleWidgetError,
} from 'bundles/widget/actions/WidgetManagerActions';
import { WidgetReadyStates, RPCActions, FocusableElements } from 'bundles/widget/constants/WidgetConstants';
import type { CourseraConnectMessage } from 'bundles/widget/types/Request';
import type { WidgetSession, WidgetSessionId, WidgetSessionConfiguration } from 'bundles/widget/types/WidgetSession';
import type {
  WidgetRegistry,
  WidgetState,
  WidgetError,
  ConnectedWidget,
  store as WidgetManagerStoreType,
} from 'bundles/widget/reducers/WidgetManagerReducer';
import WidgetCompleteButton from 'bundles/widget/components/WidgetCompleteButton';
import A11yScreenReaderOnly from 'bundles/a11y/components/A11yScreenReaderOnly';

import type ItemMetadata from 'pages/open-course/common/models/itemMetadata';

import 'css!bundles/widget/components/__styles__/WidgetFrame';

type PropsFromStore = {
  widgetRegistry: WidgetRegistry;
  widgetState?: WidgetState;
  error?: WidgetError;
};

type PropsFromCaller = {
  onReceiveMessage?: (
    request: CourseraConnectMessage
  ) => Q.Promise<string | undefined | void> | Promise<string | undefined | void>;
  session: WidgetSession;
  sessionId?: WidgetSessionId;
  inWidgetItem?: boolean;
  isDisabled?: boolean;
  // NOTE: isComplete and markComplete should only be true when inWidgetItem=true
  isComplete?: boolean;
  markComplete?: () => void;
  widgetId: string;
  parentRpcActions?: Array<string>;
  fallbackDefaultHeight?: string;
  showPopupButton?: boolean;
  widgetContentTitle?: string;
  onToggleExpanded?: () => void;
  nextItem?: ItemMetadata;
};

type PropsToComponent = PropsFromStore & PropsFromCaller;

type Stores = {
  WidgetManagerStore: InstanceType<typeof WidgetManagerStoreType>;
};

type State = {
  specifiedHeight: string;
  expanded: boolean;
};

type onReceiveMessageResponse = WidgetSessionConfiguration | string | undefined | void | any;

const KEY_TAB = 9;

class WidgetFrame extends React.Component<PropsToComponent, State> {
  registeredWidget: boolean | undefined;

  attemptedConnection: boolean | undefined;

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
    getStore: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onReceiveMessage: () => {
      return Q();
    },
    inWidgetItem: false,
    parentRpcActions: [],
    fallbackDefaultHeight: '500px',
    showPopupButton: true,
  };

  state: State = {
    specifiedHeight: '',
    expanded: false,
  };

  componentDidMount() {
    this.refreshWidgetState();
    if (this.iframeElement && this.iframeElement instanceof HTMLIFrameElement) {
      // set as custom attribute since react 15 automatically removes the allow attributes in iframes
      // https://github.com/facebook/react/issues/12225
      this.iframeElement.setAttribute('allow', 'camera');
      this.iframeElement.focus();
    }

    document.addEventListener('keydown', this.cycleTabs, false);
  }

  componentDidUpdate() {
    this.refreshWidgetState();
  }

  componentWillUnmount() {
    const { widgetState, widgetRegistry, widgetId } = this.props;

    if (!widgetState) {
      return;
    }

    const widgetRegistration = widgetRegistry[widgetId];

    if (widgetId && widgetRegistration && (widgetRegistration as ConnectedWidget)?.removeListenerHandle) {
      this.context.executeAction(removeWidget, {
        widgetId: this.props.widgetId,
        removeListenerHandle: (widgetRegistration as ConnectedWidget)?.removeListenerHandle,
      });
    }

    document.removeEventListener('keydown', this.cycleTabs, false);
  }

  onExpandToggle = () => {
    // TODO @sgogia
    // slightly hacky way of ensuring body (higher in hierarchy) can't be scrolled when widget expanded
    // document body checks are only required for getting rid of flow issues (body should be defined for this event)
    const { expanded } = this.state;
    const { onToggleExpanded } = this.props;

    if (!expanded) {
      $('body').addClass(' noscroll');
    } else {
      $('body').removeClass(' noscroll');
    }

    if (onToggleExpanded) {
      onToggleExpanded();
    }

    this.setState({ expanded: !expanded }, () => {
      if (!expanded && this.closeButton) {
        this.closeButton.focus();
      } else if (expanded && this.maximizeButton) {
        this.maximizeButton.focus();
      }
    });
  };

  onReceiveMessage = (
    request: CourseraConnectMessage
  ): Q.Promise<onReceiveMessageResponse> | Promise<onReceiveMessageResponse> | Function | undefined => {
    const {
      session: { rpcActionTypes, configuration },
      sessionId,
      widgetId,
      parentRpcActions,
    } = this.props;
    if (request.type === RPCActions.LOAD_WIDGET_ERROR) {
      const { body } = request;
      if (body) {
        const { error } = body;
        this.context.executeAction(toggleWidgetError, { widgetId, error });
      }
      return Q();
    }
    if (rpcActionTypes) {
      if (_(rpcActionTypes).contains(request.type)) {
        if (request.type === RPCActions.GET_SESSION_CONFIGURATION) {
          return Q(configuration);
        } else if (request.type === RPCActions.SET_HEIGHT) {
          const { body } = request;
          if (body) {
            const specifiedHeight = body.height;
            if (specifiedHeight) {
              this.setState({ specifiedHeight });
            }
            return Q('Height set');
          } else {
            return Q('Failed to set height - empty request');
          }
        } else if (parentRpcActions && _(parentRpcActions).contains(request.type) && this.props.onReceiveMessage) {
          return this.props.onReceiveMessage(request);
        } else if (sessionId) {
          return handleWidgetRpcAction(request, sessionId);
        }
      } else {
        // Should never really happen
        return Q.reject(`Unknown or unauthorized request type: ${request.type}`);
      }
    }

    // redundantly returning undefined here to fix ts warning
    return undefined;
  };

  getFocusableElements = () => {
    if (this.widgetFrame) {
      const allFocusableElements = [
        ...this.widgetFrame.querySelectorAll<HTMLElement>(FocusableElements.FOCUSABLE_SELECTOR),
      ];
      const focusableElementsWithoutDisabledButtons = allFocusableElements.filter((el) => !el.hasAttribute('disabled'));

      return focusableElementsWithoutDisabledButtons;
    }

    return [];
  };

  isOnMobile = () => {
    const applicationStore = this.context.getStore('ApplicationStore');
    const userAgent = applicationStore.getUserAgent();
    const isMobileBrowser = userAgent && userAgent.isMobileBrowser;
    return isMobileApp.get() || isMobileBrowser;
  };

  refreshWidgetState = () => {
    const { widgetState, widgetId } = this.props;

    if (!widgetState || widgetState.readyState === WidgetReadyStates.NOT_LOADED) {
      this.registerWidget();
    } else if (widgetId && widgetState.readyState === WidgetReadyStates.REGISTERING) {
      this.connectToWidget();
    }
  };

  registerWidget() {
    const { widgetId, widgetRegistry } = this.props;

    if (this.registeredWidget) {
      return;
    }

    this.registeredWidget = true;
    this.context.executeAction(registerWidget, {
      widgetId,
      widgetRegistry,
    });
  }

  closeButton: HTMLButtonElement | null = null;

  maximizeButton: HTMLButtonElement | null = null;

  secretButton: HTMLButtonElement | null = null;

  widgetFrame: HTMLDivElement | null = null;

  iframeElement: HTMLIFrameElement | null = null;

  redirectTabFocus = (e: KeyboardEvent, focusableElement: $TSFixMe) => {
    e.preventDefault();
    focusableElement.focus();
  };

  showExpansionButton = () => {
    const { showPopupButton } = this.props;
    const { expanded } = this.state;

    return !expanded && !this.isOnMobile() && showPopupButton;
  };

  showCompleteButton = () => {
    const { session, inWidgetItem } = this.props;
    const { expanded } = this.state;

    const hasCompletedRPCAction =
      session?.rpcActionTypes && _(session.rpcActionTypes).contains(RPCActions.SET_COMPLETE);
    const showCompletionButton = !expanded && inWidgetItem && !hasCompletedRPCAction;

    return showCompletionButton;
  };

  cycleTabs = (event: KeyboardEvent) => {
    const { expanded } = this.state;

    if (!expanded || event.keyCode !== KEY_TAB) {
      return;
    }

    // grab it every time in case the modal is updated and there's new contents in there
    const focusableElements = this.getFocusableElements();

    const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLButtonElement;
    const firstFocusableElement = focusableElements[0] as HTMLButtonElement;
    const currentElement = document.activeElement;

    const showExpansionButton = this.showExpansionButton();
    const showCompletionButton = this.showCompleteButton();

    if (event.shiftKey) {
      // SHIFT + TAB
      if (currentElement === firstFocusableElement) {
        const isCompletionButtonHidden = !showExpansionButton && !showCompletionButton;
        /* tab to iframe if completion button is hidden */
        this.redirectTabFocus(event, isCompletionButtonHidden ? this.iframeElement : lastFocusableElement);
      }
    } else if (currentElement === lastFocusableElement) {
      // TAB
      this.redirectTabFocus(event, firstFocusableElement);
    }
  };

  tabToCloseButton = () => {
    if (this.closeButton) {
      this.closeButton.focus();
    }
  };

  connectToWidget() {
    const { widgetId, widgetRegistry, session } = this.props;

    if (this.attemptedConnection) {
      return;
    }

    this.attemptedConnection = true;
    const widgetRegistration = widgetRegistry[widgetId];
    const { rpcActionTypes } = session;

    if (widgetRegistration && this.iframeElement) {
      // Since DOM elements can't be passed through actionContext, send wrapper around `postMessage`.
      const sendMessageToIFrame = (message: $TSFixMe, src: $TSFixMe) => {
        if (this.iframeElement && this.iframeElement.contentWindow) {
          this.iframeElement.contentWindow.postMessage(message, src);
        }
      };

      this.context.executeAction(connectToWidget, {
        iFrameSrc: this.iframeElement.src || '',
        widgetId,
        rpcActionTypes,
        onReceiveMessage: this.onReceiveMessage,
        sendMessageToIFrame,
      });
    }
  }

  trySmartHeightDefault = () => {
    const iframe = this.iframeElement;
    if (!!iframe && !this.state.specifiedHeight) {
      try {
        const contentsHeight = iframe?.contentWindow?.document.body.scrollHeight;
        if (contentsHeight && contentsHeight > 0) {
          iframe.height = contentsHeight + 'px';
        }
      } catch (e) {
        // if we can't get the height of the contents, we'll keep our default height
      }
    }
  };

  renderSpinner(width: $TSFixMe, height: $TSFixMe) {
    return (
      <div className="horizontal-box align-items-absolute-center widget-loader" style={{ width, height }}>
        <Icon name="spinner" size="2x" spin={true} className="color-hint-text" />
      </div>
    );
  }

  render() {
    const { session, widgetState, error, fallbackDefaultHeight, widgetId, widgetContentTitle, nextItem } = this.props;
    const { src, sandbox } = session;
    const { expanded, specifiedHeight } = this.state;
    const height = specifiedHeight || fallbackDefaultHeight;
    const width = '100%';

    // note isComplete and markComplete should only exist if inWidgetItem true
    const { isComplete, markComplete } = this.props;

    if (!widgetState) {
      return this.renderSpinner(width, height);
    }

    const { readyState } = widgetState;
    const isWidgetLoading = readyState === WidgetReadyStates.REGISTERING || readyState === WidgetReadyStates.NOT_LOADED;

    // Because reference to iFrame is needed, hide iFrame via CSS instead of not rendering it.
    const iframeClassName = classNames('widget-iframe', {
      loading: isWidgetLoading,
      hidden: !!error,
      'default-height': !specifiedHeight,
    });

    // TODO: separate renderExpandedView into its own function
    const expandedClass = expanded ? 'expanded' : 'unexpanded';
    const showExpansionButton = this.showExpansionButton();
    const showCompletionButton = this.showCompleteButton();

    return (
      <div
        ref={(node) => {
          this.widgetFrame = node;
        }}
        className={`rc-WidgetFrame ${expandedClass}`}
        aria-modal={expanded}
      >
        {expanded && <div className="dimmer" />}
        <div className="widget-container vertical-box">
          {expanded && (
            <div className="widget-title horizontal-box align-items-vertical-center">
              <span className="body-2-text m-l-1">{widgetContentTitle}</span>
              <div className="flex-1" />
              <button
                ref={(node) => {
                  this.closeButton = node;
                }}
                type="button"
                className="nostyle horizontal-box align-items-absolute-center m-r-1 "
                aria-label={_t('#{widgetContentTitle} window. Minimize window', { widgetContentTitle })}
                onClick={this.onExpandToggle}
              >
                <SvgClose size={24} color={color.bgGrayThemeDark} />
              </button>
            </div>
          )}
          <div className="frame-container">
            {error && <WidgetErrorMessage error={error} />}
            {isWidgetLoading && this.renderSpinner(width, height)}

            <iframe
              title={_t(session.iframeTitle)}
              src={src}
              id={widgetId}
              height={height}
              className={iframeClassName}
              width={width}
              sandbox={sandbox}
              ref={(frame) => {
                this.iframeElement = frame;
              }}
              onLoad={this.trySmartHeightDefault}
            >
              {_t('Iframes are not supported in your browser.')}
            </iframe>
          </div>
          {showExpansionButton && (
            <div className="widget-controls horizontal-box align-items-spacebetween">
              <button
                ref={(node) => {
                  this.maximizeButton = node;
                }}
                type="button"
                className="expander passive horizontal-box align-items-absolute-center"
                onClick={this.onExpandToggle}
                aria-label={_t('Maximize #{widgetContentTitle} window', { widgetContentTitle })}
              >
                <SvgMaximize size={16} color={color.primary} />
              </button>
              {showCompletionButton && typeof isComplete === 'boolean' && !!markComplete && (
                <WidgetCompleteButton isComplete={isComplete} markComplete={markComplete} nextItem={nextItem} />
              )}
            </div>
          )}
          {/* Helps us tab back to the close button if the complete button does not exist.
            This is because an iframe is used to display contents */}
          {!showExpansionButton && !showCompletionButton && (
            <A11yScreenReaderOnly tagName="span">
              <button
                aria-hidden={expanded}
                type="button"
                className="secret-button"
                ref={(node) => {
                  this.secretButton = node;
                }}
                onFocus={this.tabToCloseButton}
              >
                Go to Close
              </button>
            </A11yScreenReaderOnly>
          )}
          {!showExpansionButton && showCompletionButton && typeof isComplete === 'boolean' && !!markComplete && (
            <div aria-hidden={expanded} className="widget-controls horizontal-box align-items-right">
              <WidgetCompleteButton isComplete={isComplete} markComplete={markComplete} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connectToStores<PropsToComponent, PropsFromCaller, Stores>(
  ['WidgetManagerStore'],
  ({ WidgetManagerStore }, props) => {
    const widgetManagerStoreState = WidgetManagerStore.getState();
    const { widgetId } = props;
    const widgetState = widgetManagerStoreState.widgetStates[widgetId];
    const error = widgetState && widgetState.error;

    return {
      widgetRegistry: widgetManagerStoreState.widgetRegistry,
      widgetState,
      error,
    };
  }
)(WidgetFrame);
