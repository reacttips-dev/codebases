import React from 'react';
import MultiSelect from 'react-select';
import { Flex, Text, Icon, Tooltip } from '@postman/aether';
import styled from 'styled-components';

import {
  APIDropdownIndicatorIcon,
  APIEmptyState,
  APIChipLabel,
  APIMultiSelectChipCloseIcon } from '../components/AddAPIMultiSelectCustomComponents';

const SEARCHBAR_MAX_HEIGHT = '64px',
  SEARCHBAR_MIN_HEIGHT = '32px',
  APICHIP_MAX_WIDTH = '180px',
  API_LABEL_HEIGHT = '20px',
  DROPDOWN_MAX_HEIGHT = '170px',
  ALREADY_PUBLISHED = 'alreadyPublished',
  NO_PERMISSION = 'noPermission',
  CAN_PUBLISH = 'canPublish',
  DropdownStylesContainer = styled.div`
  .react-select{
    &__control{
      overflow-y: auto;
      max-height: ${SEARCHBAR_MAX_HEIGHT};
      min-height: ${SEARCHBAR_MIN_HEIGHT};
      margin-top: var(--spacing-xs);
      border: ${(props) =>
        `${props.theme['border-width-default']} ${props.theme['border-style-solid']} ${props.theme['input-border-color-default']};`};
      transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      background-color: ${(props) => props.theme['background-color-primary']};
      &--is-focused {
        outline: none;
        border: ${(props) =>
          `${props.theme['border-width-default']} ${props.theme['border-style-solid']} ${props.theme['input-border-color-focus']};`};
        box-shadow: ${(props) =>
          `0 0 0 2px ${props.theme['input-shadow-focus']};`};

        &:hover {
          border: ${(props) =>
            `${props.theme['border-width-default']} ${props.theme['border-style-solid']} ${props.theme['input-border-color-focus']};`};
        }
        .react-select__multi-value__remove{
          padding: 0px;
          background-color: transparent !important;
          display: flex
        }
      }
    },
    &__multi-value__label{
      height: ${API_LABEL_HEIGHT};
    },
    &__menu-list{
      max-height: ${DROPDOWN_MAX_HEIGHT};
      padding: var(--spacing-s) var(--spacing-zero);
      background-color: var(--background-color-primary)
    },
    &__placeholder{
      font-size: ${(props) => props.theme['text-size-m']};
      line-height: ${(props) => props.theme['line-height-m']};
      color: ${(props) => props.theme['content-color-tertiary']};
      left: ${(props) => props.theme['spacing-m']};
      right: ${(props) => props.theme['spacing-l']};
      margin: var(--spacing-zero);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      padding-left: 2px;
    },
    &__indicator-separator{
      display:none
    },
    &__indicator{
      svg path {
        fill: ${(props) => props.theme['content-color-secondary']};
      };
      padding: ${(props) =>
        `${props.theme['spacing-zero']} ${props.theme['spacing-s']};`};
    },
    &__value-container{
      position: static;
      height: 100%;
      padding: ${(props) =>
        `${props.theme['spacing-xs']} ${props.theme['spacing-m']};`};
      font-size: ${(props) => props.theme['text-size-m']};
      color: ${(props) => props.theme['content-color-primary']};
      &.react-select__value-container--has-value{
        padding: ${(props) => `${props.theme['spacing-xs']}`};
      };
      gap: var(--spacing-xs);
    },
    &__menu-notice{
      padding: var(--spacing-zero)
    },
    &__menu{
      background-color: ${(props) => props.theme['background-color-primary']};
      box-shadow: ${(props) => props.theme['popover-box-shadow']};
      margin-top: var(--spacing-xs);
      border-radius: 0px;
      z-index: 1000;
    }
    &__input{
      color: ${(props) => props.theme['content-color-primary']};
      input {
        caret-color: ${(props) => props.theme['content-color-primary']};
      };
    },
    &__multi-value{
      box-sizing: border-box;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      margin: var(--spacing-zero)
      height: ${(props) => props.theme['size-s']};
      color: ${(props) => props.theme['content-color-primary']};
      background-color: ${(props) => props.theme['highlight-background-color-tertiary']};
      border-radius: ${(props) => props.theme['border-radius-default']};
      max-width: ${APICHIP_MAX_WIDTH};
    }
    &__multi-value__remove{
      padding: 0px;
      background-color: transparent !important;
      display: none
    }
    &__option{
      padding: ${(props) => props.theme['spacing-zero']};
      &:active {
        background-color: transparent;
      }
      ':hover': {
        backgroundColor: 'transparent'
      }
    }

  }
  `;

export default class AddMultipleAPIsDropDown extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      selectedOption: null
    };
  }
  CustomOption = ({ value, label, innerProps }) => {
    const typeOfAPI = this.props.APIData[value].type;

    if (typeOfAPI === NO_PERMISSION) {
      return (
        <Flex {...innerProps} className='private-network-add-entity-modal-dropdown-APICanNotBeAdded' >
          <Text color='content-color-tertiary' isTruncated>{label}</Text>
          <Tooltip content='You don’t have permission to add this API to the Private API Network.' placement='right'>
            <Icon
              name='icon-state-locked-stroke'
              color='content-color-tertiary'
              size='medium'
            />
          </Tooltip>
        </Flex>
      );
    }
    else if (typeOfAPI === ALREADY_PUBLISHED) {
      return (
        <Flex {...innerProps} className='private-network-add-entity-modal-dropdown-APICanNotBeAdded' wrap='nowrap'>
          <Text color='content-color-tertiary' isTruncated>{label}</Text>
          <Text color='content-color-tertiary' className='private-network-add-entity-modal-dropdown-APICanNotBeAdded__AlreadyAdded'>Already added</Text>
        </Flex>
      );
    }
    else {
      return (
        <div {...innerProps} className='private-network-add-entity-modal-dropdown-APICanBeAdded'>
          <Text color='content-color-primary' isTruncated className='private-network-add-entity-modal-dropdown-APICanBeAdded-text'>{label}</Text>
        </div>
      );
    }
  };

  handleChange = (selectedOption) => {
    this.setState({ selectedOption }, () =>
      this.props.onAPISelect(selectedOption)
    );
  };

   handleSortOptions = (a, b) => {
    if (this.props.APIData[a.value].type === CAN_PUBLISH) return -1;
    else if (this.props.APIData[b.value].type === CAN_PUBLISH) return 1;
    else {
      if (this.props.APIData[a.value].type === NO_PERMISSION) return -1;
      else if (this.props.APIData[b.value].type === NO_PERMISSION) return 1;
      else return 0;
    }
  }

  render () {
    const options = _.map((this.props.APIData), (key, val) => {
      return { value: val, label: key.name };
    }),
    { selectedOption } = this.state;
    options.sort(this.handleSortOptions);

    return (
      <DropdownStylesContainer>
        <MultiSelect
          classNamePrefix='react-select'
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
          isMulti
          isSearchable
          isClearable={false}
          placeholder='Search APIs'
          emptyStateMessage={this.props.isLoading ? 'Loading' : 'No APIs found'}
          components={{
            DropdownIndicator: APIDropdownIndicatorIcon,
            Option: this.CustomOption,
            MultiValueRemove: APIMultiSelectChipCloseIcon,
            NoOptionsMessage: APIEmptyState,
            MultiValueLabel: APIChipLabel
          }}
          closeMenuOnSelect={false}
        />
      </DropdownStylesContainer>
    );
  }

}
