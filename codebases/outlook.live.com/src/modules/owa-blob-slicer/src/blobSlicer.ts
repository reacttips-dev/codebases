import {
    BlobSliceManagerProperties,
    BlobSliceManagerValues,
    CompletionStatus,
    SliceAction,
} from './types';
import { BlobTask, createTaskForBlob } from './utils/createTaskForBlob';
import { createSliceByteRanges } from './utils/createSliceByteRanges';
import { DEFAULT_NUMBER_OF_SLICES_TO_PARALLELIZE, DEFAULT_SLICE_SIZE } from './constants';

const defaultProperties: BlobSliceManagerProperties = Object.freeze({
    sliceSize: DEFAULT_SLICE_SIZE,
    numberOfSlicesToParallelize: DEFAULT_NUMBER_OF_SLICES_TO_PARALLELIZE,
});

/**
 * It splits the blob into slices and then performs `sliceAction` for each of the
 * slices.
 * @param blob is the blob which needs to be sliced
 * @param sliceAction the action to perform for each slice
 * @param properties various properties for the slicing and parallelization
 * @returns Promise of completion and also ability to cancel the whole action
 */
export function startBlobSlicingTask(
    blob: Blob,
    sliceAction: SliceAction,
    properties: BlobSliceManagerProperties = defaultProperties
): BlobSliceManagerValues {
    // Set the properties to default if not provided
    fillValuesNotProvidedWithDefaultValues(properties);
    const { sliceSize, numberOfSlicesToParallelize } = properties;

    // Calculate the slice information which inlcudes the start and end bytes of the slice
    const totalSlices = Math.ceil(blob.size / sliceSize);
    const slices = createSliceByteRanges(totalSlices, sliceSize, blob.size);

    // Create the necessary actions to start the task
    const firstSliceAction: BlobTask = createTaskForBlob(
        blob,
        [slices[0]], // The first slice
        1, // As its just one slice so the parallelization factor is 1
        sliceAction,
        totalSlices,
        () => 0
    );

    // Parallelize all the slices apart from the first and last slice
    const performActionOnSlicesInParallel: BlobTask =
        slices.length > 2
            ? createTaskForBlob(
                  blob,
                  slices.slice(1, slices.length - 1), // All slices apart from the first and last slice
                  numberOfSlicesToParallelize,
                  sliceAction,
                  totalSlices,
                  sliceNumber => sliceNumber + 1
              )
            : noOpBlobTask();

    // Create the last slice only if there are more than one slices
    const lastSliceAction: BlobTask =
        slices.length > 1
            ? createTaskForBlob(
                  blob,
                  [slices[slices.length - 1]], // The last slice
                  1, // As its just one slice so the parallelization factor is 1
                  sliceAction,
                  totalSlices,
                  () => slices.length - 1
              )
            : noOpBlobTask();

    // This will perform the action on first slice then parallelize all other
    // slices except the last slice. Once all other slices are done then it will
    // start the last slice.
    const onCompletePromise = firstSliceAction
        .task()
        .then(skipTaskIfNotCompleted(performActionOnSlicesInParallel.task))
        .then(skipTaskIfNotCompleted(lastSliceAction.task));

    const cancel = () => {
        // Cancel all the tasks
        firstSliceAction.cancelTask();
        performActionOnSlicesInParallel.cancelTask();
        lastSliceAction.cancelTask();
    };

    return {
        onCompletePromise: onCompletePromise,
        cancel: cancel,
    };
}

/**
 * It starts the next task if the previous one was completed otherwise
 * it returns back the same result
 */
function skipTaskIfNotCompleted(task: () => Promise<CompletionStatus>) {
    return (result: CompletionStatus) => {
        if (result === CompletionStatus.Completed) {
            return task();
        } else {
            return Promise.resolve(result);
        }
    };
}

/**
 * A blob task that is a no-operation as it just resolves immediately and
 * in case of cancellation returns back the appropriate result.
 */
function noOpBlobTask() {
    let isCancelled = false;
    const cancelTask = () => (isCancelled = true);

    return {
        task: () =>
            isCancelled
                ? Promise.resolve(CompletionStatus.Cancelled)
                : Promise.resolve(CompletionStatus.Completed),
        cancelTask: cancelTask,
    };
}

/**
 * Initializes the property values that have not been set
 */
function fillValuesNotProvidedWithDefaultValues(properties: BlobSliceManagerProperties) {
    properties.sliceSize = properties.sliceSize || defaultProperties.sliceSize;
    properties.numberOfSlicesToParallelize =
        properties.numberOfSlicesToParallelize || defaultProperties.numberOfSlicesToParallelize;
}
