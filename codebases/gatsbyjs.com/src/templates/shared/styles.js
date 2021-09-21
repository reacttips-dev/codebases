// everything in here is supposed to be used with `sx` from `theme-ui`
// so use those design tokens and shorthand syntax

export const showcaseList = {
  display: `flex`,
  flexWrap: `wrap`,
  justifyContent: `space-evenly`,
  p: 7,
}

export const showcaseItem = {
  display: `flex`,
  flex: `1 0 0`,
  flexDirection: `column`,
  m: 7,
  maxWidth: 350,
  minWidth: 259, // shows 3 items/row on windows > 1200px wide
  position: `relative`,
}

export const withTitleHover = {
  "& .title": {
    transition: t => {
      return `box-shadow ${t.transitions.speed.slow} ${t.transitions.curve.default}, transform ${t.transitions.speed.slow} ${t.transitions.curve.default}`
    },
  },
  "&:hover .title": {
    boxShadow: t => `inset 0 -1px 0px 0px ${t.colors.link.hoverBorder}`,
    color: `purple.60`,
  },
}

export const loadMoreButton = {
  alignItems: `center`,
  display: `flex`,
  flexFlow: `row wrap`,
  mt: 0,
  mx: `auto`,
  mb: 10,
}

export const screenshot = {
  borderRadius: 1,
  boxShadow: `raised`,
  mb: 4,
  transition: t => t.transitions.default,
}

export const screenshotHover = {
  bg: `transparent`,
  color: `purple.60`,
  "& .gatsby-image-wrapper": {
    transform: t => `translateY(-${t.space[2]})`,
    boxShadow: `overlay`,
  },
}

export const shortcutIcon = {
  pl: 2,
  "&&": {
    borderBottom: `none`,
    color: `text.secondary`,
    "&:hover": {
      color: `purple.60`,
    },
  },
}

export const meta = {
  alignItems: `baseline`,
  fontSize: 1,
  "&&": {
    color: `text.secondary`,
  },
}

export const filterButton = {
  alignItems: `flex-start`,
  background: `none`,
  border: `none`,
  color: `text.secondary`,
  cursor: `pointer`,
  display: `flex`,
  fontSize: 1,
  justifyContent: `space-between`,
  margin: 0,
  p: 0,
  pr: 6,
  py: 2,
  textAlign: `left`,
  width: `100%`,
  ":hover": {
    color: `purple.60`,
  },
}

export const filterCheckbox = {
  fontSize: 2,
  mr: 3,
}
