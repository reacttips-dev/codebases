import * as React from 'react'
import { Collapse } from 'react-collapse'
import styled from 'styled-components'
import { Text, Toggle, Tooltip } from '@invisionapp/helios'

// NOTE: One possible helpful addition is to configure the length of the animation
// I'll leave it out for now though because we don't need that yet

class ToggleContent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: props.isOpen || false
    }
  }

  UNSAFE_componentWillReceiveProps({ isOpen }) {
    // Sync state with incoming props
    if (isOpen !== undefined) {
      this.setState({ isOpen })
    }
  }

  toggle = isOpen => {
    // Either track toggle with internal state or external state
    if (this.props.onToggle) {
      this.props.onToggle(isOpen)
    } else {
      this.setState({ isOpen })
    }
  }

  toggleComponent = () => (
    <Toggle
      id={this.props.id}
      onChange={checked => this.toggle(checked)}
      checked={this.state.isOpen}
      disabled={this.props.disableToggle}
    >
      <Text order="body">{this.props.label}</Text>
    </Toggle>
  )

  render() {
    return (
      <div>
        <ToggleRow border={this.props.border}>
          {this.props.tooltip ? (
            <Tooltip color="dark" chevron="end" trigger={this.toggleComponent()}>
              <Text align="center" color="white">
                {this.props.tooltip}
              </Text>
            </Tooltip>
          ) : (
            this.toggleComponent()
          )}
        </ToggleRow>

        <DropAndFade isOpened={this.state.isOpen}>{this.props.children}</DropAndFade>
      </div>
    )
  }
}

const ToggleRow = styled.div`
  padding: ${props => props.theme.spacing.m} ${props => props.theme.spacing.s}
    ${props => props.theme.spacing.m};
  border: ${props =>
    props.border ? `1px solid ${props.theme.palette.structure.lighter}` : 'none'};
  border-right: 0;
  border-left: 0;
  margin-bottom: ${props => (props.border ? props.theme.spacing.l : '0')};
`

const DropAndFade = styled(Collapse)`
  opacity: ${({ isOpened }) => (isOpened ? 1 : 0)};
  transition: opacity 0.12s linear;
`

export default ToggleContent
