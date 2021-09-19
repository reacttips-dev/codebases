import { ContentRect } from './ContentRect';

class ResizeObserverEntry {
    public readonly target: Element;
    public readonly contentRect: ContentRect;
    constructor(target: Element) {
        this.target = target;
        this.contentRect = ContentRect(target);
    }
}

export { ResizeObserverEntry };
