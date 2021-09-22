import { connect } from 'react-redux'
import { selectPermission } from '../stores/permissions'
import { AppState } from '../stores/index'

type PermissionComponentProps = {
  isPermitted: boolean
  children: any
}

type PermissionProps = {
  for?: string
  any?: string[]
  every?: string[]
}

export const PermissionComponent = ({
  isPermitted = false,
  children
}: PermissionComponentProps) => (isPermitted ? children : null)

export default connect((state: AppState, props: PermissionProps) => {
  const { for: permission, any = [], every = [] } = props

  const isPermitted =
    selectPermission(state, permission) ||
    (any.length > 0 && any.some(permission => selectPermission(state, permission))) ||
    (every.length > 0 && every.every(permission => selectPermission(state, permission)))

  return { isPermitted }
})(PermissionComponent)
