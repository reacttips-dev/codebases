import { graphql } from "gatsby"
import { GetStartedPage } from "../../components/GetStartedPage"
import { withData } from "../../components/CustomPageLayout"

function CustomPageGetStartedTemplate(props) {
  return withData(props)(GetStartedPage)
}

export default CustomPageGetStartedTemplate

export const pageQuery = graphql`
  query GetStartedTemplateQuery($id: String!) {
    contentfulCustomPage(id: { eq: $id }) {
      ...CustomPage
    }
  }
`
