import { action } from 'satcheljs/lib/legacy';
import { getUnifiedGroupDetailsPromiseOverride } from 'owa-groups-adaptors';
import { getUnifiedGroupDetails, isSuccess } from 'owa-groups-services';
import { setGroupSiteStatus, getGroupsStore } from 'owa-groups-shared-store';
import GroupSiteStatus from 'owa-groups-sharepoint-commands/lib/schema/GroupSiteStatus';
import type UnifiedGroupDetails from 'owa-service/lib/contract/UnifiedGroupDetails';
import addOrUpdateGroup from 'owa-groups-shared-store/lib/utils/addOrUpdateGroup';
import addGroupSiteStatus from 'owa-groups-shared-store/lib/utils/addGroupSiteStatus';
import beforeGetGroupDetailsStartAction from './beforeGetGroupDetailsStartAction';
import updateCurrentGroupIdAndTenantIdAction from './updateCurrentGroupIdAndTenantIdAction';
import { GroupDetailsDocument } from './graphql/__generated__/groupDetailsQuery.interface';
import { getApolloClient } from 'owa-apollo';
import { isFeatureEnabled } from 'owa-feature-flags';
import parseGroupDetailsGqlResponse from './utils/parseGroupDetailsGqlResponse';

const parseUnifiedGroupDetailsResponse = (
    response: UnifiedGroupDetails | undefined,
    groupSmtpAddress: string,
    onSuccessCallback?: () => void,
    onErrorCallback?: () => void
) => {
    const groupDetails: UnifiedGroupDetails = response;
    if (!groupDetails || groupDetails === undefined) {
        handleError(groupSmtpAddress, onErrorCallback);
        return;
    }

    addOrUpdateGroup(getGroupsStore(), groupDetails.SmtpAddress, {
        basicInformation: null,
        groupDetails: groupDetails,
        members: null /*Not available at this point*/,
        groupDetailsError: false,
    });

    updateCurrentGroupIdAndTenantIdAction(
        groupDetails.ExternalDirectoryObjectId,
        groupDetails.ExternalDirectoryOrganizationId
    );

    addGroupSiteStatus(groupSmtpAddress, groupDetails);
    if (onSuccessCallback) {
        onSuccessCallback();
    }
};

const handleError = (groupSmtpAddress: string, onErrorCallback?: () => void) => {
    // #77190: this error should show up on the action bar
    addOrUpdateGroup(getGroupsStore(), groupSmtpAddress, {
        basicInformation: null,
        groupDetails: null,
        members: null,
        groupDetailsError: true,
    });

    // GroupSiteStatus is set to Provisioning in 'beforeGetGroupDetailsStartAction'
    // Resetting it to NotFound here when error is encountered
    setGroupSiteStatus(groupSmtpAddress, GroupSiteStatus.NotFound);

    if (onErrorCallback) {
        onErrorCallback();
    }
};

const getGroupDetailsAction = action('getGroupDetailsAction')(async function (
    groupSmtpAddress: string,
    loadFullDetails?: boolean,
    onSuccessCallback?: () => void,
    onErrorCallback?: () => void
) {
    beforeGetGroupDetailsStartAction(groupSmtpAddress);

    if (isFeatureEnabled('grp-groupDetails-gql')) {
        const apolloClient = getApolloClient();
        try {
            const groupDetailsGqlResponse = await apolloClient.query({
                query: GroupDetailsDocument,
                variables: {
                    mailboxSmtpAddress: groupSmtpAddress,
                    loadFullDetails: loadFullDetails,
                },
            });

            const groupDetailsGql = groupDetailsGqlResponse.data?.groupDetails;

            //VSO: Remove GQL parsing to JSON
            const unifiedGroupDetailsJson = groupDetailsGql
                ? parseGroupDetailsGqlResponse(groupDetailsGql)
                : undefined;

            parseUnifiedGroupDetailsResponse(
                unifiedGroupDetailsJson,
                groupSmtpAddress,
                onSuccessCallback,
                onErrorCallback
            );
        } catch (e) {
            handleError(groupSmtpAddress, onErrorCallback);
        }
    } else {
        const getter = getUnifiedGroupDetailsPromiseOverride || getUnifiedGroupDetails;
        getter(groupSmtpAddress, loadFullDetails)
            .then(result => {
                if (!result || !result.Body || !isSuccess(result.Body)) {
                    handleError(groupSmtpAddress, onErrorCallback);
                    return;
                }

                parseUnifiedGroupDetailsResponse(
                    result.Body.GroupDetails,
                    groupSmtpAddress,
                    onSuccessCallback,
                    onErrorCallback
                );
            })
            .catch(e => {
                handleError(groupSmtpAddress, onErrorCallback);
            });
    }
});

export default getGroupDetailsAction;
