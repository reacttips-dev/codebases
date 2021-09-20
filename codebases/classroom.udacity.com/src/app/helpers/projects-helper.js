import _ from 'lodash';

function onEachLesson(parts, func) {
    _.each(parts, (part) => {
        _.each(part.modules, (module) => {
            _.each(module.lessons, (lesson) => {
                func(lesson);
            });
        });
    });
}

function shapeProjectStates(projects, project) {
    project.state = _.get(project, 'project_state.state');
    project = _.omit(project, 'project_state');
    // this check should be unneccesary, but included for staff members who may see duplicate projects from hidden lessons
    if (!projects[project.key] ||
        (projects[project.key] && projects[project.key].state !== 'completed')
    ) {
        projects[project.key] = project;
    }
}

let ProjectsHelper = {
    findCompletedProjectsNotInList: (projectStates, projects) => {
        return _.chain(projectStates)
            .filter((projectState) => {
                return (
                    projectState.state === 'completed' &&
                    !_.includes(projects, projectState.key)
                );
            })
            .map((projectState) => projectState.title)
            .value();
    },

    getProjects: (nanodegree) => {
        let projects = [];
        onEachLesson(nanodegree.parts, (lesson) => {
            if (lesson.project) {
                projects.push(lesson.project.key);
            }
        });
        return projects;
    },

    //  this is used to extract project states from a nested nanodegree structure
    //   with projects attached at the lesson level and return them in the form:
    //   {
    //     projectKey: {
    //       key: "projectKey",
    //       title: "title",
    //       state: "completed"
    //     }
    //   }
    //  useful when you want need to load project states for multiple NDs (as on settings page)
    getProjectStates: (nanodegree) => {
        let projects = {};
        onEachLesson(nanodegree.parts, (lesson) => {
            if (lesson.project) {
                shapeProjectStates(projects, lesson.project);
            }
        });
        return projects;
    },
};

export {
    ProjectsHelper as
    default
};