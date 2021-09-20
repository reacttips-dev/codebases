const generalNodeFields = `
  id
  key
  title
  semantic_type
  is_public
`;

const projectState = `
  project_state {
    state
    submissions {
      created_at
      updated_at
      url
      result
      ungradeable_tag
      is_legacy
      id
      status
    }
  }
`;

const projectDeadlineFields = `
  due_at
  node_key
  progress_key
`;

const nanodegreeAggregatedState = `
  aggregated_state {
    node_key
    completion_amount
    completed_count
    concept_count
    last_viewed_child_key
    part_aggregated_states {
      node_key
      completed_at
      completion_amount
      completed_count
      concept_count
      last_viewed_child_key
      module_aggregated_states {
        node_key
        completed_at
        completion_amount
        completed_count
        concept_count
        last_viewed_child_key
        lesson_aggregated_states {
          node_key
          completed_at
          completed_count
          concept_count
          completion_amount
          last_viewed_child_key
        }
      }
    }
  }
`;

const courseAggregatedState = `
  aggregated_state {
    node_key
    completion_amount
    completed_count
    concept_count
    last_viewed_child_key
    lesson_aggregated_states {
      node_key
      completed_at
      completion_amount
      completed_count
      concept_count
      last_viewed_child_key
    }
  }
`;

const partAggregatedState = `
  aggregated_state {
    node_key
    completion_amount
    completed_count
    concept_count
    last_viewed_child_key
  }
`;

const userState = `
  user_state {
    node_key
    completed_at
    last_viewed_at
    unstructured
  }
`;

const userSettings = `
  settings {
    skip_classroom_welcome
    dismissed_upgrade_ids
    onboarding_completed_keys
    nanodegree_feedback_viewed_counts
    account_delete_state
    nanodegree_feedback_share_click_keys
    nanodegree_feedback_share_viewed_counts
  }
`;

const resources = `
  resources {
    files {
      name
      uri
    }
  }
`;

const image = `
  image {
    url
    width
    height
  }
`;

const videoFields = `
  youtube_id
  china_cdn_id
  topher_id
  transcodings {
    uri_480p_mp4
    uri_720p_mp4
    uri_480p_1000kbps_mp4
  }
`;

const video = `
  video {
    ${videoFields}
  }
`;

const quizTextQuestion = `
  ...on TextQuestion {
    title
    semantic_type
    evaluation_id
    text
  }
`;

const quizAnswer = `
  answer {
    text
    ${video}
  }
`;

const labFields = `
  id
  key
  version
  locale
  estimated_session_duration
  duration
  is_public
  semantic_type
  title
  evaluation_objective
  partners
  overview {
    title
    summary
    key_takeaways
    ${video}
  }
  details {
    text
  }
  review_video {
    ${videoFields}
  }
  result {
    state
    skill_confidence_rating_after
    skill_confidence_rating_before
  }
  workspace {
    ${generalNodeFields}
    workspace_id
    pool_id
    view_id
    configuration
    starter_files
  }
`;

const projectFields = `
  key
  progress_key
  version
  locale
  duration
  semantic_type
  title
  description
  is_public
  summary
  forum_path
  rubric_id
  terminal_project_id
  reviews_project_id
  is_career
  ${image}
`;

const instructorFields = `
  image_url
  first_name
`;

const lessonFields = `
  id
  key
  progress_key
  version
  locale
  semantic_type
  summary
  title
  duration
  is_public
  is_project_lesson
  display_workspace_project_only
`;

const nanodegreesAndCourses = `
  ...on Nanodegree {
    key
    progress_key
    title
    locale
    version
    summary
    semantic_type
    is_term_based
    is_graduated
    is_public
    is_career_oriented
    color_scheme
    packaging_options
    cohorts {
      start_at
      end_at
    }
    enrollment {
      is_ready_for_graduation
      includes_student_hub
      includes_knowledge_reviews
      includes_welcome_flow
      service_model_id
      high_touch
      started_at
      state
      schedule {
        hidden
      }
    }
  }
  ...on Course {
    key
    title
    locale
    version
    summary
    semantic_type
    is_graduated
    is_graduation_legacy
    is_public
    enrollment {
      is_ready_for_graduation
      includes_student_hub
      includes_knowledge_reviews
      includes_welcome_flow
      service_model_id
      high_touch
      started_at
      state
      schedule {
        hidden
      }
    }
  }
`;

// SXP-124: Temporary abstraction until the UserBase query is moved to enrollments
const userBase = `
  affiliate_program_key
  can_edit_content
  email
  first_name
  id
  is_email_verified
  is_phone_number_verified
  last_name
  nickname
  phone_number
  preferred_language
  right_to_access
  social_logins {
    provider
    id
  }
  ${userSettings}
`;

// SXP-124: Temporary abstraction until the MeQuery is moved to enrollments
const commonProgram = `
  key
  semantic_type
  title
  is_public
  user_state {
    node_key
    last_viewed_at
  }
`;

// SXP-124: Temporary abstraction until the UserBase query is moved to enrollments
const nanodegreesEnrollment = `
  static_access {
    access_expiry_at
  }
  service_model_id
  includes_personal_mentor
  includes_knowledge_reviews
  includes_student_hub
  includes_welcome_flow
  attributes
  schedule {
    hidden
  }
`;

// SXP-124: Temporary abstraction until the UserBase query is moved to enrollments
// root_node is a duplicate of the "node: root_node {...}" later in the same query
// It is only kept here to minimize the refactoring while adding a new feature
// this helps the shape stay the same, but later can be combined into one field
const commonEnrollment = `
  id
  key
  locale
  state
  version
  version_limit
  is_ready_for_graduation
  root_node {
    locale
    version
    semantic_type
  }
`;

// SXP-124: Temporary abstraction until the UserBase query is moved to enrollments
const idKLV = `
  id
  key
  locale
  version
`;

// SXP-124: Temporary abstraction until the UserBase query is moved to enrollments
const typeTitleState = `
  semantic_type
  title
  user_state {
    last_viewed_at
  }
`;

export default {
    typeTitleState,
    commonEnrollment,
    commonProgram,
    nanodegreesEnrollment,
    labFields,
    generalNodeFields,
    idKLV,
    projectDeadlineFields,
    projectState,
    projectFields,
    lessonFields,
    nanodegreeAggregatedState,
    courseAggregatedState,
    partAggregatedState,
    userBase,
    userState,
    image,
    video,
    resources,
    quizTextQuestion,
    quizAnswer,
    instructorFields,
    userSettings,
    nanodegreesAndCourses,
};