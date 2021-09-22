import React from 'react';
import { TrackedSvgButton } from 'bundles/common/components/withSingleTracked';
import _uniqueId from 'lodash/uniqueId';
import _t from 'i18n!nls/course-item-resource-panel';
import { VerticalTabsProps, TabIconType } from './__types__';
import 'css!./__styles__/index';

export default class VerticalTabs extends React.Component<VerticalTabsProps> {
  state = {
    activeTabIndex: 0,
  };

  handleTabClick = (e: React.SyntheticEvent, index: number) => {
    this.setState({ activeTabIndex: index });
    if (this?.props?.onTabClick) {
      this.props.onTabClick(e, index);
    }
  };

  activeTab = () => {
    const tab = this.props?.tabs[this.state.activeTabIndex];
    const tabBody = Array.isArray(tab) && tab.length > 0 && tab[1];
    return (tabBody && tabBody.render()) || null;
  };

  availableTabs = () => {
    return this.props.tabs.map((tab: [string, TabIconType], index: number) => {
      const [type, icon] = tab;
      const active =
        this.state.activeTabIndex === index
          ? 'rc-VerticalTabsContainer__TabIconsContainer__TabIcons__TabIcon__active'
          : '';

      return (
        <li key={`availableTab_${_uniqueId()}`}>
          <span className={`rc-VerticalTabsContainer__TabIconsContainer__TabIcons__TabIcon ${active}`}>
            <TrackedSvgButton
              trackingName={`resource_panel_${type}_tab`}
              onClick={(e: $TSFixMe) => this.handleTabClick(e, index)}
              htmlAttributes={{
                'aria-label': _t('Select resource panel tab'),
              }}
              size="zero"
              type="noStyle"
              svgElement={icon.icon}
            />
          </span>
        </li>
      );
    });
  };

  render() {
    return (
      <div className="rc-VerticalTabsContainer">
        <span className="rc-VerticalTabsContainer__TabIconsContainer">
          <ul className="rc-VerticalTabsContainer__TabIconsContainer__TabIcons">{this.availableTabs()}</ul>
        </span>

        <span className="rc-VerticalTabsContainer__TabContent">{this.activeTab()}</span>
      </div>
    );
  }
}
