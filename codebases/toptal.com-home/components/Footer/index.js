import React, {
    useContext
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
    LinkableEntityArray,
    LinkableEntityPropTypes,
    CollectionPropTypes,
    VariantPropTypes
} from '~/lib/prop-types'
import getVariants from '~/lib/get-variants'

import FooterLogo from '~/components/FooterLogo'
import SectionContainer from '~/components/SectionContainer'
import SocialLinkList from '~/components/SocialLinkList'
import {
    PageContext
} from '~/components/PageTemplate'

import footerExperimentDataParser from './lib/footer-experiment-data-parser'

import './footer.scss'

const Variant = {
    Theme: {
        Light: 'light'
    },
    Padding: {
        Top: 'top'
    }
}

const SocialMediaColumn = ({
    title,
    links,
    theme
}) => {
    const {
        Theme
    } = SocialLinkList.Variant

    return ( <
        div styleName = "column" >
        <
        h3 styleName = "column-title" > {
            title
        } < /h3> <
        SocialLinkList { ...{
                links
            }
        }
        theme = {
            theme === Variant.Theme.Light ? Theme.Grey : Theme.Light
        }
        /> <
        /div>
    )
}

SocialMediaColumn.propTypes = {
    title: PropTypes.string.isRequired,
    links: LinkableEntityArray.isRequired,
    theme: VariantPropTypes(Variant.Theme)
}

/**
 * Top/links section of the footer component
 */
export const SectionLinks = ({
        columns,
        socialMedia,
        theme
    }) => ( <
        div styleName = "links-container" > {
            columns ? .map(({
                links,
                title
            }) => ( <
                div key = {
                    title
                }
                styleName = "column" >
                <
                h3 styleName = "column-title"
                data - id = "footer-column-title" > {
                    title
                } <
                /h3> <
                ul > {
                    links.map(({
                        href,
                        label
                    }) => ( <
                        li key = {
                            href + label
                        }
                        styleName = "list-item is-text" >
                        <
                        a { ...{
                                href
                            }
                        } > {
                            label
                        } < /a> <
                        /li>
                    ))
                } <
                /ul> <
                /div>
            ))
        }

        {
            socialMedia && < SocialMediaColumn { ...socialMedia
            } { ...{
                    theme
                }
            }
            />} <
            /div>
        )

        /**
         * Bottom/legal section of the footer component
         */
        const SectionLegal = ({
            legal,
            logoLink: {
                href,
                label
            },
            logo
        }) => ( <
            div styleName = "legal-container" >
            <
            div styleName = "legal-divider" / >
            <
            div styleName = "legal-logo" >
            <
            FooterLogo headline = {
                label
            }
            title = "Toptal Home Page" { ...{
                    href,
                    logo
                }
            }
            /> <
            /div> <
            ul styleName = "legal-links" >
            <
            li styleName = "legal-list-item is-title" > {
                legal.title
            } < /li> {
                legal.links.map(({
                    href,
                    label
                }) => ( <
                    li key = {
                        label + href
                    }
                    styleName = "legal-list-item" >
                    <
                    a rel = "nofollow" { ...{
                            href
                        }
                    } > {
                        label
                    } <
                    /a> <
                    /li>
                ))
            } <
            /ul> <
            /div>
        )

        /**
         * Footer component
         */
        const Footer = ({
            id,
            columns,
            socialMedia,
            legal,
            logoLink,
            logo,
            theme,
            padding
        }) => {
            const {
                chameleonExperiments
            } = useContext(PageContext)
            columns = footerExperimentDataParser(columns, chameleonExperiments)

            return ( <
                SectionContainer id = {
                    id
                }
                tag = "footer"
                styleName = {
                    classNames('container', getVariants({
                        theme,
                        padding
                    }))
                } >
                <
                h2 styleName = "sr-only" > Footer < /h2> {
                    (!!socialMedia ? .links ? .length || !!columns ? .length) && ( <
                        SectionLinks { ...{
                                socialMedia,
                                columns,
                                theme
                            }
                        }
                        />
                    )
                } <
                SectionLegal { ...{
                        legal,
                        logoLink,
                        logo
                    }
                }
                /> <
                /SectionContainer>
            )
        }

        const LinkPropTypes = {
            ...LinkableEntityPropTypes,
            imageUrl: PropTypes.string
        }

        Footer.propTypes = {
            id: PropTypes.string,
            columns: CollectionPropTypes({
                title: PropTypes.string,
                links: CollectionPropTypes(LinkPropTypes)
            }),
            socialMedia: PropTypes.shape({
                title: PropTypes.string,
                links: LinkableEntityArray
            }),
            legal: PropTypes.shape({
                title: PropTypes.string,
                links: CollectionPropTypes(LinkPropTypes)
            }),
            logo: FooterLogo.propTypes.logo,
            theme: VariantPropTypes(Variant.Theme),
            padding: VariantPropTypes(Variant.Padding),
            logoLink: PropTypes.shape(LinkPropTypes)
        }

        Footer.Variant = Variant

        export default Footer