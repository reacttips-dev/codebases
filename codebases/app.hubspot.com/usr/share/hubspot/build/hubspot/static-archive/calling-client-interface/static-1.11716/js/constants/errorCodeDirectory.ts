export var ErrorCodeDirectory = {
  '11200': {
    description: 'HTTP retrieval failure',
    reference: 'https://www.twilio.com/docs/api/errors/11200',
    translationOptions: {}
  },
  '13223': {
    description: 'Invalid phone number format',
    reference: 'https://www.twilio.com/docs/api/errors/13223',
    translationOptions: {}
  },
  '13224': {
    description: 'Twilio does not support calling this number or the number is invalid',
    reference: 'https://www.twilio.com/docs/api/errors/13224',
    translationOptions: {}
  },
  '13225': {
    description: 'Call blocked by Twilio deny list',
    reference: 'https://www.twilio.com/docs/api/errors/13225',
    translationOptions: {
      hasPaidHubMessage: true,
      jsxOptions: {
        default: {
          href: 'https://community.hubspot.com/t5/Sales-Hub-Tools/Unable-to-call-phone-number-that-may-be-fraudulent-PLEASE-READ/m-p/308379'
        },
        paid: {
          openSupportTicket: true
        }
      }
    }
  },
  '13226': {
    description: 'Invalid country code',
    reference: 'https://www.twilio.com/docs/api/errors/13226',
    translationOptions: {}
  },
  '13227': {
    description: 'Geo Permission configuration is not permitting call',
    reference: 'https://www.twilio.com/docs/api/errors/13227',
    translationOptions: {
      hasTwilioConnectMessage: true,
      jsxOptions: {
        default: {
          href: 'https://www.twilio.com/learn/voice-and-video/toll-fraud',
          external: true
        },
        twilioConnect: {
          href: 'https://www.twilio.com/console/voice/calls/geo-permissions/low-risk',
          external: true
        }
      }
    }
  },
  '20003': {
    description: 'Permission Denied',
    reference: 'https://www.twilio.com/docs/api/errors/20003',
    translationOptions: {
      hasPaidHubMessage: true,
      jsxOptions: {
        paid: {
          openSupportTicket: true
        },
        default: {
          href: 'https://community.hubspot.com/t5/Sales-Hub-Tools/Unable-to-call-due-to-account-suspended-PLEASE-READ-BEFORE/m-p/308378'
        }
      }
    }
  },
  '21212': {
    description: 'Invalid phone number',
    reference: 'https://www.twilio.com/docs/api/errors/21212',
    translationOptions: {}
  },
  '21215': {
    description: 'Invalid From Number, calls to this country are not yet supported',
    reference: 'https://www.twilio.com/docs/api/errors/21215',
    translationOptions: {
      hasTwilioConnectMessage: true,
      jsxOptions: {
        twilioConnect: {
          href: 'https://www.twilio.com/console/voice/calls/geo-permissions/low-risk'
        }
      }
    }
  },
  '21450': {
    description: 'Phone number already verified for your account',
    reference: 'https://www.twilio.com/docs/api/errors/21450',
    translationOptions: {}
  },
  '31000': {
    description: 'Generic Error',
    reference: 'https://www.twilio.com/docs/api/errors/31000',
    translationOptions: {
      jsxOptions: {
        default: {
          href: 'https://knowledge.hubspot.com/articles/kcs_article/calling/what-are-the-technical-requirements-to-use-the-calling-tool'
        }
      }
    }
  },
  '31005': {
    description: 'Connection Error',
    reference: 'https://www.twilio.com/docs/api/errors/31005',
    translationOptions: {}
  },
  '31203': {
    description: 'No valid account',
    reference: 'https://www.twilio.com/docs/api/errors/31203',
    translationOptions: {}
  },
  '31208': {
    description: 'User denied access to microphone.',
    reference: 'https://www.twilio.com/docs/api/errors/31208',
    translationOptions: {
      jsxOptions: {
        default: {
          href: 'https://knowledge.hubspot.com/calling/why-is-my-microphone-not-working-when-making-calls'
        }
      }
    }
  },
  '32014': {
    description: 'Call is terminated because of no audio received',
    reference: 'https://www.twilio.com/docs/api/errors/32014',
    translationOptions: {
      jsxOptions: {
        default: {
          href: 'https://knowledge.hubspot.com/calling/why-is-my-microphone-not-working-when-making-calls'
        }
      }
    }
  },
  '32016': {
    description: 'PSTN Post-Dial Delay timeout',
    reference: 'https://www.twilio.com/docs/api/errors/32016',
    translationOptions: {}
  },
  '53000': {
    description: 'Signaling connection error',
    reference: 'https://www.twilio.com/docs/api/errors/53000',
    translationOptions: {}
  },
  '53405': {
    description: 'Media connection failed or Media activity ceased',
    reference: 'https://www.twilio.com/docs/api/errors/53405',
    translationOptions: {}
  },
  token: {
    description: 'token refresh error',
    reference: 'CallFromBrowserInterface',
    translationOptions: {}
  },
  unknown: {
    description: 'Code not defined in directory',
    reference: 'https://www.twilio.com/docs/api/errors/',
    translationOptions: {
      jsxOptions: {
        default: {
          href: 'https://knowledge.hubspot.com/articles/kcs_article/calling/what-are-the-technical-requirements-to-use-the-calling-tool'
        }
      }
    }
  }
};