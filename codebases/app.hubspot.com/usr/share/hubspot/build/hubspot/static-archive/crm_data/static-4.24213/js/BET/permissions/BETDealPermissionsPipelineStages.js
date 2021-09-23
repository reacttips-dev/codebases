'use es6';

import { fromJS } from 'immutable';
export default fromJS({
  QA: {
    default: {
      // Hubspot Sales Team Process
      blacklistAddStages: ['closedwon', // CLOSED WON
      'bfdd4888-f2f2-417e-9310-38818a28ddaa', // MANUAL DING REQUIRED
      '467b66d6-bc15-41bf-bae0-03cbc24b4006' // PURCHASED NOT DINGED
      ],
      blacklistRemoveStages: ['closedlost', // CLOSED LOST
      'closedwon', // CLOSED WON
      'bfdd4888-f2f2-417e-9310-38818a28ddaa', // MANUAL DING REQUIRED
      '467b66d6-bc15-41bf-bae0-03cbc24b4006' // PURCHASED NOT DINGED
      ],
      closedLost: 'closedlost'
    },
    '37f54e6a-2dcc-4800-919a-4af81cd013da': {
      // Contact Change
      closedLost: '5d79a601-1509-46fc-9c5f-66f0613c5140'
    },
    '489d75c9-6d9c-4c21-9337-78479e9eab8a': {
      // Additional URL
      blacklistAddStages: ['7e267087-ac36-47d2-95c1-3c48b8a1fc1c', //CLOSED WON
      '7af69936-e7da-44ea-afe0-f126cf42916a' // PURCHASED NOT DINGED
      ],
      blacklistRemoveStages: ['118251b5-e1ce-4caf-bf8f-5423bf1f2fd8', //CLOSED LOST
      '7e267087-ac36-47d2-95c1-3c48b8a1fc1c', //CLOSED WON
      '7af69936-e7da-44ea-afe0-f126cf42916a', // PURCHASED NOT DINGED
      '856f2637-879f-4905-91a0-85ccb90ea80c' // DEAD DUPLICATE
      ],
      closedLost: '118251b5-e1ce-4caf-bf8f-5423bf1f2fd8'
    },
    '9b4c4174-b45f-4039-99e5-0407ba9fab50': {
      // Additional Services
      closedLost: '94d29ab5-9fa9-4757-ac63-50a6a694e1f4'
    },
    '9a8ef7b3-3525-42e1-b595-86d51512a25f': {
      // MRR Upgrade
      blacklistAddStages: ['0aeba8be-7c87-490d-a3c2-5c03f85342c7', // CLOSED WON
      '327be878-4720-408a-8190-525f51517623' // PURCHASED NOT DINGED
      ],
      blacklistRemoveStages: ['075d6493-c914-45e5-aa6a-80fd4fc61583', // CLOSED LOST
      '0aeba8be-7c87-490d-a3c2-5c03f85342c7', // CLOSED WON
      '327be878-4720-408a-8190-525f51517623', // PURCHASED NOT DINGED
      '768ed4f3-0f29-42a9-ad76-3a640989b33e' // DEAD DUPLICATE
      ],
      closedLost: '075d6493-c914-45e5-aa6a-80fd4fc61583'
    },
    '01478afe-76e3-456e-a016-290ebd4d0bf7': {
      // Double Comp
      closedLost: 'b7879922-feda-4f67-aaef-177a03dcbe1f'
    },
    '6d9d2ec3-b80f-4e42-8d00-991cb9cf8e47': {
      // Renewal
      closedLost: 'ea230232-e63b-4523-a5a5-cf43d7050255'
    },
    'bec8a5a8-e960-47a6-a823-383d0fcb6628': {
      // Contract Notification
      closedLost: '518b6f04-bbfa-4a18-aa4b-8a017d9b542d'
    },
    'b0fcedf4-0fde-4771-9c1a-92236f6a5c99': {
      // MMR Downgrade
      closedLost: 'fdd7cca3-ff14-4479-88ec-f19011bd5b24'
    },
    '7c8c0fe3-1bc8-4f90-a718-363a07d76201': {
      // Promotion
      closedLost: 'a063d7cf-b7bf-4591-9edf-832a074c4dc1'
    }
  },
  PROD: {
    default: {
      // Hubspot Sales Team Process
      blacklistAddStages: ['e8b4d558-d53b-4594-8451-69ad8d0abc1c', // CLOSED WON
      '05e6bc54-0d94-4edb-92ca-d791164dab14', // MANUAL DING REQUIRED
      'closed_lost' // PURCHASED NOT DINGED
      ],
      blacklistRemoveStages: ['ebe0fe63-a0c1-4167-b2d7-b06156616b17', // CLOSED LOST
      'e8b4d558-d53b-4594-8451-69ad8d0abc1c', // CLOSED WON
      '05e6bc54-0d94-4edb-92ca-d791164dab14', // MANUAL DING REQUIRED
      'closed_lost' // PURCHASED NOT DINGED
      ],
      closedLost: 'ebe0fe63-a0c1-4167-b2d7-b06156616b17'
    },
    'dc15cb0e-592c-4007-803f-a79c1449bd62': {
      // Contact Change
      closedLost: 'd5812a2f-a86e-4ac7-ae63-d6f5caea3f22'
    },
    '39ae23a8-8a0a-44cb-8d26-7bd79bc9437d': {
      // Additional URL
      blacklistAddStages: ['8f996bf5-e073-4951-806c-5cee79f665b5', //CLOSED WON
      'bbeef4ba-6a19-4b7d-beb3-ceaa999ebebe' // PURCHASED NOT DINGED
      ],
      blacklistRemoveStages: ['137b8391-a3a5-4c3c-ad54-5703a1533ba5', //CLOSED LOST
      '8f996bf5-e073-4951-806c-5cee79f665b5', //CLOSED WON
      'bbeef4ba-6a19-4b7d-beb3-ceaa999ebebe', // PURCHASED NOT DINGED
      'deb5476d-ec11-44f1-a685-b7855ae8cd43' // DEAD DUPLICATE
      ],
      closedLost: '137b8391-a3a5-4c3c-ad54-5703a1533ba5'
    },
    'bea4be68-40d0-42c9-9867-62a204008311': {
      // Additional Services
      closedLost: '2e235bac-b435-4834-a6ba-f9d7ee0a7393'
    },
    '85e453ef-e47b-430e-80d4-bf9df054a8b7': {
      // MRR Upgrade
      blacklistAddStages: ['40ac60cd-eaab-46b4-880d-323e8eadc20a', // CLOSED WON
      '0f028cdf-dfa4-465e-b203-cc7e93bf79c0' // PURCHASED NOT DINGED
      ],
      blacklistRemoveStages: ['ce74f39b-10b3-416d-8797-b2a875ccb8cf', // CLOSED LOST
      '40ac60cd-eaab-46b4-880d-323e8eadc20a', // CLOSED WON
      '0f028cdf-dfa4-465e-b203-cc7e93bf79c0', // PURCHASED NOT DINGED
      '3ef42d9b-6453-4e19-ae8b-13926a841f64' // DEAD DUPLICATE
      ],
      closedLost: 'ce74f39b-10b3-416d-8797-b2a875ccb8cf'
    },
    'a126ca5c-e784-4b2d-8aa3-c8910578b05a': {
      // Double Comp
      closedLost: 'df5bbbee-38e0-4685-9b4d-47f2c065da2d'
    },
    'e00907ea-db09-4ff3-bd58-83516212757a': {
      // Renewal
      closedLost: 'c4bf3747-e75d-4388-b764-3c2cc9f5a3d4'
    },
    'c90cfee0-df03-4abe-a647-8dc4d0aa1afb': {
      // Contract Notification
      closedLost: '76cff0fa-e196-4aa8-b898-8c938252bbe2'
    },
    'eda9c4f2-63c7-4170-80b0-6f6364fa8cc4': {
      // MMR Downgrade
      closedLost: '7a49ee11-da21-4e9f-bc71-29453781125a'
    },
    'a7503d91-a182-4862-81fc-361a70348394': {
      // Promotion
      closedLost: 'e350d3ef-f64e-4c7c-ab94-c48f0759dc0c'
    }
  }
});