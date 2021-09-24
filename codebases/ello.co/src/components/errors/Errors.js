import React from 'react'
import PropTypes from 'prop-types'
import { EditorialOverlay } from '../editorials/EditorialParts'
import { css, media } from '../../styles/jss'
import * as s from '../../styles/jso'
import * as ENV from '../../../env'

const spinGif = '/static/images/support/ello-spin.gif'

const imageStyle = css(s.block, { margin: '0 auto 75px' })
const errorStyle = css(
  { maxWidth: 780 },
  s.px10,
  s.mb30,
  s.fontSize14,
  media(s.minBreak2, s.px0),
)

export const ErrorStateImage = () =>
  <img className={imageStyle} src={spinGif} alt="Ello" width="130" height="130" />

export const ErrorState = ({ children = 'Something went wrong.' }) =>
  (<div className={errorStyle}>
    {children}
  </div>)

ErrorState.propTypes = {
  children: PropTypes.node,
}

export const ErrorState4xx = ({ withImage = true }) =>
  (<ErrorState>
    {withImage ? <ErrorStateImage /> : null}
    <p>This doesn&rsquo;t happen often, but it looks like something is broken. Hitting the back button and trying again might be your best bet. If that doesn&rsquo;t work you can <a href="http://ello.co/">head back to the homepage.</a></p>
    <p>There might be more information on our <a href="http://status.ello.co/">status page</a>.</p>
    <p>If all else fails you can try checking out our <a href="http://ello.threadless.com/" target="_blank" rel="noopener noreferrer">Store</a> or the <a href={`${ENV.AUTH_DOMAIN}/wtf/post/communitydirectory`}>Community Directory</a>.</p>
  </ErrorState>)

ErrorState4xx.propTypes = {
  withImage: PropTypes.bool,
}

export const ErrorState5xx = ({ withImage = true }) =>
  (<ErrorState>
    {withImage ? <ErrorStateImage /> : null}
    <p>It looks like something is broken and we couldn&rsquo;t complete your request. Please try again in a few minutes. If that doesn&rsquo;t work you can <a href="http://ello.co/">head back to the homepage.</a></p>
    <p>There might be more information on our <a href="http://status.ello.co/">status page</a>.</p>
    <p>If all else fails you can try checking out our <a href="http://ello.threadless.com/" target="_blank" rel="noopener noreferrer">Store</a> or the <a href={`${ENV.AUTH_DOMAIN}/wtf/post/communitydirectory`}>Community Directory</a>.</p>
  </ErrorState>)

ErrorState5xx.propTypes = {
  withImage: PropTypes.bool,
}

// -------------------------------------

const errorEditorialStyle = css(
  s.absolute,
  s.flood,
  s.flex,
  s.justifyCenter,
  s.itemsCenter,
  s.fontSize14,
  s.colorWhite,
  s.bgcRed,
  s.pointerNone,
)

const errorEditorialTextStyle = css(
  s.relative,
  s.zIndex2,
  s.colorWhite,
)

export const ErrorStateEditorial = () => (
  <div className={errorEditorialStyle}>
    <span className={errorEditorialTextStyle}>Something went wrong.</span>
    <EditorialOverlay />
  </div>
)

