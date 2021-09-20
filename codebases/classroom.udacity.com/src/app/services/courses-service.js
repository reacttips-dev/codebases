import ApiService from './api-service';
import Queries from './_queries';

function createCourseNameQuery(key, version = '', locale = '') {
    return `
    query CourseNameQuery {
      course(key: "${key}" version: "${version}" locale: "${locale}") {
        title
        key
      }
    }
  `;
}

function createCourseQuery(key, version = '', locale = '') {
    return `
    query CourseQuery {
      course(key: "${key}" version: "${version}" locale: "${locale}") {
        id
        key
        version
        locale
        semantic_type
        forum_path
        title
        is_public
        is_default
        ${Queries.userState}
        ${Queries.resources}
        instructors {
          ${Queries.instructorFields}
        }
        project_deadline {
          ${Queries.projectDeadlineFields}
        }
        project {
          ${Queries.projectFields}
        }
        ${Queries.courseAggregatedState}
        lessons {
          ${Queries.lessonFields}
          ${Queries.image}
          ${Queries.resources}
          concepts {
            id
            key
            is_public
            semantic_type
            title
            ${Queries.userState}
          }
          project {
            ${Queries.projectFields}
            ${Queries.projectState}
          }
        }
      }
    }
  `;
}

function createPartAsCourseQuery(key, version = '', locale = '') {
    return `
    query PartAsCourseQuery {
      partAsCourse: part(key: "${key}" version: "${version}" locale: "${locale}") {
        id
        key
        version
        locale
        semantic_type
        title
        is_public
        ${Queries.userState}
        ${Queries.resources}
        ${Queries.partAggregatedState}
        modules {
          lessons {
            ${Queries.lessonFields}
            ${Queries.image}
            ${Queries.resources}
            concepts {
              id
              key
              is_public
              semantic_type
              title
              ${Queries.userState}
            }
            project {
              ${Queries.projectFields}
              ${Queries.projectState}
            }
            lab {
              ${Queries.labFields}
            }
          }
        }
        enrollment {
          includes_welcome_flow
          state
        }
      }
    }
  `;
}

function createPaidCourseProjectStatesQuery(key, version = '', locale = '') {
    return `
    query PaidCourseProjectStatesQuery {
      part(key: "${key}" version: "${version}" locale: "${locale}") {
        key
        modules {
          lessons {
            project {
              key
              title
              semantic_type
              progress_key
              ${Queries.projectState}
            }
          }
        }
      }
    }
  `;
}

export default {
    fetch(key, contentVersion, contentLocale, isPartAsCourse) {
        let query;
        if (isPartAsCourse) {
            query = createPartAsCourseQuery(key, contentVersion, contentLocale);
        } else {
            query = createCourseQuery(key, contentVersion, contentLocale);
        }
        return ApiService.gql(query).then((response) => {
            return {
                course: response.data.course,
                partAsCourse: response.data.partAsCourse,
            };
        });
    },
    fetchName(key, contentVersion, contentLocale) {
        return ApiService.gql(
            createCourseNameQuery(key, contentVersion, contentLocale)
        ).then((response) => {
            return response.data.course;
        });
    },
    fetchProjectStates(key, version, locale) {
        return ApiService.gql(
            createPaidCourseProjectStatesQuery(key, version, locale)
        ).then((response) => {
            return response.data.part;
        });
    },
};