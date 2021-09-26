import styled from 'styled-components'

import { Flex, Box } from './Grid'

const Dl = styled(Flex)`
  white-space: initial;
`
Dl.defaultProps = {
  as: 'dl',
  fontSize: 2,
  m: 0,
  flexWrap: 'nowrap',
  width: 1
}

export const Dt = styled(Box)``
Dt.defaultProps = {
  as: 'dt',
  flex: 1,
  flexBasis: '25%',
  maxWidth: '25%',
  py: 2,
  fontWeight: 600,
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'grey100'
}

export const Dd = styled(Box)`
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
`
Dd.defaultProps = {
  as: 'dd',
  flex: 1,
  flexBasis: '75%',
  maxWidth: '75%',
  ml: 0,
  py: 2,
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'grey100'
}

export default Dl
