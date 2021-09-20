import ApiService from './api-service';
import Queries from './_queries';
import {
    createMapQueryWithAlias
} from 'helpers/graphql-helper';

function createNanodegreeQuery(key, version = '', locale = '') {
    return `
    query NanodegreeQuery {
      nanodegree(key: "${key}" version: "${version}" locale: "${locale}") {
        ${Queries.generalNodeFields}
        cohorts {
          id
          start_at
          due_at
          end_at
        }
        version
        locale
        title
        color_scheme
        enrollment {
          id
          product_variant
          variant
          high_touch
          open_ended
          service_model_id
          includes_personal_mentor
          includes_student_hub
          includes_knowledge_reviews
          includes_welcome_flow
          preorder
          started_at
          state
          static_access {
            access_expiry_at
          }
          attributes
          schedule {
            hidden
          }
        }
        nd_units {
          id
        }
        hero_image {
          url
        }
        forum_path
        summary
        is_graduated
        is_term_based
        is_default
        packaging_options
        cloud_resources_aws_service_id
        is_ready_for_graduation
        is_reviewer
        project_deadlines {
          ${Queries.projectDeadlineFields}
        }
        ${Queries.userState}
        ${Queries.nanodegreeAggregatedState}
        ${Queries.resources}
        start_date
        parts(filter_by_enrollment_service_model: true) {
          ${Queries.generalNodeFields}
          version
          locale
          summary
          part_type
          is_public
          locked_reason
          locked_until
          ${Queries.resources}
          ${Queries.image}
          modules {
            ${Queries.generalNodeFields}
            version
            locale
            is_project_module
            forum_path
            lessons {
              ${Queries.lessonFields}
              ${Queries.image}
              ${Queries.video}
              lab {
                ${Queries.labFields}
              }
              project {
                ${Queries.projectFields}
              }
              concepts {
                ${Queries.generalNodeFields}
              }
            }
          }
        }
      }
    }
  `;
}

function createNanodegreeProjectStatesQuery(key, version = '', locale = '') {
    return `
    query NanodegreeProjectStatesQuery {
      nanodegree(key: "${key}" version: "${version}" locale: "${locale}") {
        key
        parts(filter_by_enrollment_service_model: true) {
          key
          project {
            key
            semantic_type
            progress_key
            ${Queries.projectState}
          }
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
    }
  `;
}

function createDefaultNanodegreesQuery(nanodegrees) {
    return createMapQueryWithAlias('nanodegrees', nanodegrees, [
        'id',
        'key',
        'version',
        'locale',
        'title',
        'is_default',
        `parts(filter_by_enrollment_service_model: true) {
      modules {
        lessons {
          project {
            key
            progress_key
          }
        }
      }
    }`,
    ]);
}

function createNanodegreesByKeyQuery(key) {
    return `
    query NanodegreesByKeyQuery {
      nanodegrees(key: "${key}") {
        ${Queries.generalNodeFields}
        version
        locale
      }
    }
  `;
}

function withKeyVersionLocale(createNanodegreeQuery) {
    return (key, contentVersion, contentLocale) => {
        return ApiService.gql(
            createNanodegreeQuery(key, contentVersion, contentLocale)
        ).then((response) => {
            return response.data.nanodegree;
        });
    };
}

export default {
    fetch: withKeyVersionLocale(createNanodegreeQuery),
    fetchByKey(nanodegreeKey) {
        return ApiService.gql(createNanodegreesByKeyQuery(nanodegreeKey)).then(
            (response) => {
                return response.data.nanodegrees;
            }
        );
    },
    fetchProjectStates: withKeyVersionLocale(createNanodegreeProjectStatesQuery),
    fetchDefaultNanodegrees(nanodegrees) {
        let defaultNanodegrees = {};
        return ApiService.gql(createDefaultNanodegreesQuery(nanodegrees)).then(
            (response) => {
                _.each(response.data, (nanodegreeVersions) => {
                    const firstVersion = _.first(nanodegreeVersions);
                    const nanodegreeKey = firstVersion.key;
                    defaultNanodegrees[nanodegreeKey] =
                        _.find(nanodegreeVersions, {
                            is_default: true
                        }) || firstVersion;
                });
                return defaultNanodegrees;
            }
        );
    },
};