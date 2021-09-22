import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import createRecipientWell from 'owa-readwrite-recipient-well/lib/utils/createRecipientWell';
import type PeopleIdentity from 'owa-service/lib/contract/PeopleIdentity';

export default function mapPeopleIdentityToRecipientWellWithFindControlViewState(
    peopleIdentity: PeopleIdentity[]
): RecipientWellWithFindControlViewState {
    // map conditional clauses
    if (peopleIdentity == null) {
        return createRecipientWell(null);
    }
    const initialMailboxes = peopleIdentity.map(identity => ({
        Name: identity.DisplayName,
        EmailAddress: identity.SmtpAddress,
        RoutingType: identity.RoutingType,
    }));
    return createRecipientWell(null, initialMailboxes);
}
