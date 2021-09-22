import { classificationPropertyMap } from './constants';
import type MessageClassificationType from 'owa-service/lib/contract/MessageClassificationType';
import getExtendedPropertyValue from 'owa-mail-store/lib/utils/getExtendedPropertyValue';
import { isNullOrWhiteSpace } from 'owa-string-utils';

export default function getClassificationFromMessage(message): MessageClassificationType {
    const Id = getExtendedPropertyValue(
        message,
        null /*tag*/,
        null /*name*/,
        classificationPropertyMap.Id.id
    );

    const Description = getExtendedPropertyValue(
        message,
        null /*tag*/,
        null /*name*/,
        classificationPropertyMap.Description.id
    );

    const IsClassified = getExtendedPropertyValue(
        message,
        null /*tag*/,
        null /*name*/,
        classificationPropertyMap.IsClassified.id
    );

    if (!IsClassified || isNullOrWhiteSpace(Description) || isNullOrWhiteSpace(Id)) {
        return null;
    }

    const Name = getExtendedPropertyValue(
        message,
        null /*tag*/,
        null /*name*/,
        classificationPropertyMap.Name.id
    );

    return {
        Id,
        Name,
        Description,
    };
}
