/**
 * Buffer for Tracking functionality.
 * Useful for throttling, and testing.
 */
export class TrackBuffer {
    private shouldBuffer: () => boolean;

    constructor(shouldBuffer: () => boolean) {
        this.shouldBuffer = shouldBuffer;
    }

    private _rawBuffer = [];

    add(item) {
        if (this.shouldBuffer()) this._rawBuffer.push(item);
    }

    flush() {
        const tmp = this._rawBuffer;
        this._rawBuffer = [];
        return tmp;
    }
}
