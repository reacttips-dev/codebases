import { graphql } from "gatsby"
import { HomePage } from "../../components/HomePage/new"
import { withData } from "../../components/CustomPageLayout"

function CustomPageHomeTemplate(props) {
  return withData(props)(HomePage)
}

export default CustomPageHomeTemplate

export const pageQuery = graphql`
  query HomeTemplateQuery($id: String!) {
    contentfulCustomPage(id: { eq: $id }) {
      ...CustomPage
    }
  }
`
