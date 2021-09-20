import React, { Component } from 'react';
import { Analytics, SourceType } from '@trello/atlassian-analytics';
import { Button } from '@trello/nachos/button';
import styles from './LinkCopy.less';
import { forNamespace } from '@trello/i18n';
import { featureFlagClient } from '@trello/feature-flag-client';

const format = forNamespace('link copy');

interface LinkCopyProps {
  url: string;
  analyticsSource: SourceType;
  boardId?: string;
  teamId?: string;
  isTemplate?: boolean;
}

export class LinkCopy extends Component<LinkCopyProps, { buttonText: string }> {
  linkInput = React.createRef<HTMLInputElement>();
  timer: number;
  isTemplate: boolean;

  state = {
    buttonText: format('copy'),
  };

  componentDidMount() {
    const linkInput = this.linkInput.current;
    if (linkInput) {
      setTimeout(() => {
        linkInput.select();
      }, 10);
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  handleButtonClick = () => {
    if (this.linkInput.current) {
      this.linkInput.current.select();
      document.execCommand('copy');
      this.setState({ buttonText: format('copied') });
    }

    // Create a timeout to change "Copied!" back to "Copy" as a visual indicator
    // that the link has successfully completed being copied to the clipboard
    this.timer = window.setTimeout(() => {
      this.setState({ buttonText: format('copy') });
    }, 2000);

    Analytics.sendClickedButtonEvent({
      buttonName: 'linkCopyButton',
      source: this.props.analyticsSource,
      containers: {
        board: { id: this.props.boardId },
        organization: { id: this.props.teamId },
      },
      attributes: { isTemplate: this.props.isTemplate },
    });
  };

  handleInputClick = () => {
    if (this.linkInput.current) {
      this.linkInput.current.select();
    }

    if (featureFlagClient.get('dataeng.gasv3-event-tracking', false)) {
      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'input',
        actionSubjectId: 'linkCopyInput',
        source: this.props.analyticsSource,
        containers: {
          board: { id: this.props.boardId },
          organization: { id: this.props.teamId },
        },
        attributes: { isTemplate: this.props.isTemplate },
      });
    }
  };

  render() {
    return (
      <div className={styles.shareLinkContainer}>
        <input
          readOnly
          value={this.props.url}
          onClick={this.handleInputClick}
          ref={this.linkInput}
        />
        <Button
          appearance="primary"
          title={this.state.buttonText}
          onClick={this.handleButtonClick}
        >
          {this.state.buttonText}
        </Button>
      </div>
    );
  }
}
