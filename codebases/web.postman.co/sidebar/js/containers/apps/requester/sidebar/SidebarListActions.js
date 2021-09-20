import React, { Component } from 'react';
import { Icon } from '@postman/aether';
import { observer } from 'mobx-react';
import SidebarFilter from './SidebarFilter';
import { Button } from '../../../../components/base/Buttons';
import { Dropdown, DropdownButton } from '../../../../components/base/Dropdowns';
import XPath from '../../../../components/base/XPaths/XPath';

@observer
export default class SidebarListActions extends Component {
  constructor (props) {
    super(props);

    this.handleDropdownSelect = this.handleDropdownSelect.bind(this);
  }

  handleDropdownSelect (action) {
    this.props.onActionsDropdownSelect && this.props.onActionsDropdownSelect(action);
  }

  getCreateNewButton (createNewConfig) {
    if (!createNewConfig) {
      return null;
    }

    const createNewButton = (
      <Button
        className='create-new__btn'
        onClick={createNewConfig.onCreate}
        tooltip={createNewConfig.tooltip}
        disabled={createNewConfig.disabled}
        type='icon'
      >
        <Icon
          name='icon-action-add-stroke'
          size='large'
          color='content-color-secondary'
        />
      </Button>
    );

    if (createNewConfig.xPathIdentifier) {
      return (
        <XPath identifier={createNewConfig.xPathIdentifier}>
          {createNewButton}
        </XPath>
      );
    }

    return createNewButton;
  }

  render () {
    return (
      <div className='requester-left-sidebar__actions-container'>
        { this.getCreateNewButton(this.props.createNewConfig) }
        <SidebarFilter
          onSearch={this.props.onSearch}
          className={this.props.className}
          searchQuery={this.props.searchQuery}
        />
        {
          (this.props.rightMetaContainer || this.props.moreActions) ?
            (<div className='secondary-actions-container' >
              { this.props.rightMetaContainer}
              { this.props.moreActions ?
                (
                  <Dropdown
                    ref='menu'
                    onSelect={this.handleDropdownSelect}
                    className='actions-dropdown'
                  >
                    <DropdownButton
                      dropdownStyle='nocaret'
                      type='custom'
                    >
                      <Button
                        tooltip='View more actions'
                      >
                        <Icon name='icon-action-options-stroke' className='dropdown-action-button pm-icon pm-icon-normal' />
                      </Button>
                    </DropdownButton>
                    {
                      this.props.moreActions
                    }
                  </Dropdown>
                ) : null
              }
            </div>) : ''
        }
      </div>
    );
  }
}
