import React from 'react'
import PropTypes from 'prop-types'

import {
    usePickRandom
} from '~/lib/hooks/use-pick-random'
import {
    CollectionPropTypes
} from '~/lib/prop-types'

import TestimonialCard, {
    TestimonialPropTypes
} from '~/components/TestimonialCard'
import TrustPilot from '~/components/TrustPilot'
import Link from '~/components/CTA/Link'
import {
    PageSection
} from '~/components/Library'
import Grid, {
    Cell
} from '~/components/Grid'
import SectionTitle from '~/components/SectionTitle'

import './client-testimonials.scss'

/**
 * Client Testimonials section component
 */
const ClientTestimonials = ({
    title,
    testimonials,
    trustPilot,
    className,
    cta,
    limit = 4,
    heading
}) => {
    const testimonialsToDisplay = usePickRandom(testimonials, limit)

    return ( <
        div styleName = "bg-container"
        className = {
            className
        } >
        <
        PageSection semantic width = {
            PageSection.Variant.Width.Fixed
        } > {
            heading || ( <
                SectionTitle margin = {
                    SectionTitle.Variant.Margin.Standard
                }
                dataId = "client-testimonials-title" >
                {
                    title
                } <
                /SectionTitle>
            )
        } {
            trustPilot && ( <
                div styleName = "trust-pilot"
                data - happo - hide >
                <
                TrustPilot loadOnFirstScroll width = "100%"
                height = "28px"
                theme = "light" { ...trustPilot
                }
                /> <
                /div>
            )
        }

        <
        Grid role = "list" > {
            testimonialsToDisplay.map(testimonial => ( <
                Cell key = {
                    testimonial.author
                }
                styleName = "testimonial-card"
                desktop = {
                    testimonialsToDisplay.length === 3 ? 4 : 3
                }
                tablet = {
                    6
                }
                role = "listitem" >
                <
                TestimonialCard { ...testimonial
                }
                styleName = "testimonial"
                variant = {
                    TestimonialCard.Variant.CircleAvatar
                }
                /> <
                /Cell>
            ))
        } <
        /Grid>

        {
            cta && ( <
                div styleName = "ctas" >
                <
                Link { ...cta
                }
                theme = {
                    Link.Variant.Theme.SecondaryGrey
                }
                /> <
                /div>
            )
        } <
        /PageSection> <
        /div>
    )
}

ClientTestimonials.dataPropTypes = {
    title: PropTypes.string,
    testimonials: CollectionPropTypes(TestimonialPropTypes).isRequired,
    trustPilot: PropTypes.shape(TrustPilot.propTypes)
}

ClientTestimonials.propTypes = {
    ...ClientTestimonials.dataPropTypes,
    className: PropTypes.string,
    limit: PropTypes.number,
    heading: PropTypes.node
}

export default ClientTestimonials