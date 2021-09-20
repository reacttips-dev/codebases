import React from 'react'

import {
    CollectionPropTypes
} from '~/lib/prop-types'

import VerticalCard from '~/components/_molecules/VerticalCard'

import './list.scss'

const List = ({
    items
}) => ( <
    div styleName = "container"
    role = "list" > {
        items.map(verticalCard => ( <
            VerticalCard key = {
                verticalCard.title
            }
            styleName = "item"
            role = "listitem" { ...verticalCard
            }
            />
        ))
    } <
    /div>
)

export const ListPropTypes = {
    items: CollectionPropTypes(VerticalCard.propTypes).isRequired
}

List.propTypes = ListPropTypes

export default List