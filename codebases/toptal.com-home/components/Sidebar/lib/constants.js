import cssConstants from './constants.export.scss'

const {
    transitionDuration
} = cssConstants

// Jest won't pick any variables from SCSS, so we need a fallback value
export const TRANSITION_DURATION =
    Number.parseInt(transitionDuration, 10) || 500

export const HOST_ELEMENT_ID = 'sidebar-host'

export const SectionType = {
    CaseStudies: 'caseStudiesSection',
    Video: 'videoSection',
    TrendingSkills: 'trendingSkillsSection',
    InDemandTalentAndServices: 'inDemandResourcesSection',
    Social: 'socialShareSection',
    SkillSelector: 'skillSelector',
    Search: 'searchSection'
}

export const Kind = {
    Client: 'client',
    Talent: 'talent'
}