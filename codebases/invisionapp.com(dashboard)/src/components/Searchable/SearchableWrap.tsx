import React, { Component, ReactNode } from 'react'
import Downshift, {
  DownshiftProps,
  ControllerStateAndHelpers,
  GetItemPropsOptions,
  DownshiftState,
  StateChangeOptions,
} from 'downshift'
import { SearchableProps } from '.'
import { SearchableOption, SearchableOptions } from './types'

export interface SearchableWrapProps
  extends Omit<DownshiftProps<SearchableOption>, 'children' | 'onChange'> {
  children: (options: ChildrenOptions) => ReactNode
  isMulti?: boolean
  initialSelected?: SearchableOptions
  canCloseOnItemClick?: boolean
  onChange?: SearchableProps['onChange']
}

export interface SearchableWrapState {
  selectedItems: SearchableOptions
}

export interface ChildrenOptions
  extends ControllerStateAndHelpers<SearchableOption> {
  selectedItems: SearchableOptions
  getRemoveButtonProps: any
  removeItem: any
  clearAllItems: () => void
}

export type SearchableRenderOptionProps = SearchableProps &
  GetItemPropsOptions<SearchableOption> & {
    isActive?: boolean
    item: SearchableOption
  }

class SearchableWrap extends Component<
  SearchableWrapProps,
  SearchableWrapState
> {
  constructor(props: SearchableWrapProps) {
    super(props)

    const { initialSelected } = this.props
    this.state = {
      selectedItems: initialSelected || [],
    }
  }

  stateReducer = (
    state: DownshiftState<SearchableOption>,
    changes: StateChangeOptions<SearchableOption>
  ) => {
    const { canCloseOnItemClick } = this.props
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          highlightedIndex: state.highlightedIndex,
          isOpen: !canCloseOnItemClick,
          inputValue: '',
        }
      default:
        return changes
    }
  }

  handleSelection = (selectedItem: SearchableOption | null) => {
    const callOnChange = () => {
      const { selectedItems } = this.state

      const { onChange } = this.props
      if (onChange) {
        onChange(selectedItems)
      }
    }
    if (!selectedItem) {
      return
    }
    this.addSelectedItem(selectedItem, callOnChange)
  }

  removeItem = (item: SearchableOption, cb?: () => void): void => {
    this.setState(({ selectedItems }) => {
      return {
        selectedItems: selectedItems.filter(i => i !== item),
      }
    }, cb)
  }

  addSelectedItem = (item: SearchableOption, cb?: () => void) => {
    const { isMulti } = this.props
    if (!isMulti) {
      this.setState(
        () => ({
          selectedItems: [item],
        }),
        cb
      )
    } else {
      this.setState(
        ({ selectedItems }) => ({
          selectedItems: [...selectedItems, item],
        }),
        cb
      )
    }
  }

  getRemoveButtonProps = ({
    onClick,
    item,
    ...props
  }: GetItemPropsOptions<SearchableOption>) => {
    return {
      onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        onClick && onClick(e)
        e.stopPropagation()
        this.removeItem(item)
      },
      ...props,
    }
  }

  clearAllItems = () => {
    this.setState({
      selectedItems: [],
    })
  }

  getStateAndHelpers = (
    downshift: ControllerStateAndHelpers<SearchableOption>
  ): ChildrenOptions => {
    const { selectedItems } = this.state
    const { getRemoveButtonProps, removeItem, clearAllItems } = this
    return {
      getRemoveButtonProps,
      removeItem,
      selectedItems,
      clearAllItems,
      ...downshift,
    }
  }

  handleStateChange = (
    changes: StateChangeOptions<SearchableOption>,
    state: ControllerStateAndHelpers<SearchableOption>
  ) => {
    const { onInputValueChange } = this.props
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        onInputValueChange && onInputValueChange('', state)
        break
      default:
        break
    }
  }

  render() {
    const { children, ...props } = this.props

    return (
      <Downshift
        {...props}
        stateReducer={this.stateReducer}
        onChange={this.handleSelection}
        selectedItem={null}
        onStateChange={this.handleStateChange}
      >
        {downshift => children(this.getStateAndHelpers(downshift))}
      </Downshift>
    )
  }
}

export default SearchableWrap
