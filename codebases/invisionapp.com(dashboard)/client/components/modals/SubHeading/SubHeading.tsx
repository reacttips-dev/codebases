import styled from 'styled-components'
import { Text } from '@invisionapp/helios'

const SubHeading = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.l};
  font-size: 16px;
  text-align: center;
`

export default SubHeading
