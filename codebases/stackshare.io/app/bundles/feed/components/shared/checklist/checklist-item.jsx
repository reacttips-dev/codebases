import {
  HAS_STACK,
  FIVE_TOOLS_FOLLOWED,
  KEEPING_UP_WITH_TOOLS,
  COMPANY_MEMBER,
  UPVOTED_THREE_DECISIONS,
  SHARED_DECISION
} from '../../../../../shared/enhancers/checklist-enhancer';
import {ONBOARDING_CHECKLIST_CLICK, ONBOARDING_CHECKLIST_HINT} from '../../../constants/analytics';

export default function CheckListItem({
  item,
  onChecklistAction,
  checklistItemLoading,
  children,
  sendAnalyticsEvent
}) {
  const {slug, completed} = item;
  let title = '';
  let hint = '';
  let handleHint = () => {};
  let handleClick = () => {};
  const itemLoading = checklistItemLoading === slug;

  switch (slug) {
    case HAS_STACK:
      title = 'Create your personal stack';
      hint =
        'Use your stack profile as your tech resume. Easily list out the technologies you know and share the link on your resume and personal site.';
      handleHint = () => sendAnalyticsEvent(ONBOARDING_CHECKLIST_HINT, {slug: HAS_STACK});
      if (!completed)
        handleClick = () => {
          sendAnalyticsEvent(ONBOARDING_CHECKLIST_CLICK, {slug: HAS_STACK});
          window.open('/onboarding/build-your-stack');
        };
      break;
    case FIVE_TOOLS_FOLLOWED:
      title = 'Follow five tools';
      hint =
        'Follow more tools to improve your feed and keep up with the latest updates on the technologies that you care about.';
      handleHint = () => sendAnalyticsEvent(ONBOARDING_CHECKLIST_HINT, {slug: FIVE_TOOLS_FOLLOWED});
      if (!completed)
        handleClick = () => {
          sendAnalyticsEvent(ONBOARDING_CHECKLIST_CLICK, {slug: FIVE_TOOLS_FOLLOWED});
          onChecklistAction(FIVE_TOOLS_FOLLOWED);
        };
      break;
    case KEEPING_UP_WITH_TOOLS:
      title = 'Keep up with the tools you follow';
      hint =
        'Receive a weekly digest with trending articles and decisions about the tools you follow.';
      handleHint = () =>
        sendAnalyticsEvent(ONBOARDING_CHECKLIST_HINT, {slug: KEEPING_UP_WITH_TOOLS});
      if (!completed)
        handleClick = () => {
          sendAnalyticsEvent(ONBOARDING_CHECKLIST_CLICK, {slug: KEEPING_UP_WITH_TOOLS});
          onChecklistAction(KEEPING_UP_WITH_TOOLS);
        };
      break;
    case COMPANY_MEMBER:
      title = "Become a member of your company's stack";
      hint = "Become a member of your company so you can edit your company's stacks.";
      handleHint = () => sendAnalyticsEvent(ONBOARDING_CHECKLIST_HINT, {slug: COMPANY_MEMBER});
      if (!completed)
        handleClick = () => {
          sendAnalyticsEvent(ONBOARDING_CHECKLIST_CLICK, {slug: COMPANY_MEMBER});
          window.open('/become-company-member');
        };
      break;
    case UPVOTED_THREE_DECISIONS:
      title = 'Upvote three good decisions';
      hint =
        'Upvote a decision that you find useful to improve its ranking on other user feeds and encourage the contributor to provide more content.';
      handleHint = () =>
        sendAnalyticsEvent(ONBOARDING_CHECKLIST_HINT, {slug: UPVOTED_THREE_DECISIONS});
      if (!completed)
        handleClick = () => {
          sendAnalyticsEvent(ONBOARDING_CHECKLIST_CLICK, {slug: UPVOTED_THREE_DECISIONS});
          onChecklistAction(UPVOTED_THREE_DECISIONS);
        };
      break;
    case SHARED_DECISION:
      title = 'Share a decision';
      hint =
        "Help developers like you benefit from one another's experience and build your reputation, with far less effort than writing a full blog post.";
      handleHint = () => sendAnalyticsEvent(ONBOARDING_CHECKLIST_HINT, {slug: SHARED_DECISION});
      if (!completed)
        handleClick = () => {
          sendAnalyticsEvent(ONBOARDING_CHECKLIST_CLICK, {slug: SHARED_DECISION});
          onChecklistAction(SHARED_DECISION);
        };
      break;
  }

  return children(title, hint, handleHint, handleClick, itemLoading);
}
