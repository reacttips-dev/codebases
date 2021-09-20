import React, {
    useEffect,
    useState
} from 'react'
import PropTypes from 'prop-types'
import {
    random
} from 'lodash'
import classNames from 'classnames'

import {
    revealConfig,
    useInView
} from '~/lib/hooks/use-in-view'
import isVisualRegressionTest from '~/lib/is-visual-regression-test'
import pickTalentsRandomly from '~/lib/pick-talents-randomly'
import {
    VerticalPropTypes
} from '~/lib/prop-types'

import TalentCard, {
    TalentCardVariation
} from '~/components/TalentCard'
import Grid, {
    Cell
} from '~/components/Grid'

import './talents-list.scss'

const SHOWN_TALENTS_COUNT = 3

const TalentsList = ({
    talents,
    pickRandomly,
    itemsNumber
}) => {
    const pickTalents = !isVisualRegressionTest && pickRandomly
    const [ref] = useInView(revealConfig)

    const [shownTalents, setShowTalents] = useState(!pickTalents ? talents.slice(0, SHOWN_TALENTS_COUNT) : [])

    useEffect(() => {
        if (pickTalents) {
            setShowTalents(pickTalentsRandomly(talents, SHOWN_TALENTS_COUNT))
        }
    }, [pickTalents, talents])

    const talentList = ( <
        Grid role = {
            shownTalents.length ? 'list' : null
        } > {
            shownTalents.map(talent => ( <
                Cell desktop = {
                    4
                }
                styleName = "cell"
                key = {
                    talent.fullName
                }
                role = "listitem" >
                <
                TalentCard styleName = "talent"
                variation = {
                    TalentCardVariation.Medium
                }
                data = {
                    {
                        avatar: talent.imageUrl,
                        name: talent.fullName,
                        role: talent.jobTitle,
                        vertical: talent.vertical,
                        company: {
                            logo: talent.previousCompanyImageUrl,
                            title: talent.previousCompanyName
                        },
                        publicResumeUrl: talent.publicResumeUrl
                    }
                }
                /> <
                /Cell>
            ))
        } <
        /Grid>
    )

    const cardClasses = {
        container: true,
        'is-linear': !!(itemsNumber % 2),
        'is-immersed': itemsNumber === 2,
        'is-original': itemsNumber === 4
    }

    if (isVisualRegressionTest) {
        return ( <
            div styleName = {
                classNames('variant-1', cardClasses)
            } > {
                talentList
            } < /div>
        )
    }

    return ( <
        div { ...{
                ref
            }
        }
        styleName = {
            classNames(
                'cards-animated',
                `variant-${random(1, 3)}`,
                cardClasses
            )
        } >
        {
            talentList
        } <
        /div>
    )
}

TalentsList.propTypes = {
    talents: PropTypes.arrayOf(
        PropTypes.shape({
            fullName: PropTypes.string.isRequired,
            jobTitle: PropTypes.string.isRequired,
            imageUrl: PropTypes.string.isRequired,
            previousCompanyName: PropTypes.string,
            previousCompanyImageUrl: PropTypes.string,
            vertical: PropTypes.shape({
                name: VerticalPropTypes.isRequired
            }),
            publicResumeUrl: PropTypes.string.isRequired
        })
    ),
    pickRandomly: PropTypes.bool
}

export default TalentsList