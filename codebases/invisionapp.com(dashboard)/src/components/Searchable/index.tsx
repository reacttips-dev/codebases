import React, { ReactNode } from 'react'
import cx from 'classnames'
import { GetItemPropsOptions } from 'downshift'
import { matchSorter } from 'match-sorter'
import { Omit, HTMLProps } from '../../helpers/omitType'
import Text from '../../primitives/Text'
import Icon from '../../primitives/Icon'
import SearchableWrap from './SearchableWrap'
import Tag from '../Tag'
import IconButton from '../IconButton'
import { SearchableOption, SearchableOptions } from './types'
import Action from '../Action'

export type SearchableRenderOptionProps = SearchableProps &
  GetItemPropsOptions<SearchableOption> & {
    isActive?: boolean
    item: SearchableOption
  }

export interface SearchableProps
  extends Omit<HTMLProps<HTMLDivElement>, 'onChange' | 'onSelect'> {
  /**
   * Represents a caption for the form element.
   */
  label: string
  /**
   * The list of options that the Searchable will traverse.
   */
  options: SearchableOptions
  /**
   * If you want to customize the appoearance of each option in the list, use this render prop.
   */
  renderOption: (props: SearchableRenderOptionProps) => ReactNode
  /**
   * If true, will support selecting multiple values.
   */
  isMulti?: boolean
  /**
   * Sets the maximum height that the options list can take
   */
  maxHeight: number
  /**
   * Callback that fires whenever the value of the selected options changes.
   */
  onChange?: (selectedItems: SearchableOptions | null) => void
  /**
   * Callback that gets fires whenever an individual option is selected.
   */
  onSelect?: (selectedItem: SearchableOption | null) => void
  /**
   * The value of the form input
   */
  inputValue: string
  /**
   * Callback that gets fired when the input gets changed.
   */
  onInputValueChange: (s: string) => void
  /**
   * The initially selected options
   */
  initialSelected?: SearchableOptions
  /**
   * Determines whether selecting an option will close the list of options.
   */
  canCloseOnItemClick?: boolean
  /**
   * If true, will display the search icon to the left of the filter input.
   */
  hasSearchIcon?: boolean
  /**
   * If true, then no filtering is possible within the list.
   */
  isFilteringDisabled?: boolean
  /**
   * If true, will show a clear IconButton to reset the Searchable.
   */
  isClearable?: boolean
}

/**
 * Searchables provide a way of filtering and selecting lists of options.
 */
class Searchable extends React.Component<SearchableProps> {
  private input = React.createRef<HTMLInputElement>()

  static defaultProps = {
    maxHeight: 300,
    placeholder: 'Search',
    hasSearchIcon: true,
    isClearable: true,
    isFilteringDisabled: false,
    isMulti: true,
    renderOption: (props: SearchableRenderOptionProps): ReactNode => {
      const { item } = props
      return item.label
    },
  }

  itemToString = (item: SearchableOption | null) => (item ? item.label : '')

  filterItems = (
    filter: string | null,
    selectedItems: SearchableOptions = []
  ) => {
    const { options } = this.props
    const values = selectedItems.map(v => v.value)
    const filteredOptions = options.filter(v => !values.includes(v.value))
    return filter
      ? matchSorter(filteredOptions, filter, {
          keys: ['value', 'label'],
        })
      : filteredOptions
  }

  render() {
    const {
      renderOption,
      options,
      className,
      placeholder,
      maxHeight,
      isMulti,
      onChange,
      onSelect,
      initialSelected,
      canCloseOnItemClick,
      hasSearchIcon,
      isFilteringDisabled,
      isClearable,
      label,
      onInputValueChange,
      inputValue: controlledInputValue,
      ...rest
    } = this.props
    return (
      <SearchableWrap
        isMulti={isMulti}
        onChange={onChange}
        onSelect={onSelect}
        itemToString={this.itemToString}
        initialSelected={initialSelected}
        canCloseOnItemClick={canCloseOnItemClick}
        inputValue={controlledInputValue}
        onInputValueChange={onInputValueChange}
      >
        {({
          getInputProps,
          getMenuProps,
          getLabelProps,
          // note that the getRemoveButtonProps prop getter and the removeItem
          // action are coming from MultiDownshift composibility for the win!
          getRemoveButtonProps,
          removeItem,

          isOpen,
          inputValue,
          selectedItems,
          getItemProps,
          highlightedIndex,
          toggleMenu,
          reset,
          clearAllItems,
        }) => {
          const hasSelectedItems = selectedItems.length > 0
          const searchableHandler = () => {
            toggleMenu()
            !isOpen && this.input?.current?.focus()
          }
          const canShowClearable =
            (isClearable && inputValue !== '') || selectedItems.length
          const filteredItems = this.filterItems(inputValue, selectedItems)

          return (
            <div {...rest} className={cx('hds-searchable-wrap', className)}>
              <Text
                as="label"
                className="hds-searchable-label hds-block"
                size="label-12"
                color="surface-100"
                {...getLabelProps()}
              >
                {label}
              </Text>
              {/* eslint-disable */}
              <div className={cx("hds-searchable", {
                'hds-searchable-is-clearable': isClearable,
              })}
                onClick={searchableHandler}
              >
                {/* eslint-enable */}
                <div className={cx('hds-searchable-inner')}>
                  {hasSearchIcon && (
                    <div className="hds-searchable-search">
                      <Icon
                        name="Search"
                        color="surface-100"
                        size="24"
                        isDecorative
                      />
                    </div>
                  )}
                  {hasSelectedItems && (
                    <div className="hds-searchable-tag-wrap">
                      {selectedItems.map(item =>
                        isMulti ? (
                          <Tag
                            key={item.value}
                            className="hds-searchable-tag"
                            isDismissable
                            isCompact
                            {...getRemoveButtonProps({ item })}
                          >
                            <span>{item.label}</span>
                          </Tag>
                        ) : (
                          <Text
                            key={item.value}
                            size="body-16"
                            color="surface-100"
                            className="hds-searchable-single-selected"
                          >
                            {item.label}
                          </Text>
                        )
                      )}
                    </div>
                  )}
                  {!isFilteringDisabled && (
                    <input
                      className="hds-searchable-input"
                      ref={this.input}
                      placeholder={placeholder}
                      autoComplete="off"
                      {...getInputProps({
                        onKeyDown(event) {
                          if (event.key === 'Backspace' && !inputValue) {
                            removeItem(selectedItems[selectedItems.length - 1])
                          }
                        },
                      })}
                    />
                  )}
                </div>
                {canShowClearable ? (
                  <IconButton
                    className="hds-searchable-clear-button"
                    onClick={() => {
                      reset()
                      clearAllItems()
                    }}
                    size="24"
                  >
                    <Icon
                      name="Close"
                      color="surface-100"
                      size="24"
                      aria-label="Clear the Searchable"
                    />
                  </IconButton>
                ) : null}
                <div
                  className={cx('hds-searchable-controller-button', {
                    'hds-searchable-is-open': isOpen,
                  })}
                >
                  <Icon
                    name="ExpandMenuAlt"
                    className="hds-searchable-arrow"
                    color="surface-100"
                    size="24"
                    isDecorative
                  />
                </div>
              </div>
              <ul
                className={cx('hds-searchable-menu', {
                  'hds-hidden': !isOpen || !filteredItems.length,
                })}
                {...getMenuProps({ open: isOpen })}
                style={{
                  maxHeight,
                }}
              >
                {isOpen
                  ? filteredItems.map((item, index) => {
                      const itemProps = getItemProps({
                        item,
                        index,
                      })
                      return (
                        <li
                          key={itemProps.id}
                          className="hds-searchable-li"
                          role="menuitem"
                        >
                          <Action
                            as="button"
                            className={cx(
                              'hds-searchable-option hds-transition-on-hover',
                              {
                                'hds-searchable-option-is-selected': selectedItems.includes(
                                  item
                                ),
                                'hds-searchable-option-is-active':
                                  highlightedIndex === index,
                              }
                            )}
                            {...itemProps}
                          >
                            {renderOption({
                              ...this.props,
                              item,
                              ...getItemProps({
                                item,
                                index,
                                isSelected: selectedItems.includes(item),
                              }),
                              isActive: highlightedIndex === index,
                            })}
                          </Action>
                        </li>
                      )
                    })
                  : null}
              </ul>
            </div>
          )
        }}
      </SearchableWrap>
    )
  }
}

export default Searchable
