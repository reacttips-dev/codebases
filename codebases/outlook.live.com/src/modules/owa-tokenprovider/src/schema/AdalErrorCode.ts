const AdalErrorCode = {
    //AAD Error Codes Reference: https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-aadsts-error-codes
    NoUserLogin: 'AADSTS50058',
    InvalidResourceUrl: 'AADSTS50001',
    NoPreAuth: 'AADSTS65001', // "AADSTS65001: The user or administrator has not consented to use the application with ID."
    UserAborted: 'AADSTS65004', //when user closes prompt
    NotConsent: 'AADSTS70011',
};

export default AdalErrorCode;
