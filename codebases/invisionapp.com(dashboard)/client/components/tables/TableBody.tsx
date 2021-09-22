import React from 'react'
import { useSelector } from 'react-redux'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { Checkbox, Tooltip } from '@invisionapp/helios'
import styled from 'styled-components'
import { TableBody as BodyForTable, EXIT_ROW_ANIMATION_TIME } from './Table'
import Permission from '../Permission'
import { selectHasBulkItems } from '../../stores/bulkItems'

const ToggleTransitionGroup = ({
  shouldTransition,
  ...props
}: any & {
  shouldTransition: boolean
  children: any
}) => {
  return shouldTransition ? <TransitionGroup {...props} /> : props.children
}

const ToggleCSSTransition = ({
  shouldTransition,
  ...props
}: any & {
  shouldTransition: boolean
  children: any
}) => {
  return shouldTransition ? <CSSTransition {...props} /> : props.children
}

type Item = {
  [key: string]: any
}
type TableBodyComponentProps = {
  handleRowClick?: (item: Item) => void
  hideBulk?: boolean
  isRowChecked?: (item: Item) => boolean
  items: Item[]
  renderRow: (item: Item) => React.Component
  rowDisabledMessage: (item: Item) => string | null
  rowKey: (item: Item) => string
  rowTransition?: boolean
}

const TableBodyComponent = (props: TableBodyComponentProps) => {
  const {
    items,
    renderRow,
    rowKey,
    rowTransition,
    hideBulk,
    isRowChecked = () => false,
    handleRowClick = () => {}
  } = props

  const hasBulkItems = useSelector(selectHasBulkItems)

  const checkboxVisibleForItem = (item: Item) => {
    return isRowChecked(item) || hasBulkItems
  }

  const rowIsActionable = () => hasBulkItems

  const rowClicked = (item: Item) => {
    const rowDisabledMessage = props.rowDisabledMessage(item)

    if (!rowDisabledMessage && rowIsActionable()) {
      handleRowClick(item)
    }
  }

  const renderBulkCheckbox = ({ key, item }: { key: string; item: Item }) => {
    const rowDisabledMessage = props.rowDisabledMessage(item)

    return (
      <Permission for="People.BulkEdit">
        <BulkCheckboxWrapper visible={checkboxVisibleForItem(item)}>
          <Tooltip
            trigger={
              <Checkbox
                id={key}
                className="checkbox"
                checked={isRowChecked(item)}
                onChange={() => handleRowClick(item)}
                unstyled
                disabled={!!rowDisabledMessage}
              />
            }
            disabled={!rowDisabledMessage}
            placement="top"
            chevron="start"
            offset={{
              x: -4
            }}
          >
            {rowDisabledMessage}
          </Tooltip>
        </BulkCheckboxWrapper>
      </Permission>
    )
  }

  const renderBulkRow = (item: Item, key: string) => {
    const rowDisabledMessage = props.rowDisabledMessage(item)
    return (
      <RowWrapper
        actionable={!rowDisabledMessage && rowIsActionable()}
        actionDisabled={!!rowDisabledMessage && rowIsActionable()}
        isSelected={isRowChecked(item)}
      >
        {renderBulkCheckbox({ key, item })}
        <a onClick={() => rowClicked(item)}>{renderRow(item)}</a>
      </RowWrapper>
    )
  }

  const renderTableRow = (item: Item, key: string) => {
    switch (hideBulk) {
      case true:
        return renderRow(item)
      default:
        return renderBulkRow(item, key)
    }
  }

  return (
    <ToggleTransitionGroup component={BodyForTable} shouldTransition={rowTransition}>
      {items.map(item => {
        const key = rowKey(item)

        return (
          <ToggleCSSTransition
            classNames="paginated-table-row"
            timeout={EXIT_ROW_ANIMATION_TIME}
            shouldTransition={rowTransition}
            key={key}
          >
            {renderTableRow(item, key)}
          </ToggleCSSTransition>
        )
      })}
    </ToggleTransitionGroup>
  )
}

TableBodyComponent.defaultProps = {
  items: [],
  rowTransition: true,
  isRowChecked: () => {},
  handleRowClick: () => {},
  rowDisabledMessage() {},
  hideBulk: false,
  renderRow: () => null,
  bulkBar: false
}

const BulkCheckboxWrapper = styled.div<{ visible: boolean }>`
  position: absolute;
  z-index: ${props => props.theme.zindex.base};
  top: 50%;
  left: -51px;
  width: 50px;
  height: 40px;
  padding: 10px;
  opacity: 1;
  transform: translateY(-50%);
  transition: all 150ms linear;

  ${({ visible }) => {
    if (visible) {
      return `
        opacity: 1;
        left: -51px;
      `
    }
    return `
      opacity: 0;
      left: -41px;
    `
  }};
`

type RowWrapperProps = {
  isSelected: boolean
  actionable: boolean
  actionDisabled: boolean
}
const RowWrapper = styled.div<RowWrapperProps>`
  position: relative;
  transition: background-color 90ms linear;

  ${props =>
    props.isSelected ? `background-color: ${props.theme.palette.info.lighter};` : ''}

  &:hover {
    ${props =>
      props.actionable
        ? `
            background-color: ${props.theme.palette.structure.lightest};
            cursor: pointer;
          `
        : ''}

    ${props => (props.actionDisabled ? 'cursor: not-allowed;' : '')}
  }

  &:hover ${BulkCheckboxWrapper} {
    left: -51px;
    opacity: 1;
  }
`

export default TableBodyComponent
