import { useQuery } from '@apollo/react-hooks';
import { GetProjectCommentsQuery } from '../../../schema/comments';
export var useProjectCommentsState = function (projectKey) {
    var _a = useQuery(GetProjectCommentsQuery, {
        variables: {
            projectKey: projectKey.toString(),
        },
        notifyOnNetworkStatusChange: true,
    }), data = _a.data, refetch = _a.refetch, isDataPending = _a.loading;
    var comments = (data && data.projectByKey && data.projectByKey.comments) || [];
    var onRefresh = function () {
        refetch();
    };
    return {
        comments: comments,
        isDataPending: isDataPending,
        onRefresh: onRefresh,
    };
};
//# sourceMappingURL=comment-list.state.js.map