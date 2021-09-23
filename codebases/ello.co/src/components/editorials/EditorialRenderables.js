import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { loadPostStream } from '../../actions/editorials'
import InvitationFormContainer from '../../containers/InvitationFormContainer'
import EditorialStreamContainer from '../../containers/EditorialStreamContainer'
import BackgroundImage from '../assets/BackgroundImage'
import RegistrationRequestForm from '../forms/RegistrationRequestForm'
import { ShareIcon } from '../assets/Icons'
import {
  EditorialOverlay,
  EditorialTitle,
  EditorialSubtitle,
  EditorialTools,
  EditorialUsernameTitle,
  ToolButton,
} from './EditorialParts'
import { css, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const baseStyle = css(
  s.relative,
  s.flex,
  s.flexWrap,
  s.fullWidth,
  s.fullHeight,
  s.px20,
  s.py20,
  s.bgcTransparent,
  media(s.minBreak2, s.px40, s.py40),
)

const headerStyle = css(
  s.relative,
  s.zIndex2,
  s.fullWidth,
  s.transitionOpacity,
)

const bodyStyle = css(
  s.fullWidth,
  s.selfEnd,
)

const subtitleStyle = css(
  s.relative,
  s.zIndex4,
)

const toolsStyle = css(
  s.relative,
  s.zIndex4,
)

const linkStyle = css(
  s.absolute,
  s.flood,
  s.zIndex3,
  { color: 'rgba(0, 0, 0, 0)' },
  s.bgcCurrentColor,
)

const shareButtonStyle = css(s.mlAuto, s.flex, s.pt10)
const linkTextStyle = css(s.hidden)

// -------------------------------------

export const PostEditorial = props => (
  <div className={baseStyle}>
    { props.postPath &&
      <Link
        className={linkStyle}
        onClick={props.onClickEditorial}
        to={props.postPath}
      >
        <span className={linkTextStyle}>{props.postPath}</span>
      </Link>
    }
    <header className={headerStyle}>
      <EditorialTitle label={props.editorial.get('title')} />
    </header>
    <div className={bodyStyle}>
      <div className={subtitleStyle}>
        <EditorialSubtitle
          label={props.editorial.get('renderedSubtitle')}
          path={props.postPath}
        />
      </div>
      <div className={toolsStyle}>
        <EditorialTools isPostLoved={props.isPostLoved} postPath={props.postPath} />
      </div>
    </div>
    <EditorialOverlay />
    <BackgroundImage
      dpi={props.dpi}
      sources={props.sources}
      useGif
    />
  </div>
)

PostEditorial.propTypes = {
  editorial: PropTypes.object.isRequired,
  isPostLoved: PropTypes.bool.isRequired,
  onClickEditorial: PropTypes.func.isRequired,
  postPath: PropTypes.string.isRequired,
  dpi: PropTypes.string.isRequired,
  sources: PropTypes.object.isRequired,
}

// -------------------------------------

const postStreamBaseStyle = css(
  { ...baseStyle },
  { padding: '0 !important' },
  select('& .ElloMark.isSpinner > .SmileShape', { fill: '#fff !important' }),
)

export const PostStream = props => (
  <div className={postStreamBaseStyle}>
    <EditorialStreamContainer
      action={loadPostStream({
        variables: props.postStreamVariables,
        editorialTrackOptions: props.trackOptions,
        fallbackSources: props.sources,
        onClickEditorial: props.onClickEditorial,
        resultKey: `${props.editorialId}_${props.size}_${props.position}`,
        title: props.editorial.get('title'),
      })}
      shouldInfiniteScroll={false}
    />
  </div>
)

PostStream.propTypes = {
  editorial: PropTypes.object.isRequired,
  editorialId: PropTypes.string.isRequired,
  onClickEditorial: PropTypes.func.isRequired,
  sources: PropTypes.object.isRequired,
  position: PropTypes.number.isRequired,
  postStreamVariables: PropTypes.object.isRequired,
  trackOptions: PropTypes.object.isRequired,
  size: PropTypes.string.isRequired,
}

const postHeaderStyle = css(
  { ...headerStyle },
  media(s.minBreak2, { width: 'calc(100% - 35px)' }),
)

export const CuratedPost = props => (
  <div className={baseStyle}>
    { props.detailPath &&
      <Link
        className={linkStyle}
        onClick={props.onClickEditorial}
        to={props.detailPath}
      >
        <span className={linkTextStyle}>{props.detailPath}</span>
      </Link>
    }
    <header className={postHeaderStyle}>
      <EditorialTitle label={`${props.title} `} />
      <EditorialUsernameTitle label={`@${props.username}`} />
    </header>
    <div className={bodyStyle}>
      <div className={toolsStyle}>
        <EditorialTools isPostLoved={props.isPostLoved} postPath={props.detailPath} />
      </div>
    </div>
    <EditorialOverlay />
    <BackgroundImage
      dpi={props.dpi}
      sources={props.sources || props.fallbackSources}
      useGif
    />
  </div>
)

CuratedPost.propTypes = {
  dpi: PropTypes.string.isRequired,
  detailPath: PropTypes.string.isRequired,
  fallbackSources: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  isPostLoved: PropTypes.bool.isRequired,
  onClickEditorial: PropTypes.func.isRequired,
  sources: PropTypes.object,
  title: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
}

CuratedPost.defaultProps = {
  sources: null,
}

// -------------------------------------

export const LinkEditorial = (props, context) => (
  <div className={baseStyle}>
    {props.path && props.kind === 'internal' &&
      <Link
        className={linkStyle}
        onClick={props.onClickEditorial}
        to={props.path}
      >
        <span className={linkTextStyle}>{props.url}</span>
      </Link>
    }
    {props.url && (props.kind === 'external' || props.kind === 'sponsored') &&
      <a
        className={linkStyle}
        href={props.url}
        onClick={props.onClickEditorial}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className={linkTextStyle}>{props.url}</span>
      </a>
    }
    <header className={headerStyle}>
      <EditorialTitle label={props.editorial.get('title')} />
    </header>
    <div className={bodyStyle}>
      <div className={subtitleStyle}>
        <EditorialSubtitle
          label={props.editorial.get('renderedSubtitle')}
          path={props.path}
        />
      </div>
      {props.url && (props.kind === 'external' || props.kind === 'sponsored') &&
        <div className={toolsStyle}>
          <ToolButton
            className={shareButtonStyle}
            onClick={context.onClickShareExternal}
          >
            <ShareIcon />
          </ToolButton>
        </div>
      }
    </div>
    <EditorialOverlay />
    <BackgroundImage
      dpi={props.dpi}
      sources={props.sources}
      useGif
    />
  </div>
)
LinkEditorial.contextTypes = {
  onClickShareExternal: PropTypes.func.isRequired,
}
LinkEditorial.propTypes = {
  dpi: PropTypes.string.isRequired,
  editorial: PropTypes.object.isRequired,
  path: PropTypes.string,
  url: PropTypes.string,
  sources: PropTypes.object.isRequired,
  kind: PropTypes.string.isRequired,
  onClickEditorial: PropTypes.func.isRequired,
}
LinkEditorial.defaultProps = {
  path: null,
  url: null,
}

// -------------------------------------

const errorStyle = css(
  { ...baseStyle },
  s.flex,
  s.justifyCenter,
  s.itemsCenter,
  s.fontSize14,
  s.bgcRed,
  s.pointerNone,
)

const errorTextStyle = css(
  s.relative,
  s.zIndex2,
  s.colorWhite,
)

export const ErrorEditorial = () => (
  <div className={errorStyle}>
    <span className={errorTextStyle}>Something went wrong.</span>
    <EditorialOverlay />
  </div>
)

// -------------------------------------

const joinStyle = css(
  { ...baseStyle },
  s.colorWhite,
  select('& .AuthenticationForm', s.absolute, { bottom: 0, maxWidth: '100%', width: '100%' }),
  select('& .JoinForm', s.relative, s.fullWidth),
  select('& .JoinForm .FormButton', s.mt40),
  select('& .JoinForm .FormControlStatusMessage', s.mb0),
  select('& .JoinForm .AuthenticationTermsCopy', s.absolute, s.fontSize12, { bottom: 50 }),
  select('& h1', s.fontSize24, s.mt30, s.sansBlack),
  select('& h2', s.fontSize16),
)

export const JoinEditorial = props => (
  <div className={joinStyle}>
    <BackgroundImage
      className="hasOverlay6"
      dpi={props.dpi}
      sources={props.sources}
      useGif
    />
    <RegistrationRequestForm inEditorial />
  </div>
)

JoinEditorial.propTypes = {
  dpi: PropTypes.number.isRequired,
  sources: PropTypes.object.isRequired,
}

// -------------------------------------

const inviteStyle = css(
  { ...baseStyle },
  s.colorWhite,
  select('& .InvitationsForm', s.mx0, s.relative, s.fullWidth, s.zIndex3),
  select('& .InvitationsForm form', s.absolute, s.fullWidth, { bottom: 0 }),
  select('& .InvitationsForm .FormButton', s.mt0),
  select('& .BatchEmailControl .FormControlInput.isBoxControl', { height: 85 }),
  select('& h1', s.fontSize24, s.sansBlack),
  select('& header p', s.fontSize16),
  select('& .BatchEmailControlSuggestions', s.colorWhite, s.mb30),
)

export const InviteEditorial = props => (
  <div className={inviteStyle}>
    <BackgroundImage
      className="hasOverlay6"
      dpi={props.dpi}
      sources={props.sources}
      useGif
    />
    <header className={headerStyle}>
      <h1>Invite some cool people</h1>
      <p>Help Ello grow.</p>
    </header>
    <InvitationFormContainer inEditorial />
  </div>
)

InviteEditorial.propTypes = {
  dpi: PropTypes.number.isRequired,
  sources: PropTypes.object.isRequired,
}

