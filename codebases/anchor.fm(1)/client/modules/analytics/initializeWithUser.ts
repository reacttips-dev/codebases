import AnchorAPI from '../AnchorAPI';

interface LoginRequestUser {
  userIdentities: {
    customerid?: string;
    email?: string;
    other?: string;
  };
}

interface LoginResult {
  body: string;
  getUser: () => {} | null;
  httpCode: number;
}

export function initializeWithUser(
  isLoggedIn: boolean,
  shareableUserId?: string,
  optimizelyUserId?: string
) {
  if (typeof mParticle === 'undefined') {
    return;
  }
  if (isLoggedIn) {
    AnchorAPI.getUserEmailAddress().then(emailAddress => {
      if (emailAddress) {
        setUpIdentity(emailAddress, shareableUserId, optimizelyUserId);
      }
    });
  }
}

function setUpIdentity(
  emailAddress: string,
  shareableUserId?: string,
  optimizelyUserId?: string
) {
  const loginRequestUserObject: LoginRequestUser = { userIdentities: {} };

  if (shareableUserId && emailAddress && optimizelyUserId) {
    loginRequestUserObject.userIdentities.customerid = shareableUserId;
    loginRequestUserObject.userIdentities.email = emailAddress;
    loginRequestUserObject.userIdentities.other = optimizelyUserId;
    mParticle.Identity.login(loginRequestUserObject, onLoginResult);
  }

  function onLoginResult(result: LoginResult) {
    if (result.getUser()) {
      // If user exists, login succeeded
      return;
    }

    const codes = mParticle.Identity.HTTPCodes;

    switch (result.httpCode) {
      case codes.noHttpCoverage:
      case codes.activeIdentityRequest: // occasionally login will fail due to another Identity request processing
      case 429: // in rare circumstances, requests will be throttled and need to be retried
        setTimeout(() => {
          setUpIdentity(emailAddress, shareableUserId, optimizelyUserId);
        }, 1000);
        break;
      default:
        break;
    }
  }
}
