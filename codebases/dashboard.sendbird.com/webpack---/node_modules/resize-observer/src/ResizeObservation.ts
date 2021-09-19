import { ContentRect } from './ContentRect';

class ResizeObservation {
    public readonly target: Element;

    /** @internal */
    public $$broadcastWidth: number;
    /** @internal */
    public $$broadcastHeight: number;

    public get broadcastWidth(): number {
        return this.$$broadcastWidth;
    }
    public get broadcastHeight(): number {
        return this.$$broadcastHeight;
    }

    constructor(target: Element) {
        this.target = target;
        this.$$broadcastWidth = this.$$broadcastHeight = 0;
    }

    public isActive(): boolean {
        const cr = ContentRect(this.target);

        return !!cr
            && (
                cr.width !== this.broadcastWidth
                || cr.height !== this.broadcastHeight
            );
    }
}

export { ResizeObservation };
