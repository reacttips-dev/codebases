export const setErrorMessage = (error) => {
  let errorMessage = [];
  switch (error.error) {
    case "Cookies are not enabled in current environment":
    case "idpiframe_initialization_failed":
      console.error("Please enable cookies to 'Continue with Google'");
      break;
    case "popup_closed_by_user":
      errorMessage.push("Please enable cookies to 'Continue with Google'");
      break;
    default:
      break;
  }
  return errorMessage;
};
