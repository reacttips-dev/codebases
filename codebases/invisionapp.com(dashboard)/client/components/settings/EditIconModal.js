import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Text, Button, Link, LoadingDots, Padded, Spaced } from '@invisionapp/helios'
import TrashIcon from '@invisionapp/helios/icons/Trash'
import AddIcon from '@invisionapp/helios/icons/Add'
import fileType from '../../helpers/fileType'
import ModalContent from '../Modal/ModalContent'
import ModalCloseWarning from '../Modal/ModalCloseWarning'
import Wrapper from '../modals/Wrapper'
import ImageUploader from '../forms/ImageUploader'
import FormWrapper from '../forms/FormWrapper'
import FileInput from '../forms/FileInput'
import Notification from '../Notification'
import {
  selectLogo,
  uploadLogo,
  deleteLogo,
  resetLogoState,
  UPLOAD_LOGO,
  DELETE_LOGO
} from '../../stores/logo'
import { navigateExternally } from '../../stores/location'
import { createNotification, clearNotification } from '../../stores/notifications'
import {
  trackSettingsTeamIconClosed,
  trackSettingsTeamIconRemoved,
  trackSettingsTeamIconReplaced,
  trackSettingsTeamIconUploaded
} from '../../helpers/analytics'

class EditIconModal extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      showButtons: !!props.logo.uri,
      logoUrl: props.logo.uri,
      pristine: true,
      valid: true
    }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    // If we're done deleting and it was successful, close the portal
    if (
      nextProps.logo.deleteCompleted &&
      nextProps.logo.deleteCompleted &&
      !nextProps.logo.isDeleting &&
      !nextState.pristine &&
      nextProps.isVisible
    ) {
      this.complete()
    }

    // If we're done uploading and it was successful, close the portal
    if (
      nextProps.logo.uploadCompleted &&
      !nextProps.logo.isUploading &&
      !nextState.pristine &&
      nextProps.isVisible
    ) {
      this.complete()
    }
  }

  complete = () => {
    this.props.closePortal()

    // wait until modal is closed to change state
    setTimeout(() => this.props.resetLogoState(), 0)
  }

  isImageMimeType(file) {
    const imageMimeTypes = ['image/png', 'image/gif', 'image/jpeg']
    return !!file && imageMimeTypes.includes(file.mime)
  }

  isImageExtension(file) {
    return /\.(gif|jpe?g|png)$/i.test(file.name)
  }

  imageWarning() {
    this.props.createNotification({
      message: 'Team icons must be a jpeg, png, or gif.',
      type: 'danger'
    })
  }

  handleUpload = e => {
    const file = e.target.files[0]
    const arrayReader = new FileReader()

    this.props.clearNotification()

    const readImageAsData = () => {
      // Read the file to a base64 encoded string so we can display it immediately
      // without having to upload it somewhere
      const urlReader = new FileReader()
      urlReader.onloadend = () => {
        // track event only if there were no images
        if (!this.state.logoUrl) {
          trackSettingsTeamIconUploaded()
        } else {
          trackSettingsTeamIconReplaced()
        }

        this.setState({
          showButtons: true,
          logoFile: file,
          logoUrl: urlReader.result, // a base64-encoded string
          pristine: false,
          valid: true
        })
      }
      urlReader.readAsDataURL(file)
    }

    const checkMimeTypeAndReadAsData = () => {
      // won't happen unless FileReader is invoked wrong
      if (typeof arrayReader.result === 'string') {
        this.imageWarning()
        return
      }

      // images have a signature in the first few bytes (not enough to detect all mime types)
      const header = arrayReader.result?.slice(0, 10)
      const isImage = this.isImageMimeType(fileType(header))
      if (!isImage) {
        this.imageWarning()
        return
      }

      readImageAsData()
    }

    arrayReader.onloadend = checkMimeTypeAndReadAsData

    if (!this.isImageExtension(file)) {
      this.imageWarning()
      return
    }

    // first get file binary to check first few bytes for image signature
    arrayReader.readAsArrayBuffer(file)
  }

  handleDelete = () => {
    if (this.state.logoUrl) {
      this.setState({
        showButtons: false,
        logoUrl: null,
        pristine: false,
        valid: true
      })
      trackSettingsTeamIconRemoved()
    }
  }

  handleSubmit = e => {
    e.preventDefault()

    if (this.state.logoFile) {
      this.props.uploadLogo(this.state.logoFile, {
        [UPLOAD_LOGO.SUCCESS]: {
          type: 'success'
        },
        [UPLOAD_LOGO.FAILURE]: {
          message: 'Your team icon wasn’t saved. Please try again.',
          type: 'danger'
        }
      })
    } else {
      this.props.deleteLogo({
        [DELETE_LOGO.SUCCESS]: {
          type: 'success'
        },
        [DELETE_LOGO.FAILURE]: {
          message: 'Your team icon wasn’t deleted. Please try again.',
          type: 'danger'
        }
      })
    }
  }

  handleCancel = e => {
    e.preventDefault()
    this.props.closePortal()
  }

  handleClosePortal = () => {
    trackSettingsTeamIconClosed()

    if (this.state.pristine) {
      this.props.closePortal()
      return
    }
    // hard refresh to settings to show the new icon
    navigateExternally('/teams/settings')
  }

  render() {
    const { isVisible, onBack } = this.props
    const { isUploading, isDeleting, uploadCompleted, deleteCompleted } = this.props.logo

    return (
      <ModalContent
        closePortal={this.handleClosePortal}
        closeWarning={<ModalCloseWarning />}
        showWarning={!this.state.pristine}
        isVisible={isVisible}
        onBack={onBack}
      >
        <Wrapper centered>
          <TitleWrap>
            <StyledHeading order="title" size="smaller" color="text-darker">
              Team Icon
            </StyledHeading>
            <Text order="body" size="larger" color="text-darker">
              Help people recognize your team at first glance
            </Text>
          </TitleWrap>

          <FormWrapper onSubmit={this.handleSubmit}>
            <StyledNotification />
            <ImageUploader
              logo={this.state.logoUrl ? this.state.logoUrl.toString() : null}
              onUpload={this.handleUpload}
              isUploading={isUploading}
              isDeleting={isDeleting}
              uploadCompleted={uploadCompleted}
              deleteCompleted={deleteCompleted}
            />

            <Padded all="xs">
              <Text order="body" size="smaller" color="text-lightest" align="center">
                400px by 400px PNG, JPG, or GIF
              </Text>
            </Padded>
            <ControlsWrapper>
              <IconWrapper isVisible={this.state.showButtons}>
                <Spaced right="xs">
                  <RotatingIconButton order="secondary" element="a">
                    <FileInput name="icon" onChange={this.handleUpload} />
                    <AddIcon fill="text-darker" size={18} />
                  </RotatingIconButton>
                </Spaced>
                <IconButton order="secondary" element="a" onClick={this.handleDelete}>
                  <TrashIcon fill="text-darker" size={18} />
                </IconButton>
              </IconWrapper>

              <Spaced top="m">
                <Button
                  type="submit"
                  order="primary"
                  size="larger"
                  disabled={this.state.pristine || !this.state.valid || isUploading}
                >
                  {isDeleting || isUploading || uploadCompleted ? (
                    <CenteredLoadingDots color="white" />
                  ) : (
                    'Confirm'
                  )}
                </Button>
              </Spaced>
              {!this.state.pristine && (
                <Spaced top="xs">
                  <Link order="secondary" element="div" onClick={this.handleCancel}>
                    Cancel
                  </Link>
                </Spaced>
              )}
            </ControlsWrapper>
          </FormWrapper>
        </Wrapper>
      </ModalContent>
    )
  }
}

const CenteredLoadingDots = styled(LoadingDots)`
  margin: 0 auto;
`

const StyledHeading = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.s};
`

const TitleWrap = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.l};
`

const ControlsWrapper = styled.div`
  height: 160px;
`

const IconWrapper = styled.div`
  position: relative;
  top: -20px;
  display: flex;
  justify-content: center;
  opacity: 0;
  text-align: center;
  transition: all 0.2s ease-in-out;
  ${props => {
    if (props.isVisible) {
      return `
        max-height: 36px;
        opacity: 1;
        overflow: initial;
        transform: translateY(20px);
      `
    }
    return `
      max-height: 0px;
    `
  }};
`

const IconButton = styled(Button)`
  display: flex;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  padding: 0;
  padding-top: 2px;

  svg {
    margin: 0;
  }
`

const RotatingIconButton = styled(IconButton)`
  position: relative;
  svg {
    transition: all 0.2s ease-in-out;
  }

  &:hover svg {
    transform: rotate(90deg);
  }
`

const StyledNotification = styled(Notification)`
  max-width: 460px;
  margin: 0 auto ${({ theme }) => theme.spacing.l};
`

const mapStateToProps = state => {
  return {
    logo: selectLogo(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    uploadLogo: (file, notifications) => {
      dispatch(uploadLogo.request(file, notifications))
    },
    deleteLogo: notifications => {
      dispatch(deleteLogo.request(notifications))
    },
    resetLogoState: () => {
      dispatch(resetLogoState())
    },
    createNotification: props => {
      dispatch(createNotification(props))
    },
    clearNotification: () => {
      dispatch(clearNotification())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditIconModal)
