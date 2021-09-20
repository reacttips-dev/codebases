export const isSelected = (href, selectedSlug) =>
    !!href && href.slice(href.lastIndexOf('/') + 1) === selectedSlug