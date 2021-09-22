export const PROP_TYPE_COLOR = (props, propName, componentName) => {
  if (!/^#[0-9a-fA-F]{6}$/.test(props[propName])) {
    return new Error(
      'Invalid prop `' + propName + '` supplied to' +
      ' `' + componentName + '`. Must be a valid color code.'
    )
  }
}
