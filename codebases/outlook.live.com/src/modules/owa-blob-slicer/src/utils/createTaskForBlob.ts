import { CompletionStatus, SliceAction, SliceByteRange } from '../types';

export interface BlobTask {
    task: () => Promise<CompletionStatus>;
    cancelTask: () => void;
}

export function createTaskForBlob(
    blob: Blob,
    slices: SliceByteRange[],
    numberOfSlicesToParallelize: number,
    sliceAction: SliceAction,
    totalSlices: number,
    getSliceNumber: (sliceNumberIndex: number) => number
): BlobTask {
    // A variable and the corresponding function to change the variable
    // which keeps track of if cancellation is requested or not
    let isCancelled = false;
    const cancelTask = () => (isCancelled = true);

    const task = () => {
        /* tslint:disable:promise-must-complete */
        return new Promise<CompletionStatus>((resolve, reject) => {
            let onGoingSlices = 0; // The number of currently slices being acted upon, used to parallelize
            let slicesCompleted = 0;
            let nextSliceIndex = 0;

            // The function to start the action on a particular slice
            const initiateSliceAction = (sliceNumber: number) => {
                const { start, end } = slices[sliceNumber];
                const sliceOfTheBlob = blob.slice(start, end);

                return sliceAction(sliceOfTheBlob, getSliceNumber(sliceNumber), totalSlices);
            };

            // The function that handles what to do once the action on
            // the slice has been completed
            const onSliceCompleted = (sliceNumber: number) => {
                onGoingSlices -= 1;
                slicesCompleted += 1;

                if (slicesCompleted === slices.length) {
                    // If all the slices have been completed then resolve
                    resolve(CompletionStatus.Completed);
                }

                // Try to start any next remaining slice
                tryStartNextSlice();
            };

            // The function that starts the next slice if it can
            const tryStartNextSlice = () => {
                if (isCancelled) {
                    // If the cancellation was invoked then resolve
                    // immediately with cancel status so that any further
                    // slices are not processed
                    resolve(CompletionStatus.Cancelled);
                }

                // Only start a slices if there is any remaining and the parallelization factor allows
                // us to start the action on another slice
                if (onGoingSlices < numberOfSlicesToParallelize && nextSliceIndex < slices.length) {
                    initiateSliceAction(nextSliceIndex)
                        .then(() => onSliceCompleted(nextSliceIndex))
                        .catch(reject);

                    nextSliceIndex += 1;
                    onGoingSlices += 1;
                }
            };

            // Start the first few slices to bootstrap the process
            for (let i = 0; i < numberOfSlicesToParallelize; i++) {
                tryStartNextSlice();
            }
        });
        /* tslint:enable:promise-must-complete */
    };

    return {
        task: task,
        cancelTask: cancelTask,
    };
}
