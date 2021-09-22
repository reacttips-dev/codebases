import type GetPeopleIKnowGraphResponse from 'owa-service/lib/contract/GetPeopleIKnowGraphResponse';
import getPeopleIKnowGraphRequest from 'owa-service/lib/factory/getPeopleIKnowGraphRequest';
import getPeopleIKnowGraphCommandOperation from 'owa-service/lib/operation/getPeopleIKnowGraphCommandOperation';
import { getPeopleIKnowCommandPromiseOverride } from 'owa-groups-adaptors';
import { getOwaCanaryCookie } from 'owa-service/lib/canary';

let serializedPeopleIKnowGraph: string;

export function getPeopleIKnowGraph(): Promise<GetPeopleIKnowGraphResponse> {
    return getPeopleIKnowGraphCommandOperation(
        {
            request: getPeopleIKnowGraphRequest({}),
        },
        {
            headers: <any>{
                'X-OWA-CANARY': getOwaCanaryCookie(),
            },
        }
    );
}

export async function getPeopleIKnowGraphData(): Promise<string> {
    if (!serializedPeopleIKnowGraph) {
        const getter = getPeopleIKnowCommandPromiseOverride
            ? getPeopleIKnowCommandPromiseOverride
            : getPeopleIKnowGraph;

        await getter().then(
            response =>
                (serializedPeopleIKnowGraph = response ? response.SerializedPeopleIKnowGraph : null)
        );
    }

    return Promise.resolve(serializedPeopleIKnowGraph);
}
