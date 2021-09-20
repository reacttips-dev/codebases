export function hasUnreadActivity(board: {
  dateLastActivity: Date;
  dateLastView: Date;
}): boolean;

export function hasUnreadActivity(board: {
  dateLastActivity?: Date;
  dateLastView?: Date;
}): boolean | undefined;

export function hasUnreadActivity(board: {
  dateLastActivity?: Date;
  dateLastView?: Date;
}): boolean | undefined {
  const { dateLastActivity, dateLastView } = board;
  if (dateLastActivity && dateLastView) {
    return dateLastActivity > dateLastView;
  } else {
    return undefined;
  }
}

export function checkIsTemplate({
  isTemplate,
  permissionLevel,
  premiumFeatures,
}: {
  isTemplate?: boolean;
  permissionLevel?: string;
  premiumFeatures?: string[];
}) {
  if (!isTemplate) {
    return false;
  } else if (
    permissionLevel === 'public' ||
    premiumFeatures?.includes('privateTemplates')
  ) {
    return true;
  }

  return false;
}
