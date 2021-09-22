import {
    HTML5ImplicitRoles,
    OptionalLabelRoles,
    RequiredLabelRoles,
    PageWidthRoles,
} from './selectors';
import isElementPageScoped from './isElementPageScoped';

// Return the explicitly-defined role, if available; otherwise, try to return
// an implicit role.
export default function getRole(element: Element) {
    let role = element.getAttribute('role') || HTML5ImplicitRoles[element.tagName] || null;
    if (
        OptionalLabelRoles.includes(role) ||
        RequiredLabelRoles.includes(role) ||
        (PageWidthRoles.includes(role) && isElementPageScoped(element))
    ) {
        return role;
    }

    return null;
}
