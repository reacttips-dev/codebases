import type { ClientAttachmentId } from 'owa-client-ids';

const fakeProgressIndicatorMap: { [attachmentId: string]: FakeProgressIndicator } = {};
class FakeProgressIndicator {
    private nextUpdateTimer;
    private currentTimePercent: number;
    private maxPercent: number;

    constructor(
        private estimatedTimeToCompleteInMS: number,
        private updateIntervalInPercent: number, // The value should be within (0 - 1.0).
        private updatePropertyHandler: (completePercent: number) => void
    ) {
        this.currentTimePercent = 0.0;
        this.maxPercent = 1 - this.updateIntervalInPercent; // We would leave the set with value 1 to the complete
    }

    start = () => {
        this.currentTimePercent += this.updateIntervalInPercent;
        const actionCompletePercent = this.getActionCompletePercent();
        if (actionCompletePercent <= this.maxPercent) {
            this.updatePropertyHandler(actionCompletePercent);
            this.nextUpdateTimer = setTimeout(
                this.start,
                this.estimatedTimeToCompleteInMS * this.updateIntervalInPercent
            );
        } else {
            this.nextUpdateTimer = null;
        }
    };

    complete() {
        this.clearUpdateTimer();
        this.updatePropertyHandler(1);
        setTimeout(
            () => this.updatePropertyHandler(1.1), // Set 1.1 to hide the progress bar with 1 second delay
            500
        );
    }

    abort() {
        this.clearUpdateTimer();
        this.updatePropertyHandler(0);
    }

    private clearUpdateTimer() {
        if (this.nextUpdateTimer) {
            clearTimeout(this.nextUpdateTimer);
            this.nextUpdateTimer = null;
        }
    }

    // we use square root to make it appear more rewarding at start
    private getActionCompletePercent(): number {
        return Math.sqrt(
            2 * this.currentTimePercent - this.currentTimePercent * this.currentTimePercent
        );
    }
}

export function stopFakeProgressIndicator(attachmentId: ClientAttachmentId, succeeded: boolean) {
    const fakeProgressIndicator = fakeProgressIndicatorMap[attachmentId.Id];

    if (!fakeProgressIndicator) {
        return;
    }

    if (succeeded) {
        fakeProgressIndicator.complete();
    } else {
        fakeProgressIndicator.abort();
    }
    delete fakeProgressIndicatorMap[attachmentId.Id];
}

export default function startFakeProgressIndicator(
    estimatedTimeToCompleteInMS: number,
    updateIntervalInPercent: number,
    updatePropertyHandler: (completePercent: number) => void,
    attachmentId: ClientAttachmentId
) {
    const fakeProgressIndicator = new FakeProgressIndicator(
        estimatedTimeToCompleteInMS,
        updateIntervalInPercent,
        updatePropertyHandler
    );
    fakeProgressIndicatorMap[attachmentId.Id] = fakeProgressIndicator;
    fakeProgressIndicator.start();
}
