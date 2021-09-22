import _ from 'underscore';
import discussionsForumsHOC from 'bundles/discussions/components/discussionsForumsHOC';
import connectToRouter from 'js/lib/connectToRouter';
import routerConnectToCurrentForum from 'bundles/discussions/utils/routerConnectToCurrentForum';
import mapExecuteActionToProps from 'js/lib/mapExecuteActionToProps';
import { clearThreadsCache } from 'bundles/discussions/actions/ThreadsActions';
import { savePost } from 'bundles/discussions/actions/ThreadDetailsActions';
import ReplyCMLInput from './ReplyCMLInput';

export default _.compose(
  discussionsForumsHOC({ fields: ['link', 'title'] }),
  connectToRouter(routerConnectToCurrentForum),
  mapExecuteActionToProps((executeAction) => {
    return {
      handleSubmit: (post) => {
        executeAction(clearThreadsCache);
        executeAction(savePost, post);
      },
    };
  })
)(ReplyCMLInput);
