import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { trackEvent } from '../../utils/analytics'
import { APP_HOME_SEE_BOTTOM } from '../../constants/TrackingEvents'

import ModalPortal from '../../components/Modals/ModalPortal'

import {
  Flex,
  Rounded,
  Text,
  Spaced
} from '@invisionapp/helios'

import GetInspiredBucket from './GetInspiredBucket'
import { DownloadCraft, DownloadStudio, FeatureHighlightModal } from '@invisionapp/nux-tools-ui'

import CraftLogos from '../../img/craft-logos.svg'
import StudioLogo from '../../img/studio-compact-logo.svg'
import InspectLogo from '../../img/inspect-icon.svg'
import SpecsLogo from '../../img/specs-icon.svg'

import styles from '../../css/home/get-inspired.css'

class GetInspired extends PureComponent {
  state = {
    showCraftModal: false,
    showInspectModal: false,
    showStudioModal: false,
    showSpecsModal: false
  }

  constructor (props) {
    super(props)
    this.handleCraftClick = this.handleCraftClick.bind(this)
    this.handleStudioClick = this.handleStudioClick.bind(this)
    this.handleInspectClick = this.handleInspectClick.bind(this)
    this.handleSpecsClick = this.handleSpecsClick.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (this.props.isVisible && this.props.isVisible !== prevProps.isVisible) {
      trackEvent(APP_HOME_SEE_BOTTOM, { page: 0, homeView: '/' })
    }
  }

  handleCraftClick () {
    this.setState({ showCraftModal: !this.state.showCraftModal })
  }

  handleInspectClick () {
    this.setState({ showInspectModal: !this.state.showInspectModal })
  }

  handleSpecsClick () {
    this.setState({ showSpecsModal: !this.state.showSpecsModal })
  }

  handleStudioClick () {
    this.setState({ showStudioModal: !this.state.showStudioModal })
  }

  renderGetInspiredExperiment () {
    const { showStudio, showSpecsAd, mqs } = this.props

    if (showStudio) {
      return <GetInspiredBucket
        buttonText='Download Studio'
        description={`Design and prototype with Studio, our most powerful screen design tool yet.`}
        icon={StudioLogo}
        imageClass={styles.imageStudio}
        onClick={this.handleStudioClick}
        mqs={mqs}
        title='InVision Studio'
        type='studio'
      />
    } else if (showSpecsAd) {
      return <GetInspiredBucket
        buttonText='Watch Video'
        description='Specs make the final design and requirements clear for development.'
        icon={SpecsLogo}
        imageClass={styles.imageSpecs}
        mqs={mqs}
        onClick={this.handleSpecsClick}
        title='Hand-off final designs with&nbsp;Specs'
        type='specs'
      />
    } else {
      return <GetInspiredBucket
        buttonText='Learn more'
        description='Inspect simplifies your developer workflows and creates specs in a flash.'
        icon={InspectLogo}
        imageClass={styles.imageInspect}
        mqs={mqs}
        onClick={this.handleInspectClick}
        title='Make developer handoff easy'
        type='inspect'
      />
    }
  }

  render () {
    const { showStudio, mqs } = this.props

    return (
      <section className={styles.root}>
        <Spaced top={this.props.hasDocuments ? 'xs' : 'm'} bottom='m'>
          <Text order='subtitle' size='larger' color='black' element='h2' className={styles.title}>
            {showStudio ? 'Start with a design tool' : 'More to discover'}
          </Text>
        </Spaced>
        <Flex
          alignItems='stretch'
          justifyContent='space-between'
          className={styles.buckets}
        >
          <Rounded order='rounded'>
            <div className={styles.first}>
              <GetInspiredBucket
                buttonText='Download Craft'
                description='Use our Craft plugin to sync with InVision for endless creativity and collaboration.'
                icon={CraftLogos}
                imageClass={styles.imageCraft}
                onClick={this.handleCraftClick}
                mqs={mqs}
                title='Craft for Sketch & Photoshop'
                type='craft'
              />
            </div>
          </Rounded>
          <Rounded order='rounded'>
            <div className={styles.second}>
              {this.renderGetInspiredExperiment()}
            </div>
          </Rounded>
        </Flex>
        {this.state.showCraftModal &&
          <ModalPortal noScroll={false}>
            <DownloadCraft onClose={this.handleCraftClick} />
          </ModalPortal>
        }
        {this.state.showStudioModal &&
          <ModalPortal noScroll={false}>
            <DownloadStudio onClose={this.handleStudioClick} />
          </ModalPortal>
        }
        {this.state.showInspectModal && (
          <ModalPortal noScroll={false}>
            <FeatureHighlightModal
              feature='inspect'
              onClose={this.handleInspectClick}
              open={this.state.showInspectModal}
              showClose
              track={trackEvent}
            />
          </ModalPortal>
        )}
        {this.state.showSpecsModal && (
          <ModalPortal noScroll={false}>
            <FeatureHighlightModal
              feature='specs'
              onClose={this.handleSpecsClick}
              open={this.state.showSpecsModal}
              showClose
              track={trackEvent}
            />
          </ModalPortal>
        )}

      </section>
    )
  }
}

GetInspired.propTypes = {
  hasDocuments: PropTypes.bool,
  isVisible: PropTypes.bool,
  showStudio: PropTypes.bool,
  showSpecsAd: PropTypes.bool
}

export default GetInspired
