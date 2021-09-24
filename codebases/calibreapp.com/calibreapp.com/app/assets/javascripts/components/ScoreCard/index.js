import styled from 'styled-components'

import { Box } from '../Grid'

export const CARD_TYPES = {
  error: 'red300',
  success: 'green300',
  warning: 'yellow300'
}

const ScoreCard = styled(Box)`
  background: #ffffff;
  box-shadow: 0px 1px 0px #e5e5e5;
  border-radius: 0px 3px 3px 0px;
  position: relative;

  &:before {
    bottom: 0;
    background-color: ${({ theme, type }) => theme.colors[CARD_TYPES[type]]};
    content: '';
    left: 0;
    position: absolute;
    top: 0;
    width: 5px;
    z-index: 1;
  }
`
ScoreCard.defaultProps = {
  p: 3
}

export default ScoreCard
