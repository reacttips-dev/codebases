import { naptimeForumTypes } from 'bundles/discussions/constants';
import path from 'js/lib/path';

/*
 * This function finds the id of the current forum that is assocated with the current discussions path or passed-in
 * parameters. It will add a prop called `currentForumId`.
 *
 * This function should be passed to `connectToRouter` and sequenced after a call to get the courseForums and
 * mentorForums from `onDemandCourseForums.v1` and `onDemandMentorForums.v1`.
 */
export default (router, props) => {
  if (!props.courseSlug) {
    throw new Error('routerConnectToCurrentForum requires course slug as argument');
  }
  const courseForums = props.courseForums || [];
  const mentorForums = props.mentorForums || [];
  const groupForums = props.groupForums || [];
  const weekNumber = props.weekNumber || router.params.week_number;
  const subForumId = router.location.query.subForum_id;
  const forumId = props.forumId || router.params.forum_id;
  const groupId = props.groupId || router.params.group_id;
  // TODO (dwinegar) hacky solution, fix when converting discussion prompt
  const itemId = props.itemId || (router.location.pathname.indexOf('/discussionPrompt/') < 0 && router.params.item_id);
  let currentForumId;

  let forumItemId;

  if (subForumId) {
    const itemForum = courseForums.find((forum) => {
      return forum.id === subForumId;
    });
    forumItemId = itemForum && itemForum.id;
  }
  if (weekNumber) {
    const weekForum = courseForums.find((forum) => {
      return (
        forum.forumType.typeName === 'weekForumType' &&
        forum.forumType.definition.weekNumber === parseInt(weekNumber, 10)
      );
    });
    currentForumId = weekForum && weekForum.id;
  } else if (groupId) {
    let groupForum = groupForums.find((forum) => {
      return forum.forumType.definition.groupId === groupId;
    });
    // group forum can be by group id (legacy) or by forum id
    if (!groupForum) {
      groupForum = groupForums.find((forum) => {
        return forum.forumId === groupId;
      });
    }
    currentForumId = groupForum && groupForum.id;
  } else if (forumId) {
    const forums = courseForums.concat(mentorForums);
    const currentForum = forums.find((forum) => {
      return forum.forumId === forumId || forum.legacyForumId === forumId;
    });
    currentForumId = currentForum && currentForum.id;
  } else if (itemId) {
    const itemForum = courseForums.find((forum) => {
      return forum.forumType.definition.itemId === itemId;
    });
    currentForumId = itemForum && itemForum.id;
  } else {
    const rootForum = courseForums.find((forum) => forum.forumType.typeName === naptimeForumTypes.rootForumType);
    currentForumId = rootForum && rootForum.id;
  }
  const currentForum = courseForums
    .concat(mentorForums)
    .concat(groupForums)
    .find((forum) => forum.id === currentForumId);
  const subForum =
    forumItemId &&
    courseForums
      .concat(mentorForums)
      .concat(groupForums)
      .find((forum) => forum.id === forumItemId);
  let currentForumUrl;
  // item forum routes are special
  if (currentForum && currentForum.forumType.typeName === naptimeForumTypes.itemForumType) {
    const splitLocation = router.location.pathname.split('discussions');
    // drop anything after the last 'discussions', do this so that we can allow 'discussions' as a string in the URL
    splitLocation.pop();
    currentForumUrl = path.join(splitLocation.join('discussions'), 'discussions');
  } else if (currentForum) {
    currentForumUrl = path.join('/learn', props.courseSlug, currentForum.link);
  }

  return {
    ...props,
    subForumId,
    currentForumId,
    currentForum,
    subForum,
    currentForumUrl,
    rootPath: `/learn/${props.courseSlug}`,
    contextId:
      currentForum && (currentForum.forumType.typeName === naptimeForumTypes.groupForumType ? groupId : props.courseId),
  };
};
