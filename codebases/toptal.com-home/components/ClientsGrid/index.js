import React, {
    Fragment,
    useMemo
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
    flatten
} from 'lodash'

import {
    LinkableEntityWithGAPropTypes,
    CollectionPropTypes
} from '~/lib/prop-types'

import Grid, {
    Cell
} from '~/components/Grid'
import {
    Breakpoint
} from '~/components/Grid/lib'
import {
    PageSection
} from '~/components/Library'
import {
    ArticleCard,
    VideoCard
} from '~/components/TestimonialVisualCard'
import SectionTitle from '~/components/SectionTitle'
import {
    Link
} from '~/components/CTA'

import './clients-grid.scss'

const getCellSpan = (itemCount, index, breakpoint) => {
    switch (breakpoint) {
        case Breakpoint.Desktop:
            if (itemCount === 2) {
                return index > 0 ? 8 : 4
            }
            break

        case Breakpoint.Tablet:
            switch (itemCount) {
                case 3:
                    return index > 0 ? 6 : 12

                case 2:
                    return 6
            }
            break
    }

    return 4
}

const Testimonials = ({
    testimonials,
    isTitleCell,
    gutter,
    videos
}) => {
    const titleCell = Number(isTitleCell)
    const itemCount = testimonials.length + titleCell

    const items = testimonials.map(({
        type,
        ...testimonial
    }, index) => {
        const isVideo = type === 'video'
        const cellIndex = index + titleCell

        return ( <
            Cell key = {
                index
            }
            desktop = {
                getCellSpan(itemCount, cellIndex, Breakpoint.Desktop)
            }
            tablet = {
                getCellSpan(itemCount, cellIndex, Breakpoint.Tablet)
            }
            role = "listitem" >
            {
                isVideo ? ( <
                    VideoCard { ...testimonial
                    } { ...{
                            videos
                        }
                    }
                    styleName = "item" / >
                ) : ( <
                    ArticleCard { ...testimonial
                    }
                    styleName = "item" / >
                )
            } <
            /Cell>
        )
    })

    if (itemCount > 3) {
        return ( <
            Cell styleName = "item"
            desktop = {
                8
            }
            tablet = {
                12
            }
            role = "listitem" >
            <
            Grid role = "list" { ...{
                    gutter
                }
            } > {
                items
            } <
            /Grid> <
            /Cell>
        )
    }

    return items
}

const FooterCta = ({
    title,
    ctas
}) => ( <
    div styleName = "footer" >
    <
    p data - id = "footer-cta-title" > {
        title
    } < /p> <
    div styleName = "cta-holder" > {
        ctas.map(({
            label,
            href,
            inlineStyles,
            dataId,
            ...gaDataset
        }) => ( <
            Link size = {
                Link.Variant.Size.ExtraLarge
            }
            key = {
                href
            }
            data - id = {
                dataId
            }
            style = {
                inlineStyles
            } { ...{
                    label,
                    href
                }
            } { ...gaDataset
            }
            />
        ))
    } <
    /div> <
    /div>
)

const ClientsGrid = ({
        rows,
        footer,
        className,
        gutter
    }) => {
        const videos = useMemo(
            () =>
            flatten(rows.map(({
                testimonials
            }) => testimonials))
            .filter(({
                type
            }) => type === 'video')
            .map(({
                videoIdentifier: id,
                authorCompany: title
            }) => ({
                id,
                title
            })), [rows]
        )

        return ( <
            PageSection className = {
                className
            }
            width = {
                PageSection.Variant.Width.Fixed
            }
            space = {
                PageSection.Variant.Space.None
            } >
            <
            PageSection space = {
                classNames({
                    [PageSection.Variant.Space.Medium]: footer,
                    [PageSection.Variant.Space.None]: !footer
                })
            } >
            <
            Grid role = "list" { ...{
                    gutter
                }
            } > {
                rows.map(({
                    title,
                    description,
                    testimonials
                }, index) => ( <
                    Fragment key = {
                        index
                    } > {
                        title && ( <
                            Cell desktop = {
                                4
                            }
                            styleName = "cell"
                            role = "listitem" >
                            <
                            div styleName = "title-item" >
                            <
                            SectionTitle styleName = "title"
                            dataId = "clients-grid-title" > {
                                title
                            } <
                            /SectionTitle>

                            {
                                description && ( <
                                    p styleName = "description" > {
                                        description
                                    } < /p>
                                )
                            } <
                            /div> <
                            /Cell>
                        )
                    }

                    <
                    Testimonials { ...{
                            testimonials,
                            gutter,
                            videos
                        }
                    }
                    isTitleCell = {!!title
                    }
                    /> <
                    /Fragment>
                ))
            } <
            /Grid> <
            /PageSection>

            {
                footer && < FooterCta { ...footer
                }
                />} <
                /PageSection>
            )
        }

        ClientsGrid.propTypes = {
            rows: CollectionPropTypes({
                title: PropTypes.string,
                description: PropTypes.string,
                testimonials: PropTypes.array.isRequired
            }).isRequired,
            footer: PropTypes.shape({
                title: PropTypes.string.isRequired,
                ctas: CollectionPropTypes({
                    ...LinkableEntityWithGAPropTypes,
                    dataId: PropTypes.string,
                    inlineStyles: PropTypes.object
                })
            }),
            className: PropTypes.string,
            gutter: Grid.propTypes.gutter
        }

        export default ClientsGrid