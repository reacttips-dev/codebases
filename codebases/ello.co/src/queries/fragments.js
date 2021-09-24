export const imageVersionProps = `
  fragment imageVersionProps on Image {
    url
    metadata { height width type size }
  }
`

export const tshirtImageVersions = `
  fragment tshirtImageVersions on TshirtImageVersions {
    small { ...imageVersionProps }
    regular { ...imageVersionProps }
    large { ...imageVersionProps }
    original { ...imageVersionProps }
  }
`

export const responsiveImageVersions = `
  fragment responsiveImageVersions on ResponsiveImageVersions {
    xhdpi { ...imageVersionProps }
    hdpi { ...imageVersionProps }
    mdpi { ...imageVersionProps }
    ldpi { ...imageVersionProps }
    optimized { ...imageVersionProps }
    original { ...imageVersionProps }
    video { ...imageVersionProps }
  }
`

export const pageHeaderImageVersions = `
  fragment pageHeaderImageVersions on ResponsiveImageVersions {
    xhdpi { ...imageVersionProps }
    hdpi { ...imageVersionProps }
    optimized { ...imageVersionProps }
    video { ...imageVersionProps }
  }
`

export const authorSummary = `
  fragment authorSummary on User {
    id
    username
    name
    avatar { ...tshirtImageVersions }
    currentUserState { relationshipPriority }
    settings {
      hasLovesEnabled
      hasSharingEnabled
      hasRepostingEnabled
      hasCommentingEnabled
      postsAdultContent
    }
  }
`

export const fullUser = `
  fragment fullUser on User {
    id
    username
    name
    location
    formattedShortBio
    isCommunity
    badges
    avatar { ...tshirtImageVersions }
    coverImage { ...responsiveImageVersions }
    currentUserState { relationshipPriority }
    externalLinksList { icon type text url }
    userStats {
      followingCount
      followersCount
      lovesCount
      postsCount
      totalViewsCount
    }
    settings {
      postsAdultContent
      hasCommentingEnabled
      hasRepostingEnabled
      hasSharingEnabled
      hasLovesEnabled
      isHireable
      isCollaborateable
    }
    metaAttributes { title description robots image }
    categoryUsers {
      id
      role
      category { id name slug }
    }
  }
`

export const contentProps = `
  fragment contentProps on ContentBlocks {
    linkUrl
    kind
    data
    links { assets }
  }
`

export const artistInviteSubmissionSummary = `
  fragment artistInviteSubmissionSummary on ArtistInviteSubmission {
    id
    status
    artistInvite { id slug title }
  }
`

export const artistInviteSubmissionAction = `
  fragment artistInviteSubmissionAction on ArtistInviteSubmissionAction {
    href label method body { status }
  }
`

export const artistInviteSubmissionDetails = `
  fragment artistInviteSubmissionDetails on ArtistInviteSubmission {
    id
    status
    artistInvite { id slug title }
    actions {
      approve { ...artistInviteSubmissionAction }
      decline { ...artistInviteSubmissionAction }
      select { ...artistInviteSubmissionAction }
      unapprove { ...artistInviteSubmissionAction }
      unselect { ...artistInviteSubmissionAction }
    }
  }
`

export const categoryPostSummary = `
  fragment categoryPostSummary on CategoryPost {
    id
    status
    actions {
      feature { method href }
      unfeature { method href }
    }
    category { ...categorySummary }
  }
`

export const categoryPostDetails = `
  fragment categoryPostDetails on CategoryPost {
    id
    status
    featuredBy { username }
    submittedBy { username }
    actions {
      feature { method href }
      unfeature { method href }
    }
    category { ...categorySummary }
  }
`

export const postSummary = `
  fragment postSummary on Post {
    id
    token
    createdAt
    artistInviteSubmission { ...artistInviteSubmissionSummary }
    summary { ...contentProps }
    content { ...contentProps }
    repostContent { ...contentProps }
    author { ...authorSummary }
    categoryPosts { ...categoryPostSummary }
    assets { id attachment { ...responsiveImageVersions } }
    postStats { lovesCount commentsCount viewsCount repostsCount }
    currentUserState { watching loved reposted }
  }
`

export const fullPost = `
  fragment fullPost on Post {
    id
    token
    createdAt
    artistInviteSubmission { ...artistInviteSubmissionDetails }
    summary { ...contentProps }
    content { ...contentProps }
    repostContent { ...contentProps }
    author { ...authorSummary }
    categoryPosts { ...categoryPostDetails }
    assets { id attachment { ...responsiveImageVersions } }
    postStats { lovesCount commentsCount viewsCount repostsCount }
    currentUserState { watching loved reposted }
  }
`

export const categorySummary = `
  fragment categorySummary on Category {
    id
    slug
    name
  }
`

export const categoryUserDetails = `
  fragment categoryUserDetails on CategoryUser {
    id
    role
    category { ...categorySummary }
  }
`

export const postStream = `
  fragment postStream on PostStream {
    next
    isLastPage
    posts { ...postSummary repostedSource { ...postSummary } }
  }
`

export const fullComment = `
  fragment fullComment on Comment {
    id
    createdAt
    author { ...authorSummary }
    summary { ...contentProps }
    content { ...contentProps }
    assets { id attachment { ...responsiveImageVersions } }
    parentPost { id }
  }
`

export const fullCommentAllFragments = `
  ${fullComment}
  ${imageVersionProps}
  ${responsiveImageVersions}
  ${tshirtImageVersions}
  ${contentProps}
  ${authorSummary}
`

export const postSummaryAllFragments = `
  ${imageVersionProps}
  ${responsiveImageVersions}
  ${tshirtImageVersions}
  ${contentProps}
  ${authorSummary}
  ${categorySummary}
  ${categoryPostSummary}
  ${artistInviteSubmissionSummary}
  ${postSummary}
`

export const postStreamAllFragments = `
  ${postSummaryAllFragments}
  ${postStream}
`

export const fullPostAllFragments = `
  ${imageVersionProps}
  ${responsiveImageVersions}
  ${tshirtImageVersions}
  ${contentProps}
  ${authorSummary}
  ${categoryPostDetails}
  ${categorySummary}
  ${artistInviteSubmissionAction}
  ${artistInviteSubmissionDetails}
  ${fullPost}
`

export const fullUserAllFragments = `
  ${imageVersionProps}
  ${responsiveImageVersions}
  ${tshirtImageVersions}
  ${categorySummary}
  ${fullUser}
`
