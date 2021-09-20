import React from 'react'
import PropTypes from 'prop-types'

import {
    PageSection
} from '~/components/Library'

import List, {
    ListPropTypes
} from './List'

import './verticals.scss'

const Header = ({
    children
}) => ( <
    header >
    <
    h2 styleName = "title"
    data - id = "verticals-title" > {
        children
    } <
    /h2> <
    /header>
)

const Description = ({
    children
}) => ( <
    div styleName = "description" > {
        children
    } < /div>
)

const Verticals = ({
    title,
    description,
    items,
    heading
}) => ( <
    PageSection semantic forceSpace styleName = "container"
    width = {
        PageSection.Variant.Width.Fixed
    } >
    {
        heading || ( <
            >
            <
            Header > {
                title
            } < /Header> <
            Description > {
                description
            } < /Description> <
            />
        )
    } <
    List items = {
        items
    }
    /> <
    /PageSection>
)

Verticals.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    heading: PropTypes.node,
    ...ListPropTypes
}

export default Verticals