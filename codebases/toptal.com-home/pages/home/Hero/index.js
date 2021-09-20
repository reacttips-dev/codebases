import React, {
    useState
} from 'react'
import PropTypes from 'prop-types'

import {
    LinkableEntityArray
} from '~/lib/prop-types'
import unorphan from '~/lib/unorphan'

import HeroCTA from '~/components/HeroCTA'
import Trustbar from '~/components/Trustbar'
import HtmlContent from '~/components/HtmlContent'
import {
    PageSection
} from '~/components/Library'

import Talent from './Talent'
import TalentSlider from './TalentSlider'

import './hero.scss'

const Hero = ({
    id,
    showcaseTalents,
    ctas,
    title,
    subtitle,
    trustbar
}) => {
    const [selected, setSelected] = useState(0)

    return ( <
        section id = {
            id
        } >
        <
        div styleName = "hero" >
        <
        div styleName = "inner" >
        <
        div styleName = "heading" >
        <
        HtmlContent as = "h1"
        content = {
            unorphan(title)
        }
        styleName = "title"
        dataId = "hero-title"
        isUnstyled /
        >
        <
        HtmlContent as = "p"
        content = {
            subtitle
        }
        styleName = "subtitle"
        dataId = "hero-subtitle"
        isUnstyled /
        >
        <
        HeroCTA { ...{
                ctas
            }
        }
        /> <
        /div> {
            /**
             * Warning: Please, do NOT remove the key!
             * We need to have different instances of this component (with different states)
             * in order to make animations work properly.
             */
        } <
        Talent data - happo - hide { ...showcaseTalents[selected]
        }
        key = {
            showcaseTalents[selected].fullName
        }
        /> <
        /div> <
        /div> <
        Trustbar { ...trustbar
        }
        /> <
        PageSection forceSpace space = {
            PageSection.Variant.Space.Medium
        } >
        <
        TalentSlider talents = {
            showcaseTalents
        }
        onChange = {
            setSelected
        } { ...{
                selected
            }
        }
        /> <
        /PageSection> <
        /section>
    )
}

Hero.propTypes = {
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    showcaseTalents: TalentSlider.propTypes.talents,
    ctas: LinkableEntityArray,
    trustbar: PropTypes.shape(Trustbar.dataPropTypes)
}

export default Hero