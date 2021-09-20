import { useEffect } from 'react';
import { addSubscription } from 'app/scripts/init/subscriber';
import { sendErrorEvent } from '@trello/error-reporting';

interface GenericSubscription {
  idModel: string;
}

interface MemberSubscription extends GenericSubscription {
  modelType: 'Member';
  tags: ('messages' | 'updates')[];
}

interface BoardSubscription extends GenericSubscription {
  modelType: 'Board';
  tags: ('clientActions' | 'updates')[];
}

interface OrganizationSubscription extends GenericSubscription {
  modelType: 'Organization';
  tags: ('allActions' | 'updates')[];
}

type ModelType = 'Member' | 'Board' | 'Organization';
type SubscriptionType =
  | MemberSubscription
  | BoardSubscription
  | OrganizationSubscription;

export const isMongoId = (id?: string): boolean => {
  return !!id && /^[0-9a-fA-F]{24}$/.test(id);
};

const getEntry = (modelType: ModelType, idModel: string): SubscriptionType => {
  switch (modelType) {
    case 'Member':
      return {
        idModel,
        modelType,
        tags: ['messages', 'updates'],
      };
    case 'Board':
      return {
        idModel,
        modelType,
        tags: ['clientActions', 'updates'],
      };
    case 'Organization':
      return {
        idModel,
        modelType,
        tags: ['allActions', 'updates'],
      };
    default:
      throw new Error('Invalid modelType');
  }
};

export const useSocketSubscription = (
  modelType: ModelType,
  idModel?: string,
  skip?: boolean,
) => {
  useEffect(() => {
    if (!skip) {
      if (idModel && isMongoId(idModel)) {
        const unsubscribe = addSubscription(getEntry(modelType, idModel));
        return unsubscribe;
      } else {
        sendErrorEvent(
          new Error(
            `Cannot setup subscription to model '${modelType}' using an empty or invalid id: ${idModel}.`,
          ),
        );
      }
    }

    return () => {};
  }, [modelType, idModel, skip]);
};
