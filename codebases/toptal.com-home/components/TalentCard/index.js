import React, {
    useCallback,
    useEffect,
    useRef
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
    noop,
    kebabCase
} from 'lodash'

import {
    VerticalPropTypes,
    VariantPropTypes,
    GATrackingPropTypes
} from '~/lib/prop-types'
import {
    gaDataset
} from '~/lib/ga-helpers'
import getVariants from '~/lib/get-variants'

import LazyLoadImage from '~/components/_atoms/LazyLoadImage'
import TalentCardOverlay from '~/components/TalentCardOverlay'
import GenericLink from '~/components/_atoms/GenericLink'
import {
    Link
} from '~/components/CTA'

import './talent-card.scss'

export const TalentCardVariation = {
    Small: 'small',
    Medium: 'medium',
    Large: 'large'
}

const PreviousCompany = ({
        title,
        logo
    }) => ( <
        div styleName = "company" >
        <
        span styleName = "company-label" > Previously at < /span> {
            !!title && !logo && < p styleName = "company-title" > {
                title
            } < /p>}

            {
                !!logo && ( <
                    LazyLoadImage styleName = "company-logo"
                    src = {
                        logo
                    }
                    alt = {
                        title
                    }
                    />
                )
            } <
            /div>
        )

        const TalentCard = React.forwardRef(
                ({
                        data,
                        variation = TalentCardVariation.Small,
                        className,
                        style,
                        showCta,
                        /**
                         * TODO: check if providing width="100%" is really needed for some of
                         * component usages and remove if not since it causes HTML validation errors
                         */
                        width = '100%',
                        index,
                        isFocused,
                        role,
                        talentCardOverlayText,
                        onClick = noop,
                        afterLoad = noop,
                        onChange = noop,
                        onFocus = noop
                    },
                    ref
                ) => {
                    const {
                        vertical,
                        company,
                        avatar,
                        name,
                        role: talentRole,
                        bio,
                        publicResumeUrl,
                        firstName,
                        gaCategory,
                        gaEvent,
                        gaLabel,
                        ctaLabel
                    } = data
                    /**
                     * When using the TalentCard, we only want one link in the A11Y tree
                     * pointing to the public resume of that Talent
                     */

                    const resumeLinkRef = useRef(null)

                    const handleLoadPhoto = useCallback(() => {
                        afterLoad(index)
                    }, [index, afterLoad])

                    const photo = ( <
                        >
                        <
                        LazyLoadImage src = {
                            avatar
                        }
                        alt = ""
                        styleName = "photo-file" { ...{
                                width
                            }
                        }
                        onLoad = {
                            handleLoadPhoto
                        }
                        data - happo - hide /
                        >

                        <
                        span styleName = "card-picture-logo"
                        data - happo - hide / >
                        <
                        TalentCardOverlay text = {
                            talentCardOverlayText
                        }
                        styleName = "photo-overlay" /
                        >
                        <
                        />
                    )

                    const isPhotoClickable =
                        variation !== TalentCardVariation.Small && !!publicResumeUrl
                    const verticalName = vertical ? .name || ''

                    const selectCard = useCallback(
                        e => {
                            if (e.key === ' ') {
                                e.preventDefault()
                                onChange(index)
                            }
                        }, [index, onChange]
                    )

                    const focusCard = useCallback(() => onFocus(index), [index, onFocus])

                    useEffect(() => {
                        if (isFocused && resumeLinkRef) {
                            resumeLinkRef.current.focus()
                        }
                    }, [isFocused, resumeLinkRef])

                    const handleClick = useCallback(
                        e => {
                            onClick(e, index)
                        }, [index, onClick]
                    )

                    return ( <
                        div onClick = {
                            handleClick
                        }
                        styleName = {
                            classNames('container', getVariants(variation), {
                                clickable: publicResumeUrl
                            })
                        } { ...{
                                ref,
                                className,
                                style,
                                role
                            }
                        } >
                        {!isPhotoClickable && < div styleName = "photo" > {
                                photo
                            } < /div>}

                            {
                                isPhotoClickable && ( <
                                    GenericLink styleName = "photo"
                                    href = {
                                        publicResumeUrl
                                    }
                                    a11yHidden > {
                                        photo
                                    } <
                                    /GenericLink>
                                )
                            }

                            <
                            div styleName = "info" > {
                                publicResumeUrl ? ( <
                                    GenericLink href = {
                                        publicResumeUrl
                                    }
                                    styleName = "name"
                                    a11yHidden = {
                                        showCta
                                    } { ...gaDataset(gaCategory, gaEvent, gaLabel)
                                    }
                                    data - id = "talent-resume"
                                    onKeyDown = {
                                        selectCard
                                    }
                                    onFocus = {
                                        focusCard
                                    }
                                    ref = {
                                        resumeLinkRef
                                    } >
                                    {
                                        name
                                    } <
                                    /GenericLink>
                                ) : ( <
                                    span styleName = "name" > {
                                        name
                                    } < /span>
                                )
                            }

                            <
                            p
                            styleName = {
                                classNames('role', getVariants(kebabCase(verticalName)))
                            } >
                            {
                                talentRole
                            } <
                            /p> {
                                bio && < p styleName = "bio" > {
                                        bio
                                    } < /p>} {
                                        (company ? .title || company ? .logo) && ( <
                                            PreviousCompany { ...company
                                            }
                                            />
                                        )
                                    } <
                                    /div>

                                {
                                    publicResumeUrl && showCta && ( <
                                        Link size = {
                                            Link.Variant.Size.Large
                                        }
                                        href = {
                                            publicResumeUrl
                                        }
                                        styleName = "cta"
                                        data - id = "talent-cta" >
                                        {
                                            ctaLabel || `View ${firstName}`
                                        } <
                                        /Link>
                                    )
                                } <
                                /div>
                            )
                        }
                    )

                    const TalentCardDataPropTypes = {
                        avatar: PropTypes.string.isRequired,
                        name: PropTypes.string.isRequired,
                        role: PropTypes.string.isRequired,
                        bio: PropTypes.string,
                        vertical: PropTypes.shape({
                            name: VerticalPropTypes.isRequired
                        }),
                        company: PropTypes.shape({
                            logo: PropTypes.string,
                            title: PropTypes.string
                        }),
                        publicResumeUrl: PropTypes.string,
                        ctaLabel: PropTypes.string,
                        firstName: PropTypes.string,
                        ...GATrackingPropTypes
                    }

                    TalentCard.propTypes = {
                        width: PropTypes.string,
                        index: PropTypes.number,
                        isFocused: PropTypes.bool,
                        data: PropTypes.shape(TalentCardDataPropTypes).isRequired,
                        variation: VariantPropTypes(TalentCardVariation),
                        afterLoad: PropTypes.func,
                        onClick: PropTypes.func,
                        onFocus: PropTypes.func,
                        onChange: PropTypes.func,
                        showCta: PropTypes.bool,
                        role: PropTypes.string,
                        talentCardOverlayText: PropTypes.string
                    }

                    TalentCard.dataPropTypes = TalentCardDataPropTypes
                    TalentCard.displayName = 'TalentCard'

                    export default TalentCard