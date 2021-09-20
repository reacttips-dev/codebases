import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    CollectionPropTypes
} from '~/lib/prop-types'
import {
    MediaQuery
} from '~/lib/query-range'
import unorphan from '~/lib/unorphan'

import MatchMedia from '~/components/MatchMedia'
import {
    PageSection
} from '~/components/Library'

import TalentsList from './TalentsList'
import BenefitsList from './BenefitsList'

import './usp.scss'

/**
 * USP section of the home page
 */
const USP = ({
    title,
    description,
    benefits,
    showcaseTalents: talents,
    pickRandomly
}) => ( <
    PageSection semantic styleName = {
        classNames('container', {
            'is-side-by-side': !(benefits.length % 2)
        })
    }
    width = {
        PageSection.Variant.Width.Fixed
    }
    forceSpace >
    <
    div styleName = "content-main" >
    <
    h2 styleName = "title"
    data - id = "usp-title" > {
        unorphan(title)
    } <
    /h2> <
    p styleName = "description" > {
        description
    } < /p> <
    BenefitsList { ...{
            benefits
        }
    }
    /> <
    /div> <
    MatchMedia query = {
        MediaQuery.Desktop
    }
    defaultMatch >
    <
    TalentsList { ...{
            talents,
            pickRandomly
        }
    }
    itemsNumber = {
        benefits.length
    }
    /> <
    /MatchMedia> <
    /PageSection>
)

USP.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    benefits: CollectionPropTypes({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        imageUrl: PropTypes.string.isRequired
    }).isRequired,
    showcaseTalents: TalentsList.propTypes.talents,
    pickRandomly: PropTypes.bool
}

export default USP