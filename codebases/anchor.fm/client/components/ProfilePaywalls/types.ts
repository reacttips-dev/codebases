export interface ProfilePaywallsFormData {
  name: string;
  email: string;
  token: {
    id: string;
    card: {
      country: string;
      // eslint-disable-next-line
      address_zip: string;
    };
  };
  country?: string;
  province?: string;
}

// The values are used for analytics screen view events
export enum ProfilePaywallsCurrentScreen {
  PAYMENT_FORM = 'Payment Form',
  EMAIL_CONSENT = 'Email Consent',
  CONFIRMATION_PAGE = 'Confirmation',
  COUNTRY_ERROR = 'Country Error',
  EMAIL_ZIPCODE_ERROR = 'Email ZipCode Error',
}
