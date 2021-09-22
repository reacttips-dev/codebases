import React, { useRef, useEffect, forwardRef, Ref } from 'react'
import cx from 'classnames'
import mergeRefs from 'react-merge-refs'
import { Omit, HTMLProps } from '../../helpers/omitType'
import useFocusVisibleWithProps from '../../hooks/useFocusVisibleWithProps'
import useOnClickOutside from '../../hooks/useOnClickOutside'

import IconButton from '../IconButton'
import Icon from '../../primitives/Icon'

export interface SearchProps
  extends Omit<HTMLProps<HTMLInputElement>, 'onChange'> {
  /**
   * The form field ID
   * @type string
   */
  id: string
  /**
   * The associated label for the Search input. Will be visible only to screen-readers
   */
  label: string
  /**
   * Sets the placeholder text
   * @type string
   */
  placeholder?: string
  /**
   * If present, will turn the Search into a controlled component
   * @type string
   */
  value: string
  /**
   * A callback for when the Search value changes
   * @type func
   */
  onChange: (value: string) => void
  /**
   * A callback to be fired when the Search changes visibility
   * @type func
   */
  onChangeVisibility: (isVisible: boolean) => void
  /**
   * If true, the Search will be non-interactive
   * @type bool
   */
  isDisabled?: boolean
  /**
   * Determines whether the Search input is visible and interactable.
   */
  isOpen: boolean
  /**
   * If true, when clicking outside the Search all event bubbling will be preventing, essentially causing the rest of the page to be non-interactive until the Search is closed
   */
  shouldDisableEventBubbling?: boolean
}
/**
 * Searches should be used over a regular Input when the UI calls for a searching or filtering experience.
 */
const Search = forwardRef(function Search(
  props: SearchProps,
  ref: Ref<HTMLInputElement>
) {
  const {
    className,
    id,
    value,
    onChange,
    isDisabled,
    onChangeVisibility,
    shouldDisableEventBubbling,
    isOpen,
    placeholder,
    label,
    ...rest
  } = props
  const wrap = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const { focusVisible, onFocus, onBlur } = useFocusVisibleWithProps(props)

  useOnClickOutside({
    element: wrap,
    eventType: 'click',
    shouldDisableEventBubbling,
    callback: () => {
      onChangeVisibility(false)
    },
  })

  useEffect(() => {
    if (isOpen) {
      input?.current?.focus()
    }
  }, [isOpen])

  function handleOpen() {
    onChangeVisibility(true)
  }

  function handleClear() {
    onChangeVisibility(false)
    onChange('')
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value)
  }

  return (
    <div
      className={cx('hds-search', className, {
        'hds-search-is-closed': !isOpen,
        'hds-focus-visible': focusVisible,
      })}
      role="search"
      ref={wrap}
    >
      <label htmlFor={id} className="hds-sr-only">
        {label}
      </label>
      <input
        {...rest}
        ref={mergeRefs([input, ref])}
        id={id}
        type="text"
        className="hds-search-element"
        disabled={isDisabled}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={handleChange}
        value={value}
        placeholder={placeholder}
      />
      <IconButton
        className="hds-search-open-icon"
        onClick={handleOpen}
        aria-label="Open the Search input"
        size="32"
      >
        <Icon name="Search" size="24" color="surface-100" isDecorative />
      </IconButton>
      <IconButton
        className="hds-search-clear-icon"
        onClick={handleClear}
        aria-label="Clear the search input"
        size="32"
      >
        <Icon name="Close" size="24" color="surface-100" isDecorative />
      </IconButton>
    </div>
  )
})

export default Search
