import PropTypes from 'prop-types'

import {
    VerticalPropTypes
} from '~/lib/prop-types'

export const TalentPropTypes = {
    fullName: PropTypes.string.isRequired,
    vertical: PropTypes.exact({
        name: VerticalPropTypes.isRequired
    }).isRequired,
    jobTitle: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    publicResumeUrl: PropTypes.string.isRequired,
    previousCompanyName: PropTypes.string.isRequired,
    heroImageUrl: PropTypes.string.isRequired
}