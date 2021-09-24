import gql from 'graphql-tag';

export const company = gql`
  query company($id: ID!) {
    company(id: $id) {
      id
      name
      path
      slug
      imageUrl
      bannerImageUrl
      privateMode
      githubOrgUrl
      verified
      description
      twitterUsername
      websiteUrl
      location
      plans {
        slug
      }
      privatePlanAmounts
      members {
        count
      }
      emailAddress
      managedByStripe
    }
  }
`;
