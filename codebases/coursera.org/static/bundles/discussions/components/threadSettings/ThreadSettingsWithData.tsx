import groupAuthorizationPromise from 'pages/open-course/common/promises/groupAuthorizationPromise';
import _ from 'underscore';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import connectToRouter from 'js/lib/connectToRouter';
import routerConnectToCurrentForum from 'bundles/discussions/utils/routerConnectToCurrentForum';
import ThreadSettingsV2 from 'bundles/discussions/components/threadSettings/ThreadSettingsV2';
import { Forum, ForumPost } from 'bundles/discussions/lib/types';

export async function groupAuthorized({ currentForum, authenticated, isSuperUser }): Promise<boolean> {
  const groupId = currentForum?.forumType?.definition?.groupId;
  return groupAuthorizationPromise(groupId, authenticated, isSuperUser)
    .then((groupAuthResponse) => {
      if (typeof groupAuthResponse === 'object') {
        if ('canModerate' in groupAuthResponse) {
          return groupAuthResponse.canModerate;
        }
      }
      return false;
    })
    .catch(() => false);
}

type CanModerate = { authenticated: boolean; isSuperUser: boolean; currentForum: any; hasModerationRole: boolean };

export async function canModerate({
  authenticated,
  isSuperUser,
  currentForum,
  hasModerationRole,
}: CanModerate): Promise<boolean> {
  const isModerator = authenticated && (isSuperUser || hasModerationRole);
  const isGroupAuthorized =
    authenticated && !isModerator && (await groupAuthorized({ currentForum, authenticated, isSuperUser }));
  return isModerator || isGroupAuthorized || false;
}

type PropsToComponent = {
  question: ForumPost;
  isClosed: boolean;
  isPinned: boolean;
  enableModeratorControls: Promise<boolean>;
};

type PropsFromCaller = {
  question: ForumPost;
  currentForum: Forum;
  courseSlug: string;
};

export default _.compose(
  connectToRouter(routerConnectToCurrentForum),
  connectToStores<PropsToComponent, PropsFromCaller>(
    ['ThreadSettingsStore', 'CourseMembershipStore', 'ApplicationStore'],
    ({ ThreadSettingsStore, CourseMembershipStore, ApplicationStore }, { question, currentForum }) => {
      const data = {
        question,
        isClosed: ThreadSettingsStore.isClosed(),
        isPinned: ThreadSettingsStore.isPinned(),
        authenticated: ApplicationStore.isAuthenticatedUser(),
        isSuperUser: ApplicationStore.isSuperuser(),
        hasModerationRole: CourseMembershipStore.hasModerationRole(),
        currentForum,
      };
      return {
        ...data,
        enableModeratorControls: canModerate(data).catch(() => false),
      };
    }
  )
)(ThreadSettingsV2);
