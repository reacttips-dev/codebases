import styled from "@emotion/styled"

import { visuallyHidden } from "../../../utils/styles"

export const WidgetContainer = styled(`div`)`
  margin: ${p => p.theme.space[3]} auto;
  padding: 0 ${p => p.theme.space[7]} 5.5rem;
  max-width: 42rem;

  ${p => p.theme.mediaQueries.tablet} {
    padding-bottom: ${p => p.theme.space[3]};
  }

  ${p => p.theme.mediaQueries.desktop} {
    &:not(.closed) {
      height: 26rem;
      width: 20rem;
    }

    bottom: ${p => p.theme.space[7]};
    padding: 0;
    position: fixed;
    right: ${p => p.theme.space[7]};
    margin: 0;
    width: auto;
  }
`

export const Title = styled(`h2`)`
  display: block;
  font-size: ${p => p.theme.fontSizes[4]};
  letter-spacing: ${p => p.theme.letterSpacings.tight};
  line-height: ${p => p.theme.lineHeights.dense};
  margin: 0;
  margin-bottom: ${p => p.theme.space[3]};
  text-align: center;
`

export const Actions = styled(`div`)`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

export const ScreenReaderText = styled.span(visuallyHidden)
