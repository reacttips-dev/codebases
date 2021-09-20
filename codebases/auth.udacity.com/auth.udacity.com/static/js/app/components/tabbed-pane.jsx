import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _map from 'lodash/map';
import styles from './tabbed-pane.module.scss';

export default class TabbedPane extends Component {
  static propTypes = {
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        onClick: PropTypes.func
      })
    ),
    selectedTabIndex: PropTypes.number
  };

  _renderTabs() {
    const { tabs, selectedTabIndex } = this.props;

    return (
      <div className={styles.tabs}>
        {_map(tabs, (tab, idx) => {
          const { label, onClick } = tab;
          const isSelected = idx === selectedTabIndex;

          return (
            <div
              key={idx}
              className={styles[isSelected ? 'tab-selected' : 'tab']}
              onClick={() => onClick && onClick()}
            >
              {label}
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <div className={styles['tabbed-pane']}>
        {this._renderTabs()}

        <div className={styles.content}>{this.props.children}</div>
      </div>
    );
  }
}
