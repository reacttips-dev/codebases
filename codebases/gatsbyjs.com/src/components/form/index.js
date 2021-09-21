export const labelStyles = theme => ({
  boxSizing: `border-box`,
  color: theme.colors.blackFade[70],
  display: `block`,
  fontSize: theme.fontSizes[1],
})

export const errorLabelStyles = theme => ({
  color: theme.colors.warning,
})

export const selectStyles = theme => ({
  WebkitAppearance: `none`,
  background: `${theme.colors.white} url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e") no-repeat right .75rem center/8px 10px`,
})

export const inputStyles = theme => ({
  boxSizing: `border-box`,
  backgroundColor: theme.colors.white,
  border: `1px solid ${theme.colors.blackFade[10]}`,
  borderRadius: theme.radii[1],
  caretColor: theme.colors.gatsby,
  color: theme.colors.blackFade[80],
  padding: 8,
  width: `100%`,
  outline: `none`,
  transition: `all ${theme.transitions.speed.default} ${theme.transitions.curve.default}`,
  "::placeholder": {
    color: theme.colors.lilac,
    opacity: 1,
  },
  ":focus": {
    borderColor: theme.colors.gatsby,
    outline: 0,
    boxShadow: `0 0 0 0.2rem ${theme.colors.purple[20]}`,
  },
})

export const textAreaStyles = theme => ({
  boxSizing: `border-box`,
  backgroundColor: theme.colors.white,
  border: `1px solid ${theme.colors.blackFade[10]}`,
  borderRadius: theme.radii[1],
  padding: 8,
  width: `100%`,
  outline: `none`,
  transition: `all ${theme.transitions.speed.default} ${theme.transitions.curve.default}`,
  "::placeholder": {
    color: theme.colors.lilac,
    opacity: 1,
  },
  ":focus": {
    borderColor: theme.colors.lilac,
    outline: 0,
    boxShadow: `0 0 0 0.2rem ${theme.colors.purple[20]}`,
  },
})

export const formStyles = theme => ({
  boxSizing: `border-box`,
  padding: theme.space[8],
})
