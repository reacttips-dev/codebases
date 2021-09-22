import styled from 'styled-components'
import { Alert } from '@invisionapp/helios'

const ModalNotification = styled(Alert)`
  margin-bottom: ${props => props.theme.spacing.m};
`

export default ModalNotification
