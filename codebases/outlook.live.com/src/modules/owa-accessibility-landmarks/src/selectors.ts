// Some roles (i.e. header and footer) are only landmarks if they're page-width
// (i.e. they aren't in a sectioning content element or sectioning root element
// that isn't <body>)
// c.f. https://www.w3.org/TR/html-aam-1.0/#html-element-role-mappings
const PageWidthRoles = ['banner', 'contentinfo'];
const PageWidthElements = ['FOOTER', 'HEADER'];
const PageWidthSelectors = PageWidthRoles.map(e => `[role=${e}]`).concat(PageWidthElements);

// Some roles are always landmarks
const OptionalLabelRoles = ['complementary', 'main', 'navigation', 'search'];
const OptionalLabelElements = ['ASIDE', 'MAIN', 'NAV'];
const OptionalLabelSelectors = OptionalLabelRoles.map(e => `[role=${e}]`).concat(
    OptionalLabelElements
);

// Some roles are only landmarks if they have an 'aria-label' or
// 'aria-labelledby' attribute.
// c.f. https://www.w3.org/TR/html-aam-1.0/#html-element-role-mappings
const RequiredLabelRoles = ['form', 'region'];
const RequiredLabelElements = ['FORM', 'SECTION'];
const RequiredLabelSelectors = RequiredLabelRoles.map(e => `[role=${e}]`)
    .concat(RequiredLabelElements)
    .map(role => [
        `${role}[aria-label]:not([aria-label=''])`,
        `${role}[aria-labelledby]:not([aria-labelledby=''])`,
    ])
    .reduce((acc, internalArray) => acc.concat(internalArray));

// Create a single comma-separated string of CSS selectors, since that's what
// document.querySelectorAll takes
const RegionLandmarkSelector = [
    ...PageWidthSelectors,
    ...OptionalLabelSelectors,
    ...RequiredLabelSelectors,
].join(', ');

// Some HTML5 semantic tags have implicit roles
const HTML5ImplicitRoles = {
    ASIDE: 'complementary',
    FOOTER: 'contentinfo',
    FORM: 'form',
    HEADER: 'banner',
    MAIN: 'main',
    NAV: 'navigation',
    SECTION: 'region',
};

export default RegionLandmarkSelector;
export { PageWidthRoles, OptionalLabelRoles, RequiredLabelRoles };
export { PageWidthElements, OptionalLabelElements, RequiredLabelElements };
export { HTML5ImplicitRoles };
