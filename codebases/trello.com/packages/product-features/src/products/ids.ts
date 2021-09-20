const Gold = {
  monthly: 37,
  yearly: 38,
  bc: 10,
} as const;

const BusinessClassV2 = {
  monthly: 96,
  yearly: 97,
} as const;

const BusinessClassV3 = {
  monthly: 98,
  yearly: 99,
} as const;

const BusinessClassV3_1 = {
  monthly: 103,
  yearly: 104,
} as const;

const BusinessClassV3_3 = {
  monthly: 110,
  yearly: 111,
} as const;

// Experimental
const StandardV1a = {
  monthly: 115,
  yearly: 116,
} as const;

// Experimental
const StandardV1b = {
  monthly: 117,
  yearly: 118,
} as const;

// Final v1 of Trello Standard
const StandardV1 = {
  monthly: 119,
  yearly: 116,
} as const;

const BCPO = {
  v2: 101,
  v3: 102,
  v3_1: 107,
  v3_3: 112,
} as const;

const Enterprise = {
  v1: 100,
  v1_1: 108,
  v1_2: 109,
  v2_1: 113,
  v2_2: 114,
} as const;

export type ProductId =
  | typeof Gold[keyof typeof Gold]
  | typeof BusinessClassV2[keyof typeof BusinessClassV2]
  | typeof BusinessClassV3[keyof typeof BusinessClassV3]
  | typeof BusinessClassV3_1[keyof typeof BusinessClassV3_1]
  | typeof BusinessClassV3_3[keyof typeof BusinessClassV3_3]
  | typeof StandardV1a[keyof typeof StandardV1a]
  | typeof StandardV1b[keyof typeof StandardV1b]
  | typeof StandardV1[keyof typeof StandardV1]
  | typeof BCPO[keyof typeof BCPO]
  | typeof Enterprise[keyof typeof Enterprise];

export const Products = {
  Member: {
    Gold,
  },
  Organization: {
    BusinessClass: {
      v2: BusinessClassV2,
      v3: BusinessClassV3,
      v3_1: BusinessClassV3_1,
      v3_3: BusinessClassV3_3,
      current: BusinessClassV3_3,
    },
    Standard: {
      v1a: StandardV1a,
      v1b: StandardV1b,
      v1: StandardV1,
    },
  },
  BCPO,
  Enterprise,
} as const;
