import localStorage from 'js/lib/coursera.store';

const SKILL_TAGGING_DIALOG_DISMISSED = 'skill-tagging-dialog-dismissed';

type Props = {
  courseId: string;
  itemId: string;
};

const dismissSkillTaggingDialog = ({ courseId, itemId }: Props) => {
  localStorage.set(`${SKILL_TAGGING_DIALOG_DISMISSED}-${courseId}-${itemId}`, true);
};

const wasSkillTaggingDialogDismissed = ({ courseId, itemId }: Props) => {
  return localStorage.get(`${SKILL_TAGGING_DIALOG_DISMISSED}-${courseId}-${itemId}`) === true;
};

export { wasSkillTaggingDialogDismissed, dismissSkillTaggingDialog };
