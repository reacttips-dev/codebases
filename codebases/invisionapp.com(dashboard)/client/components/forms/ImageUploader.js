import React from 'react'
import styled from 'styled-components'
import AddIcon from '@invisionapp/helios/icons/Add'
import FileInput from './FileInput'

const ImageUploader = ({
  logo,
  onClick,
  onUpload,
  isUploading,
  isDeleting,
  uploadCompleted,
  deleteCompleted
}) => {
  const isWorking = isUploading || isDeleting || uploadCompleted || deleteCompleted

  return (
    <InputWrapper logo={logo}>
      <FileInput name="icon" onClick={onClick} onChange={e => onUpload(e)} />
      <TeamIcon src={logo} />
      {logo && !isWorking && <IconOverlay className="overlay" />}
      {!isWorking && <StyledAddIcon logo={logo} size={48} className="upload-icons" />}
    </InputWrapper>
  )
}

class TeamIcon extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      src: props.src,
      isVisible: !!props.src
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let isVisible = false
    let { src } = this.state
    if (nextProps.src) {
      isVisible = true
      src = nextProps.src
    }
    this.setState(state => ({ ...state, isVisible, src }))
  }

  render() {
    return (
      <ImgWrapper isVisible={this.state.isVisible}>
        <StyledImg src={this.state.src} />
      </ImgWrapper>
    )
  }
}

const ImgWrapper = styled.div`
  position: relative;
  height: 100%;
  flex: 0 0 100%;

  ${({ isVisible }) => {
    if (isVisible) {
      return `
        opacity: 1;
      `
    }
    return `
      opacity: 0;
    `
  }};
`

const StyledAddIcon = styled(AddIcon)`
  position: absolute;
  path {
    fill: ${({ theme }) => theme.palette.structure.regular};
  }

  ${({ logo }) => {
    if (logo) {
      return `
        transform: rotate(90deg) scale(1.5);
      `
    }
    return `
      transform: rotate(0deg) scale(1.5);
    `
  }};
`

const StyledImg = styled.img`
  max-width: 100%;
  height: 100%;
  object-fit: cover;
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;
  width: 200px;
  height: 200px;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: ${({ theme }) => theme.palette.structure.lighter};
  margin: 0 auto;
  background-color: ${({ theme }) => theme.palette.structure.lightest};
  border-radius: 20px;
  transition: all 0.2s ease-in-out;

  & * {
    transition: all 0.2s ease-in-out;
  }

  &:hover {
    border-color: ${({ theme }) => theme.palette.structure.regular};
  }

  ${props => {
    if (props.logo) {
      return `
        box-shadow: 0 -1px 1px 0 rgba(0,0,0,0.05), 0 1px 2px 0 rgba(0,0,0,0.2);

        & .overlay {
          opacity: 0;
        }

        & svg {
          opacity: 0;
        }

        &:hover {
          .overlay {
            opacity: 0.6;
          }

          svg {
            opacity: 1;
            transform: rotate(180deg) scale(1.5);
          }
        }
      `
    }
    return `
      border-style: dashed;

      &:hover svg {
        transform: rotate(90deg) scale(1.5);
      }
    `
  }};
`
const IconOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.palette.text.regular};
`

export default ImageUploader
