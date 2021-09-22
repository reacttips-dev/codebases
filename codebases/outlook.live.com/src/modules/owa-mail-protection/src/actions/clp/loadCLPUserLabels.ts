import initializeCLPStore from './initializeCLPStore';
import { makeGetRequest } from 'owa-ows-gateway';
import processCLPLabelResponse from '../../service/processCLPLabelResponse';
import { logCLPLabelLoadDatapoint } from '../../utils/clp/logCLPDatapoints';
import refreshCLPViewStateForExistingCompose from './refreshCLPViewStateForExistingCompose';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getApolloClient } from 'owa-apollo';
import { MipDataQueryDocument } from '../../graphql/__generated__/MIPDataQuery.interface';
import buildCLPStoreWithChildren from '../../utils/clp/buildCLPStoreWithChildren';

const CLP_LABEL_ENDPOINT_URI = '/compliancepolicy/api/v1.0/user/label';
export let pendingLoadLabelPromise: Promise<void> = null;

export default function loadCLPUserLabels() {
    if (isFeatureEnabled('mon-cmp-clp-apolloResolver')) {
        const client = getApolloClient();
        pendingLoadLabelPromise = client
            .query({
                query: MipDataQueryDocument,
            })
            .then(mipData => {
                initializeCLPStore(buildCLPStoreWithChildren(mipData.data.MIPData));
                refreshCLPViewStateForExistingCompose();
                pendingLoadLabelPromise = null;
            });
    } else {
        pendingLoadLabelPromise = makeGetRequest(
            CLP_LABEL_ENDPOINT_URI,
            null /* CorrellationId  */,
            false /* ReturnFullRequest */,
            {
                SupportedMaxVersion: '1.0.48.0',
            } /* CustomHeader */
        ).then(resp => {
            initializeCLPStore(processCLPLabelResponse(resp));
            refreshCLPViewStateForExistingCompose();
            logCLPLabelLoadDatapoint(resp);
            pendingLoadLabelPromise = null;
        });
    }
}
