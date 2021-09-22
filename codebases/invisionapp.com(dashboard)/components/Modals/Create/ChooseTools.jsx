import React from 'react'
import cx from 'classnames'
import { bool, func } from 'prop-types'
import { trackEvent } from '../../../utils/analytics'
import { APP_DESIGN_TOOL_CLICK, APP_DESIGN_TOOL_VIEW } from '../../../constants/TrackingEvents'

import { Color, Padded, Spaced, Text } from '@invisionapp/helios'
import InVision from '@invisionapp/helios/icons/InVision'

import StudioVideo from './StudioVideo'
import ToolItem from './ToolItem'

import CraftLogoImage from '../../../img/craft-logos.svg'
import StudioLogoImage from '../../../img/studio-logo-alt.svg'

import downloadStyles from '../../../css/modals/download-tools.css'
import typeStyles from '../../../css/modals/project-types.css'

export default class ChooseTools extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      showVideo: false
    }

    this.toggleVideo = this.toggleVideo.bind(this)
    this.downloadClick = this.downloadClick.bind(this)
  }

  componentDidMount () {
    var components = this.props.getRefs(this, 'chooseTools')
    this.props.animateInComponents(components, 0)
    trackEvent(APP_DESIGN_TOOL_VIEW, { page: 0, homeView: '/docs/my-documents' })
  }

  toggleVideo (event) {
    event.stopPropagation()

    this.setState((current) => ({
      showVideo: !current.showVideo
    }))
  }

  downloadClick (view) {
    trackEvent(APP_DESIGN_TOOL_CLICK, {
      selectedType: view === 'downloadCraft' ? 'craft' : 'studio',
      page: 0,
      homeView: '/docs/my-documents'
    })
    this.props.handleSwitchSubviews(view)
  }

  render () {
    const { handleCancelModal, showStudio } = this.props
    const { showVideo } = this.state
    const listClassname = cx(
      typeStyles.types,
      typeStyles.animateIn,
      {
        [typeStyles.horzTypes]: showStudio,
        [downloadStyles.horzTools]: showStudio,
        [downloadStyles.singleTool]: !showStudio
      })
    const listItemClassname = cx({
      [typeStyles.type]: showStudio,
      [downloadStyles.horzTool]: showStudio
    })

    return (
      <div className={typeStyles.root}>
        <a
          ref='chooseTools-logo'
          onClick={handleCancelModal}
          className={typeStyles.logoClose}>
          <InVision />
        </a>
        <Spaced top='m'>
          <Text order='title' size='smaller'>
            <Color shade='darker'>
              <h2 ref='chooseTools-header' data-animation='slide' className={cx(typeStyles.welcomeTitle, typeStyles.animateIn)}>
                {showStudio ? 'Choose your design tool' : 'Screen design. Supercharged.'}
              </h2>
            </Color>
          </Text>
        </Spaced>
        <Spaced top='xl'>
          <ul
            ref='chooseTools-selection'
            data-animation='slide'
            className={listClassname}
          >
            <Padded vertical='l' horizontal='s'>
              <li className={listItemClassname}>
                <ToolItem
                  tool='craft'
                  title='Craft for Sketch &amp; Photoshop'
                  description='Use our Craft plugin to sync your design files to InVision or to prototype directly in Sketch.'
                  ctaLabel='Download Craft'
                  ctaOrder={showStudio ? 'primary-alt' : 'primary'}
                  Logo={CraftLogoImage}
                  onDownloadClick={() => this.downloadClick('downloadCraft')}
                  isOnlyTool={!showStudio}
                />
              </li>
            </Padded>
            {showStudio && (
              <Padded vertical='l' horizontal='s'>
                <li className={cx(typeStyles.type, downloadStyles.horzTool)}>
                  <ToolItem
                    tool='studio'
                    title='InVision Studio'
                    description="Design and prototype with InVision Studio, the world's most powerful screen design tool."
                    ctaLabel='Download Studio'
                    ctaOrder='primary'
                    playable
                    Logo={StudioLogoImage}
                    onToggleVideo={this.toggleVideo}
                    onDownloadClick={() => this.downloadClick('downloadStudio')}
                  />
                </li>
              </Padded>
            )}
          </ul>
        </Spaced>
        { showVideo && <StudioVideo onToggleVideo={this.toggleVideo} /> }
      </div>
    )
  }
}

ChooseTools.propTypes = {
  animateInComponents: func,
  handleCancelModal: func,
  handleSwitchSubviews: func,
  showStudio: bool
}
