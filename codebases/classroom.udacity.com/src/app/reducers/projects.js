import Actions from 'actions';
import ReducerHelper from 'helpers/reducer-helper';

function updateProjects(state, projects) {
    return ReducerHelper.merge({},
        state,
        _.reduce(
            projects,
            (projectsMap, project) => {
                projectsMap[project.key] = project;
                return projectsMap;
            }, {}
        )
    );
}

export default function(state = {}, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.CLEAR_CONTENT:
            state = {};
            break;

        case Actions.Types.FETCH_ME_COMPLETED:
            var {
                nanodegrees
            } = action.payload;
            _.forEach(nanodegrees, (nanodegree) => {
                var projects = ReducerHelper.getProjectsForNanodegree(nanodegree);
                state = updateProjects(state, projects);
            });
            break;

        case Actions.Types.FETCH_NANODEGREE_COMPLETED:
        case Actions.Types.FETCH_NANODEGREE_PROJECT_STATES_COMPLETED:
            var nanodegree = action.payload;

            var projects = ReducerHelper.getProjectsForNanodegree(nanodegree);

            state = updateProjects(state, projects);
            break;

        case Actions.Types.FETCH_COURSE_COMPLETED:
            var {
                course,
                partAsCourse
            } = action.payload;
            if (course) {
                var projects = _.compact([
                    ReducerHelper.getProjectForCourse(course), // fetches course project (can no longer add in coco)
                    ...ReducerHelper.getProjectsFromCourseLessons(course), // fetches lesson projects
                ]);

                state = updateProjects(state, projects);
            }
            if (partAsCourse) {
                var projects = ReducerHelper.getProjectsFromPartLessons(partAsCourse);
                state = updateProjects(state, projects);
            }
            break;

        case Actions.Types.SET_PROJECT_DEADLINES_COMPLETED:
            {
                const {
                    deadlines
                } = action.payload;

                const updatedProjects = deadlines
                    .map((d) => {
                        const project = _.find(state, {
                            progress_key: d.progress_key
                        });
                        return project ? { ...project,
                            due_at: d.due_at
                        } : null;
                    })
                    .filter((p) => !!p);

                state = updateProjects(state, updatedProjects);
                break;
            }
    }

    return state;
}