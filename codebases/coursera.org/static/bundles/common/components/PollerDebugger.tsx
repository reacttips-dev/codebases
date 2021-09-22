import React, { Component } from 'react';
import { color, Box } from '@coursera/coursera-ui';
import { SvgSmile, SvgFail } from '@coursera/coursera-ui/svg';
import { ButtonGroup, Button } from 'react-bootstrap';
import user from 'js/lib/user';
import { Poller$Ref } from 'bundles/common/types/Poller';
import 'css!./__styles__/PollerDebugger';

type Props = {
  uid?: string;
  name?: string;
  pollerRef: Poller$Ref;
  isEnabled?: boolean;
  isRunning?: boolean;
};

/**
 * Every PollerDebugger than runs will initialize a config object in localStorage based on the
 * `uid` given to the poller. The localStorage key will be `poller:${uid}`, and the value will
 * be something like `{ shouldDisplay: true, shouldRun: false }`.
 */
type Config = {
  // If false, the PollerDebugger will not render.
  shouldDisplay: boolean;

  // If false, the Poller this PollerDebugger is managing will not run.
  shouldRun: boolean;
};

type State = {
  config: Config;
};

/**
 * TODO: This should really be in something like a chrome extension.
 */
export default class PollerDebugger extends Component<Props, State> {
  state = {
    config: {
      shouldDisplay: false,
      shouldRun: true,
    },
  };

  componentDidMount() {
    const { uid, pollerRef } = this.props;

    if (uid) {
      this.loadConfig().then((config) => {
        this.setState({ config }, () => {
          if (!pollerRef.current) {
            return;
          }

          if (config.shouldRun) {
            pollerRef.current.start();
          } else {
            pollerRef.current.stop();
          }
        });
      });
    }
  }

  getStorageKey(): string {
    const { uid } = this.props;
    return `poller:${uid || 'unknown'}`;
  }

  loadConfig = (): Promise<Config> => {
    const key = this.getStorageKey();
    const { config } = this.state;

    try {
      const newConfig = JSON.parse(localStorage.getItem(key) || '');
      return Promise.resolve({
        ...config,
        ...newConfig,
      });
    } catch (e) {
      return Promise.resolve(config);
    }
  };

  saveConfig = (): Promise<void> => {
    const key = this.getStorageKey();
    const { config } = this.state;
    const text = JSON.stringify(config);
    localStorage.setItem(key, text);
    return Promise.resolve();
  };

  start = () => {
    const {
      pollerRef: { current },
    } = this.props;

    if (!current) {
      return;
    }

    this.setState(
      ({ config }) => ({
        config: {
          ...config,
          shouldRun: true,
        },
      }),
      () => {
        this.saveConfig().then(() => {
          current.start();
        });
      }
    );
  };

  stop = () => {
    const {
      pollerRef: { current },
    } = this.props;

    if (!current) {
      return;
    }

    this.setState(
      ({ config }) => ({
        config: {
          ...config,
          shouldRun: false,
        },
      }),
      () => {
        this.saveConfig().then(() => {
          current.stop();
        });
      }
    );
  };

  toggle = () => {
    const { isRunning } = this.props;

    if (isRunning) {
      this.stop();
    } else {
      this.start();
    }
  };

  forceRun = () => {
    const {
      pollerRef: { current: currentPoller },
    } = this.props;

    currentPoller?.run(true);
  };

  render() {
    const {
      name,
      pollerRef: { current: currentPoller },
      isEnabled,
      isRunning,
    } = this.props;
    const { config } = this.state;

    const shouldRender =
      // "shouldDisplay" prop from the localStorage config. Set this manually to turn the debugger on/off.
      config.shouldDisplay &&
      // Don't show this to non-superusers even if they change their config in localStorage.
      user.isSuperuser();

    if (!currentPoller || !shouldRender) {
      return null;
    }

    return (
      <Box rootClassName="rc-PollerDebugger" alignItems="center">
        {isEnabled ? <SvgSmile size={18} color={color.success} /> : <SvgFail size={18} color={color.danger} />}

        <span>
          {isEnabled && isRunning ? 'Polling' : 'Not polling'} {name}
        </span>

        <ButtonGroup>
          {/*
          // @ts-expect-error TODO: Button size should be number, most likely it is confused with bsSize */}
          <Button size="xs" onClick={this.toggle}>
            {isRunning ? 'Stop' : 'Start'}
          </Button>

          {/*
          // @ts-expect-error TODO: Button size should be number, most likely it is confused with bsSize */}
          <Button size="xs" onClick={this.forceRun}>
            Force Run
          </Button>
        </ButtonGroup>
      </Box>
    );
  }
}
