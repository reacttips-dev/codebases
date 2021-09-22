const SectioningContentElements = ['ARTICLE', 'ASIDE', 'NAV', 'SECTION'];
const SectioningRootElements = [
    'BLOCKQUOTE',
    'BODY',
    'DETAILS',
    'DIALOG',
    'FIELDSET',
    'FIGURE',
    'TD',
];

// Check whether the given element defines a sectioning scope, i.e. the element
// is either:
// * a main element -
//   https://www.w3.org/TR/html/grouping-content.html#elementdef-main
// * a sectioning root element -
//   https://www.w3.org/TR/html/sections.html#sectioning-roots
// * a sectioning content element -
//   https://www.w3.org/TR/html/dom.html#sectioning-content-2
const isSectioningScopeElement = (e: Element) =>
    e.tagName === 'MAIN' ||
    SectioningContentElements.includes(e.tagName) ||
    SectioningRootElements.includes(e.tagName);

// Check whether the given element is page-scoped, i.e. its nearest
// sectioning-root element is the body tag
export default function isElementPageScoped(element: Element) {
    for (let ancestor = element.parentElement; !!ancestor; ancestor = ancestor.parentElement) {
        if (isSectioningScopeElement(ancestor)) {
            return ancestor === document.body;
        }
    }

    // error case: we shouldn't be able to reach the root node without hitting document.body
    return false;
}
