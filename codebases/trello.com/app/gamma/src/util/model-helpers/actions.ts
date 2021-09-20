/* eslint-disable @trello/disallow-filenames */
import { ActionModel } from 'app/gamma/src/types/models';

export const isCommentLike = ({ type }: Pick<ActionModel, 'type'>): boolean => {
  if (!type) {
    return false;
  }

  return type === 'commentCard' || type === 'copyCommentCard';
};
