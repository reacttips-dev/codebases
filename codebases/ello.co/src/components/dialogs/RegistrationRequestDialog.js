import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import RegistrationRequestForm from '../../components/forms/RegistrationRequestForm'
import { HeroPromotionCredits } from '../../components/heros/HeroParts'
import BackgroundImage from '../../components/assets/BackgroundImage'
import { DismissButton } from '../../components/buttons/Buttons'

class RegistrationRequestDialog extends PureComponent {
  static propTypes = {
    pageHeader: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  }

  render() {
    const { pageHeader, user } = this.props
    return (
      <div className="AuthenticationFormDialog inModal">
        <BackgroundImage
          className="hasOverlay6"
          dpi="hdpi"
          isBackground
          sources={pageHeader.get('image')}
        />
        <RegistrationRequestForm inModal />
        <HeroPromotionCredits sources={user.get('avatar')} label="Posted by" username={user.get('username')} />
        <DismissButton />
      </div>
    )
  }
}

export default RegistrationRequestDialog

