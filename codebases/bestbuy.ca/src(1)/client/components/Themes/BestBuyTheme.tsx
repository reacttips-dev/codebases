
import { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";
import spacing from "@material-ui/core/styles/spacing";

/**
 *  BestBuyCanada is the default theme used in ecomm-webapp.
 */

export const bestBuyTheme = (): ThemeOptions => {
  // TODO: after rebranding is pushed to production, rework this
  const isNewBrandingActive = process.env.BBY_BRANDING_NEW;
  const primaryMainColor = isNewBrandingActive ? "#0046BE" : "#085eb9";
  const primaryDarkColor = isNewBrandingActive ? "#001E73" : "#003b64";
  return {
    palette: {
      primary: {
        main: primaryMainColor,
        dark: primaryDarkColor,
      },
    },
    spacing,
    typography: {
      fontFamily: "Open Sans, Roboto, Arial, sans-serif",
    },
    overrides: {
      MuiButton: {
        root: {
          textTransform: "none",
          color: "inherit",
        },
      },
      MuiSnackbar: {
        root: {
          actionColor: "#ffd500",
        },
      },
    },
  };
};

export default bestBuyTheme;
