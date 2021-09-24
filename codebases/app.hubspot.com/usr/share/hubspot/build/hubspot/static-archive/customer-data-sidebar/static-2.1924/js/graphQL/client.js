'use es6';

import { ApolloClient, InMemoryCache } from '@apollo/client';
import { apiLink } from './hubHttpLink';
import possibleTypes from './possibleTypes.json';
export var createCache = function createCache() {
  return new InMemoryCache({
    possibleTypes: possibleTypes,
    typePolicies: {
      CrmObject: {
        fields: {
          userPermissions: {
            merge: true
          }
        }
      },
      DefaultCrmObject: {
        fields: {
          defaultAssociations: {
            merge: true
          }
        }
      },
      Quote: {
        fields: {
          defaultProperties: {
            merge: true
          }
        }
      },
      Contact: {
        fields: {
          associations: {
            merge: true
          },
          defaultProperties: {
            merge: true
          }
        }
      },
      FeedbackSubmission: {
        fields: {
          defaultProperties: {
            merge: true
          }
        }
      },
      Engagement: {
        fields: {
          defaultProperties: {
            merge: true
          }
        }
      },
      Deal: {
        fields: {
          associations: {
            merge: true
          },
          defaultProperties: {
            merge: true
          }
        }
      },
      Company: {
        fields: {
          associations: {
            merge: true
          },
          defaultProperties: {
            merge: true
          }
        }
      },
      Ticket: {
        fields: {
          associations: {
            merge: true
          },
          defaultProperties: {
            merge: true
          },
          pipelineInfo: {
            merge: true
          }
        }
      },
      LineItem: {
        fields: {
          defaultProperties: {
            merge: true
          }
        }
      },
      Conversation: {
        fields: {
          associations: {
            merge: true
          },
          defaultProperties: {
            merge: true
          }
        }
      },
      ConversationInbox: {
        fields: {
          defaultProperties: {
            merge: true
          }
        }
      },
      QuoteModule: {
        fields: {
          defaultProperties: {
            merge: true
          }
        }
      },
      QuoteModuleField: {
        fields: {
          defaultProperties: {
            merge: true
          }
        }
      },
      QuoteTemplate: {
        fields: {
          defaultProperties: {
            merge: true
          }
        }
      },
      PaymentsSubscription: {
        fields: {
          defaultProperties: {
            merge: true
          }
        }
      },
      PropertyDefinition: {
        keyFields: ['name', 'objectTypeId']
      },
      Pipeline: {
        keyFields: ['pipelineId']
      },
      PipelineStage: {
        keyFields: ['stageId']
      },
      // All objects/types share a global default properties card with `cardId: 0`.
      // To avoid collisions, include objectType and subjectId in the cache key.
      //
      // The same card and cardId (ex: the contacts-to-companies association card)
      // can be queried for different subjects. We don't want to share card data for
      // subject A with card data for subject B, _even for the same cardId_, so include
      // the objectType and subjectId in the cache key.
      //
      // In order to support this, all queries for `CrmRecordCard` must also fetch:
      // ```
      // crmObject {
      //   __typename
      //   id
      // }
      // ```
      CrmRecordCard: {
        keyFields: ['cardId', 'crmObject', ['__typename', 'id']]
      }
    }
  });
};
export var client = new ApolloClient({
  link: apiLink({
    uri: 'graphql/crm'
  }),
  cache: createCache()
});
export var fetch = function fetch(operation) {
  return client.query(operation);
};