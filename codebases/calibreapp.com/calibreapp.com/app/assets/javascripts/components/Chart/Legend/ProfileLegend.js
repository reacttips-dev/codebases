import React, { useContext } from 'react'
import PropTypes from 'prop-types'

import Legend from './'
import LegendContext from './Context'

const ProfileLegend = ({ series }) => {
  const { profiles, setProfiles } = useContext(LegendContext)

  const toggleProfile = uuid => {
    const updatedProfiles = profiles.map(profile => {
      if (profile.uuid === uuid) {
        return {
          ...profile,
          hidden: !profile.hidden
        }
      }

      return profile
    })
    setProfiles(updatedProfiles)
  }

  const profileSeries = profiles
    .map(profile => {
      if (series) {
        const set = series.find(series => series.profile === profile.uuid)
        if (set) {
          return {
            ...set,
            hidden: profile.hidden,
            onClick: profile.uuid ? () => toggleProfile(profile.uuid) : null
          }
        }

        return null
      }

      return {
        ...profile,
        hidden: profile.hidden,
        onClick: profile.uuid ? () => toggleProfile(profile.uuid) : null
      }
    })
    .filter(set => set)

  return <Legend series={profileSeries} />
}

ProfileLegend.propTypes = {
  series: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired })
  )
}

export default ProfileLegend
