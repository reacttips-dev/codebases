import { isStringNullOrWhiteSpace } from 'owa-localize';
import { ObservableMap } from 'mobx';
import { BusStopState } from 'owa-mail-list-store';
import mailStore from 'owa-mail-store/lib/store/Store';
import { getItemToShowFromNodeId } from 'owa-mail-store/lib/utils/conversationsUtils';

import * as trace from 'owa-trace';

export interface IdMap {
    [nodeId: string]: any;
}

/**
 * Create the bus stop state map which contains <nodeId, BusStopState>
 * @param nodeId the node id
 * @param allConversationNodeIds all the conversation node ids
 */
export default function createBusStopStateMapInternal(
    nodeId: string,
    allConversationNodeIds: string[]
): ObservableMap<string, BusStopState> {
    const nodeIdsInCurrentFork: IdMap = getNodeIdsInCurrentFork(nodeId);
    if (Object.keys(nodeIdsInCurrentFork).length === 1) {
        return setSingleCheckStateOnSelectedItem(nodeId, allConversationNodeIds);
    }

    const busStopStateMap: ObservableMap<string, BusStopState> = new ObservableMap({});
    let busStarted: boolean = false;
    let busEnded: boolean = false;
    let stopsMarkedCount: number = 0;
    // Now do a single pass through the item parts, creating bus stop states linking items in the current fork.
    for (let i = 0; i < allConversationNodeIds.length; i++) {
        const currentNode = mailStore.conversationNodes.get(allConversationNodeIds[i]);
        if (currentNode) {
            // If current node is part of the current fork
            if (nodeIdsInCurrentFork[currentNode.internetMessageId]) {
                if (!busStarted) {
                    // Found the start of the bus line if node is part of current fork and bus line has not started already
                    busStopStateMap.set(currentNode.internetMessageId, BusStopState.BusStart);
                    busStarted = true;
                } else {
                    if (stopsMarkedCount + 1 === Object.keys(nodeIdsInCurrentFork).length) {
                        // Found the end of the bus line if we've hit the number of expected stops.
                        busStopStateMap.set(currentNode.internetMessageId, BusStopState.BusEnd);
                        busEnded = true;
                    } else {
                        // If this is node is part of the current fork but is not the end of the bus line, it is a bus stop.
                        busStopStateMap.set(currentNode.internetMessageId, BusStopState.BusStop);
                    }
                }
                // Keep count of number of stops we have already marked
                stopsMarkedCount++;
            } else {
                if (!busStarted || busEnded) {
                    // If this is node is not part of the current fork, and this is before start or after end of the bus line, then set None state.
                    busStopStateMap.set(currentNode.internetMessageId, BusStopState.None);
                } else {
                    // If this is node is not part of the current fork, and this is between the start and end of the bus line, this is a no stop line.
                    busStopStateMap.set(currentNode.internetMessageId, BusStopState.NoStop);
                }
            }
        }
    }

    return busStopStateMap;
}

/**
 * Get all node ids in the current folk based on the parentInternetMessageId
 * @param nodeId to start
 * @returns an id map where the key is the node id
 */
function getNodeIdsInCurrentFork(currentNodeId: string): IdMap {
    const nodeIdsInCurrentFork: IdMap = {};
    const currentNode = mailStore.conversationNodes.get(currentNodeId);
    let nodeInCurrentFork = currentNode;
    while (nodeInCurrentFork) {
        if (nodeIdsInCurrentFork[nodeInCurrentFork.internetMessageId]) {
            // If this node has already been seen in the current fork, it means we have a loop in the
            // ParentInternetMessageId pointers.This is not valid under RFC but could still happen,
            // so we should avoid infinite looping by just stopping here.
            trace.errorThatWillCauseAlert('Invalid loop found in ParentInternetMessageId pointers');
            break;
        }

        if (getItemToShowFromNodeId(nodeInCurrentFork.internetMessageId)) {
            // Mark the node as a part of the current fork if the item is shown
            nodeIdsInCurrentFork[nodeInCurrentFork.internetMessageId] = true;
        }

        if (isStringNullOrWhiteSpace(nodeInCurrentFork.parentInternetMessageId)) {
            // If we found the node with an empty parent node id, it means we hit the end of the fork
            break;
        } else {
            // Haven't reached the end yet, try to go to current node's parent node
            nodeInCurrentFork = mailStore.conversationNodes.get(
                nodeInCurrentFork.parentInternetMessageId
            );
        }
    }
    return nodeIdsInCurrentFork;
}

function setSingleCheckStateOnSelectedItem(
    selectedNodeId: string,
    allNodeIds: string[]
): ObservableMap<string, BusStopState> {
    const busStopStateMap: ObservableMap<string, BusStopState> = new ObservableMap({});
    allNodeIds.forEach(nodeId => {
        const conversationNode = mailStore.conversationNodes.get(nodeId);
        const busStopState: BusStopState =
            nodeId === selectedNodeId ? BusStopState.CheckMark : BusStopState.None;
        busStopStateMap.set(conversationNode.internetMessageId, busStopState);
    });
    return busStopStateMap;
}
