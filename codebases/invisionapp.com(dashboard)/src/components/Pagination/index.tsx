import React, {
  ElementType,
  useCallback,
  useState,
  useEffect,
  forwardRef,
  Ref,
} from 'react'
import cx from 'classnames'

import { HTMLProps } from '../../helpers/omitType'
import Icon from '../../primitives/Icon'
import Text from '../../primitives/Text'

import Action from '../Action'

type TGetItemAriaLabel = {
  isNext?: boolean
  isPrevious?: boolean
  active?: boolean
  children?: React.ReactNode
}

const getItemAriaLabel = ({
  isNext,
  isPrevious,
  active,
  children,
}: TGetItemAriaLabel) => {
  if (active) {
    return `Current Page, Page ${children}`
  }
  if (isNext) {
    return 'Next Page'
  }
  if (isPrevious) {
    return 'Previous Page'
  }
  return `Go to Page ${children}`
}

type TPaginationItem = {
  active?: boolean
  children?: React.ReactNode
  disabled?: boolean
  withIcon?: boolean
  as?: ElementType
  isNext?: boolean
  isPrevious?: boolean
  currentPage?: number
}

const PaginationItem = ({
  active,
  children,
  disabled,
  as = 'a',
  isNext,
  isPrevious,
  withIcon,
  currentPage,
  ...props
}: TPaginationItem) => (
  <Text
    as="li"
    size="body-13"
    className="hds-pagination-li"
    color={active ? 'surface-0' : 'surface-100'}
  >
    <Action
      {...props}
      className={cx('hds-pagination-item', {
        'hds-pagination-item-is-active': active,
        'hds-pagination-item-is-disabled': disabled,
        'hds-pagination-item-is-with-icon': withIcon,
      })}
      as={as}
      aria-current={active ? 'true' : undefined}
      aria-label={getItemAriaLabel({
        isNext,
        isPrevious,
        active,
        children,
      })}
    >
      {children}
    </Action>
  </Text>
)

const Ellipsis = () => (
  <li className="hds-pagination-ellipsis">
    <Icon name="More" size="16" color="surface-50" isDecorative />
  </li>
)

export interface PaginationProps extends HTMLProps<HTMLDivElement> {
  /**
   * A total list of all the pages to be traversed through
   */
  items: {
    href?: string
    to?: string
  }[]
  /**
   * The current index of the active page
   */
  currentPage: number
  /**
   * The HTML element to use for each link
   */
  as?: ElementType
  /**
   * Used for accessibility purposes to denote the function of the Pagination component
   */
  'aria-label': string
}

type MiddleLink = {
  href?: string
  to?: string
  i?: number | string
  ellipsis?: boolean
}

export interface PaginationState {
  previous?: {
    href?: string
    to?: string
  }
  middle?: MiddleLink[]
  next?: {
    href?: string
    to?: string
  }
}

/**
 * Paginations contain a list of links, an easy-to-bookmark way of navigating small and large lists of content.
 */
const Pagination = forwardRef(function Pagination(
  props: PaginationProps,
  ref: Ref<HTMLDivElement>
) {
  const {
    'aria-label': ariaLabel,
    items,
    currentPage,
    className,
    as = 'a',
    ...rest
  } = props

  const getPrevious = useCallback(() => {
    if (!items) {
      return
    }
    return items[Math.max(currentPage - 2, 0)]
  }, [items, currentPage])

  const getNext = useCallback(() => {
    if (!items) {
      return
    }
    const { length } = items
    return items[Math.min(currentPage, length - 1)]
  }, [items, currentPage])

  const getMiddle = useCallback(() => {
    if (!items) {
      return
    }
    function getMiddleItem(item: string | number) {
      if (item === 'ellipsis') {
        return {
          ellipsis: true,
        }
      }
      return {
        ...items[(item as number) - 1],
        i: item,
      }
    }

    const first = 1
    const last = items.length
    const cutoff = 3 // show 3 extra if near start/end
    if (items.length <= 6) {
      return items.map((item, i) => ({ ...item, i: i + 1 }))
    }

    if (currentPage <= first + cutoff - 1) {
      return [1, 2, 3, 4, 'ellipsis', last].map(item => getMiddleItem(item))
    }

    if (currentPage >= last - cutoff + 1) {
      return [1, 'ellipsis', last - 3, last - 2, last - 1, last].map(item =>
        getMiddleItem(item)
      )
    }

    return [
      first,
      'ellipsis',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      'ellipsis',
      last,
    ].map(item => getMiddleItem(item))
  }, [items, currentPage])

  const getState = useCallback(() => {
    return {
      previous: getPrevious(),
      next: getNext(),
      middle: getMiddle(),
    }
  }, [getPrevious, getNext, getMiddle])

  const [state, setState] = useState<PaginationState>(getState())

  useEffect(() => {
    setState(getState())
  }, [currentPage, items, getState])

  const { previous, middle, next } = state

  const isFirst = currentPage === 1
  const isLast = currentPage === items.length
  return (
    <div
      {...rest}
      ref={ref}
      aria-label={ariaLabel}
      className={cx('hds-pagination', className)}
      role="navigation"
    >
      <ul className="hds-pagination-ul">
        <PaginationItem
          as={as}
          disabled={isFirst}
          withIcon
          isPrevious
          {...previous}
        >
          <Icon name="Back" size="16" color="surface-100" isDecorative />
        </PaginationItem>
        {middle &&
          middle.map(
            (item: MiddleLink, i: number): React.ReactNode =>
              item.ellipsis ? (
                <Ellipsis key={i} />
              ) : (
                <PaginationItem
                  {...item}
                  as={as}
                  active={item.i === currentPage}
                  key={item.to || item.href}
                >
                  {item.i}
                </PaginationItem>
              )
          )}
        <PaginationItem as={as} disabled={isLast} withIcon isNext {...next}>
          <Icon
            name="Forward"
            size="16"
            color="surface-100"
            aria-label="Go forward"
            isDecorative
          />
        </PaginationItem>
      </ul>
    </div>
  )
})

Pagination.defaultProps = {
  'aria-label': 'Pagination Navigation',
  as: 'a',
}

export default Pagination
