import {
    getHydratedComponents
} from '@toptal/frontier'
import React from 'react'

import {
    getTrustpilotSettings,
    TRUSTPILOT_TEMPLATES
} from '~/lib/get-trustpilot-config'
import {
    Page
} from '~/lib/constants'

import PageTemplate from '~/components/PageTemplate'
import StructuredDataSection from '~/components/StructuredDataSection'
import Navbar from '~/components/Navbar'
import Footer from '~/components/Footer'
import FeatureStepper from '~/components/FeatureStepper'
import BlogSection from '~/components/BlogSection'
import HireCta from '~/components/HireCta'
import VideoQuote from '~/components/VideoQuote'
import ClientTestimonials from '~/components/ClientTestimonials'
import ClientsGrid from '~/components/ClientsGrid'
import SkillsListGroup from '~/components/SkillsListGroup'
import {
    PageSection
} from '~/components/Library'
import SkipLinks from '~/components/_atoms/SkipLinks'

import Hero from './Hero'
import USP from './USP'
import Verticals from './Verticals'
import Talents from './Talents'
import organizationSchema from './organization-schema'
import websiteSchema from './website-schema.json'

// TODO: add linting rules that prevent calling getHydrated and creating
// hydrated components from anywhere except the top module scope
const Hydrated = getHydratedComponents(
    Page.Home, {
        Hero,
        Navbar,
        USP,
        Verticals,
        FeatureStepper,
        ClientsGrid,
        VideoQuote,
        ClientTestimonials,
        Talents
    }, {
        Hero: {
            defer: true
        }
    }
)

/**
 * Home page component
 */
const Home = ({
    data: {
        page,
        requestMetadata
    }
}) => {
    const {
        navigationSection,
        navbarSection,
        heroSection,
        trustbar,
        benefitsSection,
        talentTabsSection,
        timelineSection,
        pressTestimonialsSection,
        dynamicBlogPostsSection,
        footerSection,
        clientTestimonialsSection,
        testimonialsGridSection,
        dynamicSkillPagesSections,
        ctaSection,
        sidebarKind
    } = page

    const heroId = 'main'
    const footerId = 'footer'

    const skipLinks = [{
            target: heroId,
            label: 'Skip to content'
        },
        {
            target: footerId,
            label: 'Skip to footer'
        }
    ]

    const trustPilot = getTrustpilotSettings(requestMetadata, {
        templateId: TRUSTPILOT_TEMPLATES.HOME_PAGE,
        disableSEOSnippet: true
    })

    const {
        publicUrl,
        bounceModals,
        vertical,
        seo,
        slug
    } = page
    const {
        platformSessionUrl,
        graphqlUrl,
        topSearchResultsPageUrl
    } = requestMetadata // TODO: do the same for other pages

    return ( <
        PageTemplate isPartiallyHydrated page = {
            {
                publicUrl,
                bounceModals,
                vertical,
                seo,
                slug
            }
        }
        isSidebarEnabled = {!!sidebarKind
        } { ...{
                requestMetadata
            }
        } >
        <
        SkipLinks links = {
            skipLinks
        }
        /> <
        Hydrated.Navbar logo = {
            {
                type: Navbar.Variant.Logo.Type.WordmarkPng
            }
        }
        navbarData = {
            navbarSection
        }
        sticky { ...{
                platformSessionUrl
            }
        }
        sidebar = {
            {
                kind: sidebarKind,
                graphqlUrl,
                topSearchResultsPageUrl,
                footerSection
            }
        }
        /> <
        Hydrated.Hero id = {
            heroId
        } { ...heroSection
        } { ...{
                trustbar
            }
        }
        /> <
        Hydrated.Verticals { ...navigationSection
        }
        /> <
        Hydrated.USP { ...benefitsSection
        }
        pickRandomly / >
        <
        PageSection >
        <
        Hydrated.FeatureStepper { ...timelineSection
        }
        /> <
        /PageSection> <
        Hydrated.Talents { ...talentTabsSection
        }
        /> <
        PageSection semantic >
        <
        Hydrated.ClientsGrid { ...testimonialsGridSection
        }
        gutter = {
            {
                mobile: 2
            }
        }
        /> <
        /PageSection> <
        Hydrated.VideoQuote { ...pressTestimonialsSection
        }
        /> <
        PageSection >
        <
        Hydrated.ClientTestimonials { ...clientTestimonialsSection
        } { ...{
                trustPilot
            }
        }
        limit = {
            3
        }
        /> <
        /PageSection> <
        PageSection >
        <
        BlogSection { ...dynamicBlogPostsSection
        }
        /> <
        /PageSection> <
        SkillsListGroup items = {
            dynamicSkillPagesSections
        }
        /> <
        HireCta title = {
            ctaSection.title
        }
        cta = {
            ctaSection.ctas[0]
        }
        /> <
        Footer id = {
            footerId
        } { ...footerSection
        }
        /> <
        StructuredDataSection schema = {
            websiteSchema
        }
        /> <
        StructuredDataSection schema = {
            organizationSchema
        }
        /> <
        /PageTemplate>
    )
}

export default Home