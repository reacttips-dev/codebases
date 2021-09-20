import {
    useMemo
} from 'react'
import {
    get
} from 'lodash'

export const SKILLS_LIMIT = 13

export function useFiltererTags(
    skills,
    pageSkill,
    canonicalSkillPage,
    tagLinks = true
) {
    return useMemo(() => {
        // NOTE: filter related/similar skills
        const filteredSkills = skills.filter(
            ({
                href
            }) =>
            pageSkill.href !== href && href !== get(canonicalSkillPage, 'href')
        )
        const mainSkillPage = canonicalSkillPage || pageSkill

        return [mainSkillPage, ...filteredSkills]
            .slice(0, SKILLS_LIMIT)
            .map(({
                href,
                ...tag
            }) => ({ ...tag,
                href: tagLinks ? href : null
            }))
    }, [pageSkill, canonicalSkillPage, skills, tagLinks])
}