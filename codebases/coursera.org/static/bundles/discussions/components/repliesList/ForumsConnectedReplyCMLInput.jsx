import _ from 'underscore';
import discussionsForumsHOC from 'bundles/discussions/components/discussionsForumsHOC';
import connectToRouter from 'js/lib/connectToRouter';
import routerConnectToCurrentForum from 'bundles/discussions/utils/routerConnectToCurrentForum';
import mapExecuteActionToProps from 'js/lib/mapExecuteActionToProps';
import mapProps from 'js/lib/mapProps';
import { naptimeForumTypes } from 'bundles/discussions/constants';
import { clearThreadsCache } from 'bundles/discussions/actions/ThreadsActions';
import { savePost } from 'bundles/discussions/actions/ThreadDetailsActions';
import ReplyCMLInput from 'bundles/discussions/components/repliesList/ReplyCMLInput';

export default _.compose(
  discussionsForumsHOC({ fields: ['link', 'title'] }),
  connectToRouter(routerConnectToCurrentForum),
  mapExecuteActionToProps((executeAction, props) => {
    return {
      handleSubmit: (post) => {
        executeAction(clearThreadsCache);
        executeAction(savePost, post);
      },
    };
  }),
  mapProps((props) => {
    if (props.currentForum && props.currentForum.forumType.typeName === naptimeForumTypes.groupForumType) {
      return {
        contextId: props.currentForum.forumType.definition.groupId,
      };
    }

    return {
      contextId: props.courseId,
    };
  })
)(ReplyCMLInput);
