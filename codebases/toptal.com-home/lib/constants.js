import breakpoints from '~/styles/breakpoints.export.scss'

export {
    AppEnv
}
from '@toptal/frontier'

export {
    default as Page
}
from '~/lib/page'

// There are no real numbers in the dictionary when it's being used in Jest,
// Let's make them zeroes in order to not break the interface (preserve numbers).
export const Breakpoints = Object.freeze({
    DESKTOP_LARGE: breakpoints.desktopLarge || 0,
    DESKTOP: breakpoints.desktop || 0,
    TABLET: breakpoints.tablet || 0,
    MOBILE_LARGE: breakpoints.mobileLarge || 0,
    MOBILE_XLARGE: breakpoints.mobileXLarge || 0,
    MOBILE: breakpoints.mobile || 0
})

export const Vertical = {
    Designers: 'designers',
    Developers: 'developers',
    FinanceExperts: 'finance_experts',
    ProjectManagers: 'project_managers',
    ProductManagers: 'product_managers',
    Projects: 'projects'
}

export const TALENT_NOUNS = {
    [Vertical.Designers]: 'Designer',
    [Vertical.Developers]: 'Developer',
    [Vertical.FinanceExperts]: 'Finance Expert',
    [Vertical.ProductManagers]: 'Product Manager',
    [Vertical.ProjectManagers]: 'Project Manager'
}

export const TALENT_PLURAL_NOUNS = {
    [Vertical.Designers]: 'Designers',
    [Vertical.Developers]: 'Developers',
    [Vertical.FinanceExperts]: 'Finance Experts',
    [Vertical.ProductManagers]: 'Product Managers',
    [Vertical.ProjectManagers]: 'Project Managers',
    [Vertical.Projects]: 'Projects'
}

export const SUPPORTED_VERTICALS = Object.values(Vertical)

export const HIRING_GUIDE_HASH = 'hiring-guide'

export const placeholderImage =
    'data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='