const MuiCheckbox = {
  /**
   * This override cannot be applied within the component - can only be done with a theme override or `.MuiCheckbox` CSS class override
   * This is due to this line of code which sets the color property when checked:
   * https://github.com/mui-org/material-ui/blob/1d77ada7f463881677a1cd01983964222f93e5e9/packages/material-ui/src/Checkbox/Checkbox.js#L43
   *
   * We cannot use class overrides because we minimize the class names during the build.
   */
  colorSecondary: {
    '&$checked': {
      color: 'inherit',
    },
  },
};

export default MuiCheckbox;
