/**
 * Buffer for Tracking functionality.
 * Useful for throttling, and testing.
 */
export class TrackBuffer {
    private shouldBuffer: () => boolean;

    private rawBuffer = [];

    constructor(shouldBuffer: () => boolean) {
        this.shouldBuffer = shouldBuffer;
    }

    public add(item) {
        if (this.shouldBuffer()) {
            this.rawBuffer.push(item);
        }
    }

    public flush() {
        const tmp = this.rawBuffer;
        this.rawBuffer = [];
        return tmp;
    }
}



// WEBPACK FOOTER //
// ./src/utils/TrackBuffer.ts