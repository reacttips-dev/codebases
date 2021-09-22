import styled from 'styled-components'
import { Text } from '@invisionapp/helios'

const Heading = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  text-align: center;
`

export default Heading
