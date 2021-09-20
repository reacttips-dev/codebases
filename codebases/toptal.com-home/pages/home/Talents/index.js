import React, {
    useState
} from 'react'
import PropTypes from 'prop-types'
import {
    first
} from 'lodash'

import Grid, {
    Cell
} from '~/components/Grid'
import Tabs from '~/components/Tabs'
import TalentCard, {
    TalentCardVariation
} from '~/components/TalentCard'
import {
    PageSection
} from '~/components/Library'

import './talents.scss'

const TabsList = ({
    tabs
}) => {
    const [tab, setTab] = useState(first(tabs).title)

    return ( <
        Tabs value = {
            tab
        }
        onChange = {
            setTab
        }
        styleName = "tabs" > {
            tabs.map(tab => ( <
                Tabs.Item key = {
                    tab.title
                }
                id = {
                    tab.title
                }
                title = {
                    tab.title
                } >
                <
                Grid styleName = "tab-container"
                gutter = {
                    {
                        mobile: 2
                    }
                }
                role = "list" >
                {
                    tab.showcaseTalents.map(talent => ( <
                        Cell styleName = "talent"
                        key = {
                            talent.fullName
                        }
                        tablet = {
                            6
                        }
                        desktop = {
                            4
                        }
                        role = "listitem" >
                        <
                        TalentCard variation = {
                            TalentCardVariation.Large
                        }
                        showCta data = {
                            {
                                avatar: talent.imageUrl,
                                name: talent.fullName,
                                role: talent.jobTitle,
                                bio: talent.bio,
                                vertical: talent.vertical,
                                company: {
                                    logo: talent.previousCompanyImageUrl,
                                    title: talent.previousCompanyName
                                },
                                publicResumeUrl: talent.publicResumeUrl,
                                firstName: talent.firstName
                            }
                        }
                        /> <
                        /Cell>
                    ))
                } <
                /Grid> <
                /Tabs.Item>
            ))
        } <
        /Tabs>
    )
}

const Talents = ({
    title,
    tabs
}) => {
    return ( <
        PageSection semantic width = {
            PageSection.Variant.Width.Fixed
        }
        forceSpace >
        <
        h2 styleName = "title"
        data - id = "talents-title" > {
            title
        } <
        /h2> <
        TabsList tabs = {
            tabs
        }
        /> <
        /PageSection>
    )
}

Talents.propTypes = {
    title: PropTypes.string.isRequired,
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            showcaseTalents: PropTypes.arrayOf(
                PropTypes.shape({
                    fullName: PropTypes.string,
                    jobTitle: PropTypes.string,
                    previousCompanyName: PropTypes.string,
                    imageUrl: PropTypes.string,
                    previousCompanyImageUrl: PropTypes.string,
                    bio: PropTypes.string,
                    publicResumeUrl: PropTypes.string.isRequired,
                    firstName: PropTypes.string.isRequired
                })
            )
        })
    )
}

export default Talents