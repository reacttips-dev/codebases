import React from 'react';
import { forNamespace, forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import styles from './BoardSidebarLoadingError.less';

const formatError = forTemplate('error');
const formatTitle = forNamespace('view title');
const formatConnectFailed = forTemplate('connect_failed');

export class BoardSidebarLoadingError extends React.Component {
  private reloadPage = () => window.location.reload();

  render() {
    return (
      <div className={styles.errorMessage}>
        <div className="board-menu-header-content">
          <h3 className="board-menu-header-title js-board-menu-title-text">
            {formatTitle('menu')}
          </h3>
        </div>
        <hr className={'board-menu-header-divider'} />
        <h4>{formatError('menu-loading-error')}</h4>
        <p>{formatError('reload-call-to-action')}</p>
        <Button appearance={'primary'} onClick={this.reloadPage}>
          {formatConnectFailed('reload-page')}
        </Button>
      </div>
    );
  }
}
