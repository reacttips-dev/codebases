type Layout = 'Desktop' | 'Phone';
let overrideLayout: Layout;

export function setLayout(layout: Layout) {
    overrideLayout = layout;
}

export function getLayout() {
    return overrideLayout || 'Desktop';
}
