import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { Icon } from '@postman/aether';
import { observer } from 'mobx-react';

import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';
import ContextMenu from '@postman-app-monolith/renderer/js/components/base/ContextMenu';
import InlineInput from '@postman-app-monolith/renderer/js/components/base/InlineInput';
import XPath from '@postman-app-monolith/renderer/js/components/base/XPaths/XPath';
import {
  ACTION_TYPE_DUPLICATE,
  ACTION_TYPE_DELETE,
  ACTION_TYPE_RENAME_TOGGLE
} from '@@runtime-repl/collection/CollectionActionsConstants';
import CollectionSidebarModel from '@@runtime-repl/collection/sidebar/CollectionSidebarModel';
import ICollectionSidebarListItem from '@@runtime-repl/collection/sidebar/CollectionSidebarListContainer/ICollectionSidebarListItem';
import ExampleActionsDropdown from '@@runtime-repl/example/view/ExampleActionsDropdown';

@ContextMenu([
  {
    label: 'Rename',
    shortcut: 'rename',
    isVisible (props) {
      return getStore('OnlineStatusStore').userCanSave &&
        props.collection.userCanUpdate;
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_RENAME_TOGGLE);
    }
  },
  {
    label: 'Duplicate',
    shortcut: 'duplicate',
    isVisible (props) {
      return getStore('OnlineStatusStore').userCanSave &&
        props.collection.userCanUpdate;
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_DUPLICATE);
    }
  },
  {
    label: 'Delete',
    shortcut: 'delete',
    isVisible (props) {
      return getStore('OnlineStatusStore').userCanSave &&
        props.collection.userCanUpdate;
    },
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_DELETE);
    }
  }
], (monitor) => ({ isContextMenuOpen: monitor.isOpen }))
@observer
export default class CollectionSidebarListItemExample extends ICollectionSidebarListItem {
  constructor (props) {
    super(props);

    this.onItemClick = this.onItemClick.bind(this);
    this.handleItemToggle = this.handleItemToggle.bind(this);
    this.setInlineInputRef = this.setInlineInputRef.bind(this);
    this.onInlineInputSubmit = this.onInlineInputSubmit.bind(this);
    this.onInlineInputToggle = this.onInlineInputToggle.bind(this);
    this.handleDropdownToggle = this.handleDropdownToggle.bind(this);
    this.handleActionSelect = this.handleActionSelect.bind(this);
  }

  getClasses () {
    return classnames({
      'collection-sidebar-list-item__entity': true,
      'collection-sidebar-list-item__request': true,
      'is-active': this.props.selected
    });
  }

  getHeadClasses () {
    return classnames({
      'collection-sidebar-list-item__request__head': true,
      'is-hovered': this.props.persistentState.dropdownOpen,
      'is-selected': this.props.selected,
      'is-focused': this.props.isFocused
    });
  }

  onItemClick () {
    if (this.props.isContextMenuOpen()) {
      return;
    }

    super.onItemClick();
  }

  render () {
    const {
        item,
        persistentState
      } = this.props,
      itemDepth = item.depth;

    return super.render(
      this.getClasses(),
      <div
        className={this.getHeadClasses()}
        title={item.name}
        onClick={this.onItemClick}
      >
        {
            _.times(itemDepth, (index) => (
              <div
                key={`indent-${index}`}
                className={classnames('collection-sidebar__indent',
                  {
                    'active-indent': this.showActiveIndent(index)
                  })}
              />
            ))
          }
        <div className='collection-sidebar-list-item__example-icon__wrapper'>
          <Icon
            name='icon-entity-example-stroke'
            color='content-color-secondary'
            className='collection-sidebar-list-item__example-icon'
          />
        </div>
        <XPath identifier='head'>
          <div className='collection-sidebar-list-item__request__meta'>
            <InlineInput
              className='collection-sidebar-list-item__entity__name collection-sidebar-list-item__request__name'
              placeholder='Example Name'
              ref={this.setInlineInputRef}
              value={item.name}
              onSubmit={this.onInlineInputSubmit}
              onToggleEdit={this.onInlineInputToggle}
            />
          </div>
        </XPath>
        <div className='collection-sidebar-list-item__request__actions'>
          {
              (persistentState.isHovered || persistentState.dropdownOpen) && (
                <XPath identifier='responseOption'>
                  <div className='collection-sidebar-request-dropdown-actions-wrapper'>
                    <ExampleActionsDropdown
                      className='collection-sidebar-request-actions-dropdown'
                      actions={item.actions}
                      onSelect={this.handleActionSelect}
                      onToggle={this.handleDropdownToggle}
                    />
                  </div>
                </XPath>
              )
            }
        </div>
      </div>
    );
  }
}

CollectionSidebarListItemExample.defaultProps = {
  isFocused: false,
  selected: false,
  isContextMenuOpen: _.noop
};

CollectionSidebarListItemExample.propTypes = {
  collection: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  model: PropTypes.instanceOf(CollectionSidebarModel).isRequired,

  activeIndent: PropTypes.object.isRequired,

  isFocused: PropTypes.bool,

  selected: PropTypes.bool,

  isContextMenuOpen: PropTypes.func
};
