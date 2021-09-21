/** @jsx jsx */
import { jsx } from "theme-ui"
import { Fragment } from "react"
import { Link } from "gatsby"
import qs from "qs"

const ShowcaseItemCategories = ({ categories, onCategoryClick }) => {
  if (!categories) {
    return ""
  }

  return categories.map((c, i) => (
    <Fragment key={i}>
      <Link
        sx={{
          "&&": {
            color: t => t.colors.text.secondary,
            fontWeight: `body`,
            textDecoration: `none`,
            borderBottom: `none`,
            "&:hover": {
              color: `purple.60`,
            },
          },
        }}
        to={`/showcase/?${qs.stringify({
          filters: [c.name],
        })}`}
        onClick={e => {
          e.preventDefault()
          if (onCategoryClick) {
            onCategoryClick(c.name)
          }
        }}
        category={c.name}
      >
        {c.name}
      </Link>
      {i === categories.length - 1 ? `` : `, `}
    </Fragment>
  ))
}

export default ShowcaseItemCategories
