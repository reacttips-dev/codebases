import { ApolloLink, Observable, Observer, FetchResult, Operation, NextLink } from '@apollo/client';
import { getOperationType } from '../util/getOperationType';
import { getGuid } from 'owa-guid';

/**
 * Operation Entry type for queue
 */
interface OperationEntry {
    id: string;
    operation: Operation;
    forward: NextLink;
    observer: Observer<FetchResult>;
    subscription?: { unsubscribe: () => void };
}

export class QueueOperationLink extends ApolloLink {
    // Operations queue
    private operationQueue: OperationEntry[] = [];

    /**
     * Apollo link's request method. When Link is executed, the request method gets executed
     * @param operation operation that will be executed
     * @param forward observable next link that will be called to continue the chained execution
     * @returns observable object that
     */
    public request(operation: Operation, forward: NextLink): Observable<FetchResult> {
        // At this point we are only queuing query operations
        if (getOperationType(operation) != 'query' || !operation.getContext().queueOperation) {
            return forward(operation);
        }

        return new Observable(observer => {
            const entry = { id: getGuid(), operation, forward, observer };
            this.enqueue(entry);

            return () => {
                this.cleanupOperationAndExecuteNext(entry);
            };
        });
    }

    /**
     * Add an operation to the end of the queue.
     * @param entry operation entry to be queued
     */
    private enqueue(entry: OperationEntry) {
        this.operationQueue.push(entry);

        // If it's only an operation in the queue, start it.
        if (this.operationQueue.length === 1) {
            this.tryExecuteOperationInQueue();
        }
    }

    /**
     * Start the first operation in the queue
     */
    private tryExecuteOperationInQueue() {
        // No-op if there are no more operations in the queue.
        if (this.operationQueue.length === 0) {
            return;
        }

        const { operation, forward, observer } = this.operationQueue[0];

        // Execute operation now by calling subscribe and attach the original observer callbacks
        this.operationQueue[0].subscription = forward(operation).subscribe({
            next: v => observer.next?.(v),
            error: (e: Error) => {
                observer.error?.(e);
            },
            complete: () => {
                observer.complete?.();
            },
        });
    }

    /**
     * Cleans up operation by removing it from the queue and unsubscribing if it is currently in progress.
     * @param entryToRemove entry for the operation to remove
     */
    private cleanupOperationAndExecuteNext(entryToRemove: OperationEntry) {
        const index = findIndex(this.operationQueue, entryToRemove);
        if (index >= 0) {
            const entry = this.operationQueue[index];
            if (entry.subscription) {
                entry.subscription.unsubscribe();
            }
            this.operationQueue.splice(index, 1);
        }

        // Try running next operation in the queue
        this.tryExecuteOperationInQueue();
    }
}

function findIndex(entries: OperationEntry[], entry: OperationEntry): number {
    let index = -1;

    entries.some((e, i) => {
        if (e.id == entry.id) {
            index = i;
            return true;
        }

        return false;
    });

    return index;
}
