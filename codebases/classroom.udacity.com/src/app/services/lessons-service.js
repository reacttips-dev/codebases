import ApiService from './api-service';
import NanodegreeHelper from 'helpers/nanodegree-helper';
import Queries from './_queries';

function createLessonQuery(id, showQuizAnswers, rootKey) {
    return `
    query LessonQuery {
      lesson(id: ${id}, root_key: "${rootKey}") {
        ${Queries.generalNodeFields}
        version
        locale
        summary
        display_workspace_project_only
        ${Queries.resources}
        project {
          ${Queries.projectFields}
        }
        lab {
          ${Queries.labFields}
        }
        concepts {
          ${Queries.generalNodeFields}
          ${Queries.userState}
          atoms {
            ...on EmbeddedFrameAtom {
              ${Queries.generalNodeFields}
              external_uri
              instructor_notes
            }
            ...on TextAtom {
              ${Queries.generalNodeFields}
              text
              instructor_notes
            }
            ...on TaskListAtom {
              ${Queries.generalNodeFields}
              instructor_notes
              ${Queries.userState}
              tasks
              positive_feedback
              video_feedback {
                youtube_id
                china_cdn_id
              }
              description
            }
            ...on ImageAtom {
              ${Queries.generalNodeFields}
              url
              non_google_url
              caption
              alt
              width
              height
              instructor_notes
            }
            ...on VideoAtom {
              ${Queries.generalNodeFields}
              instructor_notes
              ${Queries.video}
            }
            ...on ReflectAtom {
              ${Queries.generalNodeFields}
              instructor_notes
              ${Queries.userState}
              question {
                ${Queries.quizTextQuestion}
              }
              ${Queries.quizAnswer}
            }
            ...on RadioQuizAtom {
              ${Queries.generalNodeFields}
              instructor_notes
              ${Queries.userState}
              question {
                prompt
                answers {
                  id
                  text
                  ${showQuizAnswers ? 'is_correct' : ''}
                }
              }
            }
            ...on CheckboxQuizAtom {
              ${Queries.generalNodeFields}
              instructor_notes
              ${Queries.userState}
              question {
                prompt
                answers {
                  id
                  text
                  ${showQuizAnswers ? 'is_correct' : ''}
                }
              }
            }

            ...on MatchingQuizAtom {
              ${Queries.generalNodeFields}
              instructor_notes
              ${Queries.userState}
              question {
                complex_prompt {
                  text
                }
                concepts_label
                answers_label
                concepts {
                  text
                  correct_answer {
                    id
                    text
                  }
                }
                answers {
                  id
                  text
                }
              }
            }
            ...on ValidatedQuizAtom {
              ${Queries.generalNodeFields}
              instructor_notes
              ${Queries.userState}
              question {
                prompt
                matchers {
                  ...on RegexMatcher {
                    expression
                  }
                }
              }
            }
            ...on QuizAtom {
              ${Queries.generalNodeFields}
              instructor_notes
              ${Queries.userState}
              instruction {
                ${Queries.video}
                text
              }
              question {
                ...on ImageFormQuestion {
                  title
                  alt_text
                  background_image
                  non_google_background_image
                  semantic_type
                  evaluation_id
                  widgets {
                    group
                    initial_value
                    label
                    marker
                    model
                    is_text_area
                    tabindex
                    placement {
                      height
                      width
                      x
                      y
                    }
                  }
                }
                ...on ProgrammingQuestion {
                  title
                  semantic_type
                  evaluation_id
                  initial_code_files {
                    text
                    name
                  }
                }
                ...on CodeGradedQuestion {
                  title
                  prompt
                  semantic_type
                  evaluation_id
                }
                ...on IFrameQuestion {
                  title
                  semantic_type
                  evaluation_id
                  initial_code_files {
                    text
                    name
                  }
                  external_iframe_uri
                }
                ${Queries.quizTextQuestion}
              }
              ${Queries.quizAnswer}
            }
            ...on WorkspaceAtom {
              ${Queries.generalNodeFields}
              workspace_id
              pool_id
              view_id
              gpu_capable
              configuration
              starter_files
            }
          }
        }
      }
    }
  `;
}

export default {
    fetch(id, root) {
        return ApiService.gql(
            createLessonQuery(id, NanodegreeHelper.isStatic(root), root.key)
        ).then((response) => {
            return response.data.lesson;
        });
    },
};