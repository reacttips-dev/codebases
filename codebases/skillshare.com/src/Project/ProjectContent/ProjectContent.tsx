import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GetProjectQuery } from '../../schema/project';
import { Project } from '../Project';
export var ProjectContent = function (props) {
    var _a = useQuery(GetProjectQuery, {
        variables: {
            projectKey: props.projectKey,
        },
    }), data = _a.data, loading = _a.loading, refetch = _a.refetch;
    var projectData = data === null || data === void 0 ? void 0 : data.projectByKey;
    if ((projectData === null || projectData === void 0 ? void 0 : projectData.title) && props.isModal) {
        window.history.pushState(undefined, projectData.title + " | Skillshare Student Projects", "/projects/" + props.projectKey);
    }
    return (React.createElement(Project, { loading: loading, data: projectData, redirectTo: props.redirectTo, isModal: props.isModal, onRefresh: refetch }));
};
//# sourceMappingURL=ProjectContent.js.map