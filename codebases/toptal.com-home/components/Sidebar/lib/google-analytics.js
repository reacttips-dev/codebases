import {
    kebabCase
} from 'lodash'

import {
    gaDataset
} from '~/lib/ga-helpers'

import {
    trackGAEvent
} from '~/components/VendorScripts/vendors/google-analytics'

const trackEvent = (label, kind) => {
    trackGAEvent(GACategory, getGAAction(kind), label)
}

export const GACategory = 'nav'

export const Label = {
    NavToggle: state => `clicks_${state}`,
    CaseStudyOpen: index => `clicks_case_study_${index + 1}`,
    TrendingSkillClick: (index, label) =>
        `trending_${index + 1}_skill_${kebabCase(label)}`,
    InDemandItemClick: (index, type, label) =>
        `in_demand_${index + 1}_${type}_${kebabCase(label)}`,
    VideoTestimonialClick: 'clicks_talent_video',
    SkillSearch: label => `skill_search_${label}`,
    VerticalSelectorClick: vertical => `skill_picker_${vertical}_click`,
    SkillClick: (vertical, label) =>
        `skill_picker_${vertical}_${kebabCase(label)}_click`
}

export const getGAAction = kind => `hamburger_menu_${kind}`

export const trackSidebarToggle = (state, kind) => {
    trackEvent(Label.NavToggle(state), kind)
}

export const trackCaseStudy = (index, kind) => {
    trackEvent(Label.CaseStudyOpen(index), kind)
}

export const trackTrendingSkills = (index, label, kind) => {
    trackEvent(Label.TrendingSkillClick(index, label), kind)
}

export const trackInDemandItem = (index, type, label, kind) => {
    trackEvent(Label.InDemandItemClick(index, type, label), kind)
}

export const trackVideoTestimonial = kind => {
    trackEvent(Label.VideoTestimonialClick, kind)
}

export const trackSkillSearch = (label, kind) => {
    trackEvent(Label.SkillSearch(label), kind)
}

export const trackVerticalSelector = (label, kind) => {
    trackEvent(Label.VerticalSelectorClick(label), kind)
}

export const createSkillGADataset = (vertical, label, kind) => {
    return gaDataset(
        GACategory,
        getGAAction(kind),
        Label.SkillClick(vertical, label)
    )
}

export const State = {
    Open: 'open',
    Close: 'close'
}