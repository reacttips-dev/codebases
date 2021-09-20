import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { Icon } from '@postman/aether';
import { observer } from 'mobx-react';
import ContextMenu from '@postman-app-monolith/renderer/js/components/base/ContextMenu';
import InlineInput from '@postman-app-monolith/renderer/js/components/base/InlineInput';
import RequestIcon from '@@runtime-repl/request-http/RequestIcon';
import { getStore } from '@postman-app-monolith/renderer/js/stores/get-store';

import XPath from '@postman-app-monolith/renderer/js/components/base/XPaths/XPath';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import RequestActionsDropdown from '@@runtime-repl/request-http/view/RequestActionsDropdown';
import {
  ACTION_TYPE_OPEN,
  ACTION_TYPE_DUPLICATE,
  ACTION_TYPE_DELETE,
  ACTION_TYPE_RENAME_TOGGLE
} from '@@runtime-repl/collection/CollectionActionsConstants';
import CollectionSidebarModel from '@@runtime-repl/collection/sidebar/CollectionSidebarModel';
import ICollectionSidebarListItem from '@@runtime-repl/collection/sidebar/CollectionSidebarListContainer/ICollectionSidebarListItem';

@ContextMenu([
  {
    label: 'Open in Tab',
    onClick (props) {
      props.item.handleAction(ACTION_TYPE_OPEN, {}, { preview: false });
    }
  },
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
export default class CollectionSidebarListItemRequest extends ICollectionSidebarListItem {
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
      'is-open': this.isOpen(),
      'is-hovered': this.props.persistentState.dropdownOpen,
      'is-selected': this.props.selected,
      'is-focused': this.props.isFocused
    });
  }

  isOpen () {
    return this.props.model.isOpen(this.props.item.id);
  }

  onItemClick (e) {
    if (this.props.isContextMenuOpen()) {
      return;
    }

    super.onItemClick(e);
  }

  render () {
    const {
        model,
        item,
        persistentState
      } = this.props,
      itemDepth = item.depth,
      hasExamples = Boolean(item.children.length),
      iconDirection = model.isOpen(item.id) ? 'down' : 'right';


    return super.render(
      this.getClasses(),
      <div
        title={item.name}
        className={this.getHeadClasses()}
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
        {
          hasExamples ?
            (
              <Button
                type='icon'
                onClick={this.handleItemToggle}
                className='collection-sidebar-list-item__toggle-btn'
              >
                <Icon
                  name={`icon-direction-${iconDirection}`}
                  className='pm-icon pm-icon-normal'
                />
              </Button>
            ) :
            (<div className='collection-sidebar-list__request-spacing' />)
        }
        <RequestIcon method={item.method || 'GET'} />
        <XPath identifier='head'>
          <div className='collection-sidebar-list-item__request__meta'>
            <InlineInput
              className='collection-sidebar-list-item__entity__name collection-sidebar-list-item__request__name'
              placeholder='Request Name'
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
              <XPath identifier='requestOption'>
                <div className='collection-sidebar-request-dropdown-actions-wrapper'>
                  <RequestActionsDropdown
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


CollectionSidebarListItemRequest.defaultProps = {
  isFocused: false,
  selected: false,
  isContextMenuOpen: _.noop
};

CollectionSidebarListItemRequest.propTypes = {
  collection: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
  model: PropTypes.instanceOf(CollectionSidebarModel).isRequired,

  activeIndent: PropTypes.object.isRequired,

  isFocused: PropTypes.bool,

  selected: PropTypes.bool,

  isContextMenuOpen: PropTypes.func
};
