import React from 'react'

import {
    CollectionPropTypes
} from '~/lib/prop-types'

import SkillsList from '~/components/SkillsList'
import {
    PageSection
} from '~/components/Library'

import './skills-list-group.scss'

const SkillsListGroup = ({
    items
}) => ( <
    PageSection width = {
        PageSection.Variant.Width.Fixed
    }
    space = {
        PageSection.Variant.Space.None
    } >
    {
        items.map(section => ( <
            SkillsList key = {
                section.title
            } { ...section
            }
            styleName = "item" / >
        ))
    } <
    /PageSection>
)

SkillsListGroup.propTypes = {
    items: CollectionPropTypes(SkillsList.propTypes).isRequired
}

export default SkillsListGroup