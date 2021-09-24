import PropTypes from 'prop-types'
import styled from 'styled-components'
import { space } from 'styled-system'

const ALIGN_OPTIONS = {
  DEFAULT: '',
  CENTER: 'center'
}

const ROW_ALIGN_OPTIONS = {
  START: 'flex-start',
  CENTER: 'center'
}

const Media = styled.div`
  display: flex;
  align-items: ${props => props.rowAlign};

  ${props =>
    props.rowAlign === 'center' &&
    `
    .media__body {
      flex: initial;
    }
  `}

  ${props =>
    props.align === 'center' &&
    `
    @media only screen and (min-width: ${props => props.theme.breakpoints.sm}) {
      justify-content: center;
    }
  `}
`
Media.propTypes = {
  align: PropTypes.oneOf(Object.values(ALIGN_OPTIONS)),
  rowAlign: PropTypes.oneOf(Object.values(ROW_ALIGN_OPTIONS))
}
Media.defaultProps = {
  rowAlign: ROW_ALIGN_OPTIONS.START
}

const MediaObject = styled.div`
  ${space}
`
MediaObject.propTypes = {
  ...space.propTypes
}
MediaObject.defaultProps = {
  className: 'media__object',
  mr: 2
}

const MediaBody = styled.div`
  flex: 1;
  max-width: 100%;
`
MediaBody.defaultProps = {
  className: 'media__body'
}

export { ALIGN_OPTIONS, ROW_ALIGN_OPTIONS, Media, MediaObject, MediaBody }
