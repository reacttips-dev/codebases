import styled, { keyframes } from 'styled-components'
import { Spinner, Avatar } from '@invisionapp/helios'
import { HeliosTheme } from '@invisionapp/helios/css/theme'

export const EXIT_ROW_ANIMATION_TIME = 900

export const Table = styled.section`
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.palette.structure.regular};
  background: none;
`

export const Header = styled.header`
  padding: ${({ theme }) => `${theme.spacing.m} ${theme.spacing.s}`};
  border-bottom: 1px solid ${({ theme }) => theme.palette.structure.regular};
  text-align: ${(props: any) => props.align || 'left'};
`

const fadeAndCollapseOut = keyframes`
  from {
    max-height: 200px;
    opacity: 1;
    visibility: visible;
  }
  to {
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    opacity: 0;
    visibility: hidden;
  }
`
export const TableBody = styled.div`
  padding: 0;
  margin: 0;

  .paginated-table-row-exit-active {
    overflow: hidden;
    animation-duration: ${EXIT_ROW_ANIMATION_TIME}ms;
    animation-name: ${fadeAndCollapseOut};
    animation-timing-function: ${props => props.theme.beziers.inOut};
  }
`

export const Row = styled.div<{
  noBorder?: boolean
  theme?: HeliosTheme
  alignItems?: string
}>`
  position: relative;
  display: flex;
  width: 100%;
  align-items: ${props => props.alignItems ?? 'stretch'};
  border-bottom: ${props =>
    props.noBorder ? '' : `1px solid ${props.theme?.palette.structure.regular}`};
`

type ColumnProps = {
  align?: string
}

export const Column = styled.div<ColumnProps>`
  position: relative;
  text-align: ${props => props.align ?? 'left'};
`

export const NameColumn = styled(Column)`
  z-index: 1;
  flex: 1 1 auto;
  margin-left: 64px;
`

export const PaddedColumn = styled(Column)<{
  theme: any
  noPadding?: boolean
  disabled?: boolean
}>`
  overflow: hidden;
  flex-grow: 2;
  padding: ${({ theme, noPadding }) =>
    noPadding ? '0' : `${theme.spacing.m} ${theme.spacing.s}`};
  padding-right: 0;
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  white-space: nowrap;
`

export const UserAvatar = styled(Avatar)`
  margin-right: ${({ theme }) => theme.spacing.s};
  float: left;
`

export const UserInfoColumn = styled(PaddedColumn)<{
  flex: boolean
}>`
  max-width: ${props => (props.flex ? 'unset' : '360px')};
  flex: 1;
  padding-right: 80px;
`

export const SearchIconColumn = styled(PaddedColumn)<{
  flex: boolean
}>`
  display: flex;
  max-width: ${props => (props.flex ? 'auto' : '360px')};
  min-height: 32px;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  padding-right: 80px;
`

export const RoleContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: ${(props: { alignRight: boolean }) =>
    props.alignRight ? 'flex-end' : 'flex-start'};
  padding-right: ${(props: { theme: HeliosTheme }) => props.theme.spacing.s};
  font-weight: 400;
`

export const GroupContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: 'flex-start';
  padding-right: ${props => props.theme.spacing.l};
`

export const RemoveSpinner = styled(Spinner)`
  width: 18px;
  height: 18px;
  flex: none;
  margin-left: 10px;

  svg {
    width: 18px;
    height: 18px;
  }
`

type DocumentCountColumnProps = ColumnProps & {
  flex: boolean
}

export const DocumentCountColumn = styled.div<DocumentCountColumnProps>`
  width: 140px;
  flex: ${props => (props.flex ? 1 : 'none')};
  margin-right: ${props => props.theme.spacing.m};
`

export const DocumentCountContainer = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: ${(props: { alignRight: boolean }) =>
    props.alignRight ? 'flex-end' : 'flex-start'};
  padding-right: ${(props: { theme: HeliosTheme }) => props.theme.spacing.s};
`
