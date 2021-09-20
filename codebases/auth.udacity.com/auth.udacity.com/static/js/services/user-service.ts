import Http from './http';
import { config, initialize as initConfig } from '../config';
import {
  Headers,
  HttpResponse,
  RegistrationParams,
  RequirementsParams
} from './types';
import AdblockHelper from './helpers/adblock-helper';

initConfig();

const RECAPTCHA_HEADER_NAME = 'X-Udacity-ReCAPTCHA-UserAPI';
const AD_BLOCK_HEADER_NAME = 'X-Udacity-Ads-Are-Blocked';
// Requirement returned by User API authentication calls if the user has 2FA
// enabled.
const ONE_TIME_PASSWORD_REQ = 'OTP';
// Requirement returned by User API if the user's birthdate needs to be
// gathered before they can be signed in.
const BIRTHDATE_REQ = 'BIRTHDATE';
export const http = new Http(config.USER_API_URL as string);

const getDefaultHeaders = (): Headers => ({
  [AD_BLOCK_HEADER_NAME]: AdblockHelper.getAdsAreBlocked()
});

export default {
  AD_BLOCK_HEADER_NAME,
  RECAPTCHA_HEADER_NAME,
  ONE_TIME_PASSWORD_REQ,
  BIRTHDATE_REQ,

  authenticate(
    email: string,
    password: string,
    recaptcha: string = '',
    otp: string = '',
    next: string = ''
  ): Promise<HttpResponse> {
    const headers: Headers = getDefaultHeaders();
    if (recaptcha) {
      headers[RECAPTCHA_HEADER_NAME] = recaptcha;
    }

    return http.post(
      '/signin',
      {
        email: email.toLowerCase(),
        password,
        otp,
        next
      },
      headers
    );
  },

  register({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    birthdate,
    referrerCode,
    clickID,
    recaptcha
  }: RegistrationParams): Promise<HttpResponse> {
    const headers: Headers = getDefaultHeaders();
    if (recaptcha) {
      headers[RECAPTCHA_HEADER_NAME] = recaptcha;
    }
    return http.post(
      '/signup',
      {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone_number: phoneNumber,
        referrer_code: referrerCode,
        click_id: clickID,
        birthdate
      },
      headers
    );
  },

  signupNoPassword(params: RegistrationParams): Promise<HttpResponse> {
    const headers: Headers = getDefaultHeaders();
    if (params.recaptcha) {
      headers[RECAPTCHA_HEADER_NAME] = params.recaptcha;
    }
    return http.post(
      '/signup_no_password',
      {
        first_name: params.firstName,
        last_name: params.lastName,
        email: params.email,
        birthdate: params.birthdate,
        phone_number: params.phoneNumber
      },
      headers
    );
  },

  requirementsCallback(params: RequirementsParams): Promise<HttpResponse> {
    return http.post(
      '/signin/requirements/callback',
      params,
      getDefaultHeaders()
    );
  },

  verifyEmail(
    userId: string,
    code: string,
    recaptcha: string
  ): Promise<Object> {
    const headers: Headers = getDefaultHeaders();
    if (recaptcha) {
      headers[RECAPTCHA_HEADER_NAME] = recaptcha;
    }

    return http.post(
      '/verify_email',
      {
        user_id: userId,
        code
      },
      headers
    );
  },

  requestResetPassword(email: string, recaptcha: string): Promise<Object> {
    const headers: Headers = getDefaultHeaders();
    if (recaptcha) {
      headers[RECAPTCHA_HEADER_NAME] = recaptcha;
    }

    return http.post(
      '/password_reset_email',
      {
        email: email.toLowerCase()
      },
      headers
    );
  },

  resetPassword(
    password: string,
    token: string,
    recaptcha: string
  ): Promise<Object> {
    const headers: Headers = getDefaultHeaders();
    if (recaptcha) {
      headers[RECAPTCHA_HEADER_NAME] = recaptcha;
    }

    return http.post(
      '/password_reset',
      {
        password,
        reset_token: token
      },
      headers
    );
  },

  get2fa(): Promise<Object> {
    return http.get('/me/2fa', getDefaultHeaders()).then(
      (response: HttpResponse): Object => ({
        isEnabled: response.data.enabled
      })
    );
  },

  get2faWithCodes(): Promise<Object> {
    return http.get('/me/2fa?projection=codes', getDefaultHeaders()).then(
      (response: HttpResponse): Object => ({
        isEnabled: response.data.enabled,
        backupCodes: response.data.backup_codes
      })
    );
  },

  init2fa(otp: string): Promise<Object> {
    return http
      .post(
        '/me/2fa/init',
        {
          otp
        },
        getDefaultHeaders()
      )
      .then(
        (response: HttpResponse): Object => ({
          seedUri: response.data.seed_uri,
          backupCodes: response.data.backup_codes
        })
      );
  },

  verify2fa(otp: string): Promise<Object> {
    return http.post('/me/2fa/verify', { otp }, getDefaultHeaders());
  },

  remove2fa(otp: string): Promise<Object> {
    return http.post('/me/2fa/remove', { otp }, getDefaultHeaders());
  },

  reset2faCodes(otp: string): Promise<Object> {
    return http.post('/me/2fa/reset_codes', { otp }, getDefaultHeaders()).then(
      (response: HttpResponse): Object => ({
        backupCodes: response.data.backup_codes
      })
    );
  },

  getTermsOfUseVersion(ut: string): Promise<Object> {
    return http.get(
      `/signin/requirements/terms_of_use_versions?user_token=${ut}`,
      getDefaultHeaders()
    );
  },

  ssoSignInUrl(email: string, idp: string, next: string): string {
    return `${config.USER_API_URL}/signin/sso?email=${encodeURIComponent(
      email
    )}&next=${encodeURIComponent(next)}&idp=${encodeURIComponent(idp)}`;
  },

  webfinger(email: string): Promise<string> {
    return fetch(
      `https://sso.udacity.com/.well-known/webfinger?rel=okta:idp&resource=acct:${email}`
    )
      .then((response: Response): Promise<any> => response.json())
      .then((response: any): string => {
        const links = response.links;
        if (!links || links.length === 0) {
          return '';
        }
        const linkProps = links[0].properties;
        if (!linkProps) {
          return '';
        }
        return linkProps['okta:idp:id'];
      });
  }
};
