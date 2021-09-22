let cssClassIdCounter = 0;

export default function generateNewCSSClassName(prefix: string) {
    return `${prefix}-${cssClassIdCounter++}`;
}
