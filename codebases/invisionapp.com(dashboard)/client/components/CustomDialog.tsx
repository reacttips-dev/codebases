import styled from 'styled-components'
import { Dialog } from '@invisionapp/helios'

// FIXME: this is hack to style the buttons in the dialog until the version of
// Helios is upgraded
export const CustomDialog = styled(Dialog)`
  z-index: 20;

  /*
    This lets things over flow outside of the dialog bounds. Helios team said to do
  this for now
  */
  & > div > div {
    overflow: unset;
    overscroll-behavior: unset;
  }

  & div[data-test-id='helios-dialog-foreground'] > div:nth-child(2) {
    justify-content: center;
  }

  & div[data-test-id='helios-dialog-foreground'] > div:nth-child(2) button {
    width: unset;
    margin: 0 ${props => props.theme.spacing.xs};
  }
`
