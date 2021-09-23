/* eslint-disable react/no-danger */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { camelize } from 'humps'
import classNames from 'classnames'
import ToggleControl from '../forms/ToggleControl'
import { profilePath } from '../../networking/api'
import { selectIsOnboardingView } from '../../selectors/routing'
import { css, firstChild, media, select } from '../../styles/jss'
import * as s from '../../styles/jso'

const preferenceStyle = css(s.relative, s.py30, { borderTop: '1px solid #e5e5e5' })
const dlStyle = css({ width: 'calc(100% - 80px)', maxWidth: 440 })
const ddStyle = css(s.mt20, s.colorA, select('& a:hover'), s.color6)

// Onboarding styles
const preferenceOnboardingStyle = css(
  { ...preferenceStyle },
  { paddingTop: 25, paddingBottom: 25, marginLeft: 15, marginRight: 15 },
  firstChild({ borderTop: 0 }),
  media(s.minBreak2,
    s.px10,
    s.mx0,
    { borderTop: 0, borderLeft: '1px solid #e5e5e5' },
    firstChild({ borderLeft: 0 }),
  ),
  media(s.minBreak3, s.px40),
  media(s.minBreak4, { paddingRight: 90, paddingLeft: 90 }),
  select('& + &::before', { width: 100, height: 330, content: '""', backgroundColor: '#f0f' }),
)
const dlOnboardingStyle = css({ maxWidth: 290 }, media(s.minBreak2, { maxWidth: 330 }))
const dtOnboardingStyle = css(s.fontSize18, media(s.minBreak2, s.fontSize24))
const ddOnboardingStyle = css({ ...ddStyle }, { marginTop: 100 })

function mapStateToProps(state, ownProps) {
  return {
    isChecked: state.profile.get(camelize(ownProps.id)),
    isDisabled: !state.profile.get('isPublic') && ownProps.id === 'has_sharing_enabled',
    isOnboarding: selectIsOnboardingView(state),
  }
}

const Preference = (props) => {
  const { className, definition, id, isChecked, isDisabled, isOnboarding, onToggleChange } = props
  return (
    <form
      action={profilePath().path}
      className={classNames(className, `Preference ${isOnboarding ? preferenceOnboardingStyle : preferenceStyle}`)}
      method="POST"
    >
      <dl className={isOnboarding ? dlOnboardingStyle : dlStyle}>
        <dt className={isOnboarding ? dtOnboardingStyle : null}>{definition.term ? definition.term : ''}</dt>
        <dd className={isOnboarding ? ddOnboardingStyle : ddStyle} dangerouslySetInnerHTML={{ __html: definition.desc ? definition.desc : '' }} />
      </dl>
      <ToggleControl
        id={id}
        isChecked={isChecked}
        isDisabled={isDisabled}
        hasIcon={isOnboarding}
        onChange={onToggleChange}
      />
    </form>
  )
}

Preference.propTypes = {
  className: PropTypes.string,
  definition: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isOnboarding: PropTypes.bool.isRequired,
  onToggleChange: PropTypes.func.isRequired,
}
Preference.defaultProps = {
  className: null,
  isChecked: false,
  isDisabled: false,
}

export default connect(mapStateToProps)(Preference)

