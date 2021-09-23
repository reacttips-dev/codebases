import React from 'react'
import PropTypes from 'prop-types'
import { MainView } from '../views/MainView'
import StreamContainer from '../../containers/StreamContainer'
import InvitationFormContainer from '../../containers/InvitationFormContainer'
import * as s from '../../styles/jso'
import { css, media } from '../../styles/jss'

const mainStyle = css(
  s.mxAuto,
  { maxWidth: 1440 },
  media(
    s.minBreak2,
    s.flex1,
    s.flexRow,
    s.justifySpaceAround,
    s.itemsStart,
  ),
)

const columnStyle = css(
  { margin: '20px 10px 10px 10px' },
  media(
    s.minBreak2,
    s.fullWidth,
    { margin: '40px 20px 20px' },
  ),
  media(
    s.minBreak4,
    s.mx40,
  ),
)

const headerStyle = css(
  s.mb40,
)

const headingStyle = css(
  s.sansBlack,
  s.fontSize18,
  s.lh30,
  s.hv30,
  s.nowrap,
  media(
    s.minBreak2,
    s.hv40,
    s.fontSize24,
    s.lh40,
  ),
)

const streamHeadingStyle = css(
  { ...headingStyle },
  s.my40,
  media(
    s.minBreak2,
    s.mt0,
    { marginBottom: 75 },
  ),
)

const invitedStreamStyle = css(
  { padding: '0 !important' },
  s.mt40,
)

export const Invitations = ({ streamAction }) => (
  <MainView className={`${mainStyle}`}>
    <div className={columnStyle}>
      <header className={headerStyle}>
        <h1 className={headingStyle}>Invite some cool people</h1>
        <p>Help Ello grow.</p>
      </header>
      <InvitationFormContainer />
    </div>
    <div className={columnStyle}>
      <h2 className={streamHeadingStyle}>{'People you\'ve invited'}</h2>
      <StreamContainer className={`${invitedStreamStyle}`} action={streamAction} />
    </div>
  </MainView>
)

Invitations.propTypes = {
  streamAction: PropTypes.object.isRequired,
}

export default Invitations

